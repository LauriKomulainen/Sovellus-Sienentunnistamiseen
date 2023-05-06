const express = require("express");
const sienet = require("./reitit/sienenTunnistus");
const haeEnnustukset = require("./reitit/tietokantakyselyt/haeLisaTiedotKysely.js");
const haeLisaTiedot = require("./reitit/tietokantakyselyt/haeSieniKysely.js");
const salasana = require("./reitit/kirjauduSisaan");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Tekee public kansion staattiseksi eli tiedostot ovat saatavilla
// suoraan URL-osoitteella. Esim. public/index.html tulee saatavaksi
app.use(express.static("public"));

app.use("/haesieni", haeLisaTiedot.haeSieni);
app.use("/haetiedot", haeEnnustukset.haeLisaTiedot);
app.use(sienet);
app.use(salasana);

// Määritetään portiksi ympäristömuuttujan portti tai 3000
const portti = process.env.PORT || 3000;

app.listen(portti, () => {
  console.log(`Serveri käynnissä portissa ${portti}`);
});
