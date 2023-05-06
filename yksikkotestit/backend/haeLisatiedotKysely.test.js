const {describe, expect, test} = require('@jest/globals');
const { cosmosClient } = require('../../reitit/tietokanta.js');
const {haeLisaTiedot} = require('../../reitit/tietokantakyselyt/haeLisaTiedotKysely.js');

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

describe('haeLisaTiedot moduuli', () => {
  test('haeLisaTiedot funktio: mikäli nimi löytyy niin lisätään se kyselyyn', async () => {
    const req = {
        query: {
            nimi: 'Punakärpässieni',
        },
    };

    const querySpec = {
        query: `SELECT * FROM sienitiedot t WHERE t.nimi= '${req.query.nimi}'`,
        parameters: [
            {
                name: "@nimi",
                value: req.query.nimi,
            },
        ],
    };

    const res = {json: jest.fn()};

    await haeLisaTiedot(req, res, querySpec);

    expect(cosmosClient.databases.createIfNotExists).toHaveBeenCalled();
    expect(querySpec.query).toEqual("SELECT * FROM sienitiedot t WHERE t.nimi= 'Punakärpässieni'");
    expect(res.json).toHaveBeenCalledWith([]);
    });
  });
