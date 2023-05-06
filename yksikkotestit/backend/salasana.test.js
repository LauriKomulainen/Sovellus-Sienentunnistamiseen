const request = require('supertest');
const express = require('express');
const router = require('../../reitit/kirjauduSisaan.js');
const app = express();

app.use(express.json());
app.use(router);

describe('POST /kirjaudu', () => {
  const salasana = 'salasana';

  test('Palauttaa 200 koodin jos salasana oikein', async () => {
    const response = await request(app)
      .post('/kirjaudu')
      .send({password: `${salasana}`});
    expect(response.statusCode).toBe(200);
  });

  test('Palauttaa 401 jos salasana väärin.', async () => {
    const response = await request(app)
      .post('/kirjaudu')
      .send({password: 'eipä ollu oikea:P'});
    expect(response.statusCode).toBe(401);
  });
});