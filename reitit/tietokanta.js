const {DefaultAzureCredential} = require("@azure/identity");
const {CosmosClient} = require("@azure/cosmos");

const tietokannanNimi = `sienitunnistus-db`;
const tunnistuksetContainer = `tunnistukset`;
const lisatiedotContainer = `sienitiedot`;

const endpoint = process.env.APPSETTING_COSMOS_ENDPOINT;

//cosmosClient tietokantayhteyttä varten
const cosmosClient = new CosmosClient({
  endpoint,
  aadCredentials: new DefaultAzureCredential(),
});


module.exports = {cosmosClient, tietokannanNimi, tunnistuksetContainer, lisatiedotContainer};
