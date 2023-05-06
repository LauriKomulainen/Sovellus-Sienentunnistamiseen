const {cosmosClient, tietokannanNimi, tunnistuksetContainer} = require('../tietokanta.js');

const haeSieni = async (req, res) => {
    const {paivamaara, ennustus, sieni} = req.query;
    const querySpec = {
        query: "SELECT * FROM tunnistukset t",
        parameters: [],
    };

    const lisataanKyselyyn = [];

    if (paivamaara) {
        lisataanKyselyyn.push('t.paivamaara = @paivamaara');
        querySpec.parameters.push({ name: '@paivamaara', value: paivamaara });
    }

    if (ennustus) {
        lisataanKyselyyn.push('t.ennustuksen_tulos >= @ennustus');
        querySpec.parameters.push({ name: "@ennustus", value: ennustus });
    }

    if (sieni) {
        lisataanKyselyyn.push('t.sieni_nimi = @sieni');
        querySpec.parameters.push({ name: "@sieni", value: sieni.toLowerCase() });
    }

    if (lisataanKyselyyn.length > 0) {
        const whereString = " WHERE " + lisataanKyselyyn.join(" AND ");
        querySpec.query += whereString;
    }

    const {database} = await cosmosClient.databases.createIfNotExists({id: tietokannanNimi});

    const {container} = await database.containers.createIfNotExists({id: tunnistuksetContainer});

    const {resources} = await container.items.query(querySpec).fetchAll();

    res.json(resources);
};

module.exports = {haeSieni};