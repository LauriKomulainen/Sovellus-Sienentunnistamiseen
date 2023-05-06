const { haeSieni } = require('../../reitit/tietokantakyselyt/haeSieniKysely.js');
const { cosmosClient } = require('../../reitit/tietokanta.js');

jest.mock('../../reitit/tietokanta.js', () => ({
  cosmosClient: {
    databases: {
      createIfNotExists: jest.fn(() => ({
        database: {
          containers: {
            createIfNotExists: jest.fn(() => ({
              container: {
                items: {
                  query: jest.fn(() => ({
                    fetchAll: jest.fn(() => ({
                      resources: [],
                    })),
                  })),
                },
              },
            })),
          },
        },
      })),
    },
  },
}));

describe('haeSieni moduuli', () => {
  test('haeSieni funktio: jos päivämäärä löytyy niin lisätään se lauseseen', async () => {
    const req = {
        query: {
            paivamaara: '16.4.2023',
        },
    };

    const querySpec = {
        query: `SELECT * FROM tunnistukset t WHERE t.paivamaara = '${req.query.paivamaara}'`,
        parameters: [
            {
                name: "@paivamaara",
                value: req.query.paivamaara,
            },
        ],
    };

    const res = {json: jest.fn()};

    await haeSieni(req, res, querySpec);

    expect(cosmosClient.databases.createIfNotExists).toHaveBeenCalled();
    expect(querySpec.query).toContain('16.4.2023');
    expect(querySpec.query).toEqual("SELECT * FROM tunnistukset t WHERE t.paivamaara = '16.4.2023'");
    expect(res.json).toHaveBeenCalledWith([]);
  });

  test('haeSieni funktio: jos päivämäärä ja nimi löytyy niin lisätään se lauseseen', async () => {
    const req = {
        query: {
            paivamaara: '16.4.2023',
            nimi: 'punakärpässieni',
        },
    };

    const querySpec = {
        query: `SELECT * FROM tunnistukset t WHERE t.paivamaara = '${req.query.paivamaara}' AND t.nimi = '${req.query.nimi}'`,
        parameters: [
            {
                name: "@paivamaara",
                value: req.query.paivamaara,
            },
            {
                name: "@nimi",
                value: req.query.nimi,
            }
        ],
    };

    const res = {json: jest.fn()};

    await haeSieni(req, res, querySpec);

    expect(cosmosClient.databases.createIfNotExists).toHaveBeenCalled();
    expect(querySpec.query).toContain('16.4.2023');
    expect(querySpec.query).toEqual("SELECT * FROM tunnistukset t WHERE t.paivamaara = '16.4.2023' AND t.nimi = 'punakärpässieni'");
    expect(res.json).toHaveBeenCalledWith([]);
  });

  test('haeSieni funktio: jos päivämäärä, nimi ja ennustuksen tulos löytyy niin lisätään se lauseseen', async () => {
    const req = {
        query: {
            paivamaara: '16.4.2023',
            nimi: 'punakärpässieni',
            ennustus: 100,
        },
    };

    const querySpec = {
        query: `SELECT * FROM tunnistukset t WHERE t.paivamaara = '${req.query.paivamaara}' AND t.nimi = '${req.query.nimi}' and t.ennustus = '${req.query.ennustus}'`,
        parameters: [
            {
                name: "@paivamaara",
                value: req.query.paivamaara,
            },
            {
                name: "@nimi",
                value: req.query.nimi,
            },
            {
                name: "@ennustus",
                value: req.query.ennustus,
            }
        ],
    };

    const res = {json: jest.fn()};

    await haeSieni(req, res, querySpec);

    expect(cosmosClient.databases.createIfNotExists).toHaveBeenCalled();
    expect(querySpec.query).toContain('16.4.2023');
    expect(querySpec.query).toEqual("SELECT * FROM tunnistukset t WHERE t.paivamaara = '16.4.2023' AND t.nimi = 'punakärpässieni' and t.ennustus = '100'");
    expect(res.json).toHaveBeenCalledWith([]);
  });
});

