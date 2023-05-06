const {cosmosClient, tietokannanNimi, lisatiedotContainer} = require('../tietokanta.js');

const haeLisaTiedot = async (req, res) => {

  if (req.query.nimi) {
    querySpec = {
      query: "SELECT * FROM sienitiedot t WHERE t.nimi = @nimi",
      parameters: [
        {
          name: "@nimi",
          value: req.query.nimi,
        },
      ],
    };
  }

  const {database} = await cosmosClient.databases.createIfNotExists({id: tietokannanNimi});
  const {container} = await database.containers.createIfNotExists({id: lisatiedotContainer});
  const {resources} = await container.items.query(querySpec).fetchAll();

  res.json(resources); 
};

module.exports = {haeLisaTiedot};