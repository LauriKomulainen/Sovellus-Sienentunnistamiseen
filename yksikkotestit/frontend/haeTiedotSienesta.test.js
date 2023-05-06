const {describe, expect, test} = require('@jest/globals');
const {haeSieniTiedot} = require('../../public/javascripts/sienenLisatietojenHakeminen.js');

describe('haeSieniTiedot moduuli:', () => {
  test('haeSieniTiedot funktio: palauttaa oikean tiedon', async () => {
    const mockTietokantaVastaus = [{ nimi: 'Kanttarelli', latnimi: 'Cantharellus cibarius', myrkyllisyys: 'ei myrkyllinen', ruokasieni: 'kyllä', tiedot: 'Kanttarellit ovat herkullisia sieniä.' }];
    const mockFetch = jest.fn().mockResolvedValue({ json: () => mockTietokantaVastaus});
    global.fetch = mockFetch;

    const sienenNimi = 'kanttarelli';
    const tiedot = await haeSieniTiedot(sienenNimi);

    const odotetutTiedot = `
          <div><h2>Nimi</h2> <p>Kanttarelli</p></div>
          <div><h2>Latinankielinen nimi</h2> <p>Cantharellus cibarius</p></div>
          <div><h2>Myrkyllisyys</h2> <p>ei myrkyllinen</p></div>
          <div><h2>Ruokasieni</h2> <p>kyllä</p></div>
          <div><h2>Lisätiedot</h2> <p>Kanttarellit ovat herkullisia sieniä.</p></div>`;

    expect(tiedot).toBe(odotetutTiedot);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(`/haetiedot?nimi=${sienenNimi.charAt(0).toUpperCase() + sienenNimi.slice(1)}`);
  });

  test('haeSieniTiedot funktio: mikäli tuloksia ei löytynyt - ilmoitetaan siitä käyttäjälle', async () => {
    const mockTietokantaVastaus = [];
    const mockFetch = jest.fn().mockResolvedValue({ json: () => mockTietokantaVastaus});
    document.body.innerHTML = '<div id="sienitiedot"></div>';
    global.fetch = mockFetch;

    const sienenNimi = 'testiSieni';
    await haeSieniTiedot(sienenNimi);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(`/haetiedot?nimi=${sienenNimi.charAt(0).toUpperCase() + sienenNimi.slice(1)}`);
    expect(document.querySelector("#sienitiedot").textContent).toContain("Tuloksia ei löytynyt");
  });

  test('haeSieniTiedot funktio: fetch kutsun tulee käyttää /haetiedot polkua ja muuttaa sienen alkukirjain isoksi', async () => {
    const mockTietokantaVastaus = [];
    const mockFetch = jest.fn().mockResolvedValue({ json: () => mockTietokantaVastaus});
    document.body.innerHTML = '<div id="sienitiedot"></div>';
    global.fetch = mockFetch;

    const sienenNimi = 'kanttarelli';
    await haeSieniTiedot(sienenNimi);

    expect(mockFetch).toHaveBeenCalledWith(`/haetiedot?nimi=Kanttarelli`);
  });
});