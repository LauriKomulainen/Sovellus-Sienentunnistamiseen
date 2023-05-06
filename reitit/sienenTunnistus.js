const dotenv = require("dotenv");
const express = require("express");
const multer = require("multer");
const PredictionApi = require("@azure/cognitiveservices-customvision-prediction");
const msRest = require("@azure/ms-rest-js");
const router = express.Router();
const storage = require("@azure/storage-blob");
const upload = multer();
const { DefaultAzureCredential } = require("@azure/identity");
const { CosmosClient } = require("@azure/cosmos");

dotenv.config({ path: "./config.env" });

//customvision avaimet
const predictionKey = process.env.APPSETTING_PREDICTION_KEY;
const predictionEndpoint = process.env.APPSETTING_PREDICTION_ENDPOINT;
const publishIterationName = process.env.APPSETTING_PUBLISH_ITERATION_NAME;
const sampleProject_id = process.env.APPSETTING_CUSTOM_VISION_PROJECT_ID;

//blobupload avaimet
const sasKey = process.env.APPSETTING_BLOB_SAS_TOKEN;
const url = process.env.APPSETTING_IMAGE_BLOB_URL;

const blobContainer = "images";

//muokkaa tämä nimeäminen jotenkin järkevästi, esim pvm+kellonaika
const filenamestart = "AANEWIMAGE";
const filenameend = Math.random().toString(16).slice(2);
const blobName = filenamestart + filenameend;

//tietokanta credentiaalit, keytä ei välttis tarvii jos käytetään roolipohjasia oikeuksia mutta jätetään varmuuden vuoks vielä
const endpoint = process.env.APPSETTING_COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;

//tietokantaitemille date
const date = new Date();

//cosmosClient tietokantayhteyttä varten
const cosmosClient = new CosmosClient({
  endpoint,
  aadCredentials: new DefaultAzureCredential(),
});

//predictor kuvantunnistusta varten
const predictor_credentials = new msRest.ApiKeyCredentials({
  inHeader: { "Prediction-key": predictionKey },
});

const predictor = new PredictionApi.PredictionAPIClient(
  predictor_credentials,
  predictionEndpoint
);

router.post("/tallenna", upload.single("image"), async (req, res) => {
  try {
    const image = req.file.buffer;

    const results = await predictor.classifyImage(
      sampleProject_id,
      publishIterationName,
      image
    );

    //tässä uploadataan kuva blobstorageen
    var login = `${url}/${blobContainer}/${blobName}?${sasKey}`;
    var blockBlobClient = new storage.BlockBlobClient(
      login,
      new storage.AnonymousCredential()
    );
    blockBlobClient.uploadData(image);

    //ensin kannan tiedot, sitten lähetetään tunnistustiedot tietokantaan
    const databaseName = `sienitunnistus-db`;
    const containerName = `tunnistukset`;
    const { database } = await cosmosClient.databases.createIfNotExists({
      id: databaseName,
    });
    const { container } = await database.containers.createIfNotExists({
      id: containerName,
    });

    //tää id pitää vielä keksiä miten sen luo, joku tyyliin math random tms vai tarviiko ollenkaan vai miten sais juoksevasti numeroitua
    //tulee error jos samalla id:llä löytyy jo kannasta, eli pitää käsin muuttaa jos testaa
    randomId = Math.random();
    const ennustuksenTulos =
      Math.round(results.predictions[0].probability * 100 * 100) / 100;
    const tunnistetieto = {
      id: `${randomId}`,
      paivamaara: date.toLocaleDateString("fi-FI"),
      tiedostonimi: blobName,
      sieni_nimi: results.predictions[0].tagName,
      ennustuksen_tulos: `${ennustuksenTulos}`,
    };
    //tässä itse kantaan lähetys
    const { resource } = await container.items.create(tunnistetieto);
    console.log("Tiedot syötetty tietokantaan");

    res.json(results.predictions[0]);
  } catch (error) {
    console.error("Virhe tapahtui!", error);
    res.status(500).send("Virhe tapahtui!");
  }
});

module.exports = router;
