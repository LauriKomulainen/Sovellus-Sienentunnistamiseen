const {describe, expect, test} = require('@jest/globals');
const {haeValitutEnnustukset} = require('../../public/javascripts/ennustusHistoria.js');

describe('Ennustus historia moduuli', () => {
  test('haeValitutEnnustukset funktio: luo oikean polun annetuilla parametreilla', async () => {
    const mockFetch = jest.fn().mockResolvedValue({ json: () => {}});
    global.fetch = mockFetch;

    const paivamaara = '2023-04-10';
    const ennustuksenTulos = 10;
    const sienenNimi = 'Kanttarelli';

    await haeValitutEnnustukset(paivamaara, ennustuksenTulos, sienenNimi);

    const url = `/haesieni?paivamaara=${paivamaara}&ennustus=${ennustuksenTulos}&sieni=${sienenNimi}&`;

    expect(mockFetch).toHaveBeenCalledWith(url);
    expect(mockFetch).toHaveBeenCalled(); // kutsutaan vähintään kerran
  });

  test('haeValitutEnnustukset funktio: hakee ennustukset ja lisää ne oikeaan paikkaan DOM-puussa', async () => {
    const mockTulos = [{paivamaara: '2022-08-10', sieni_nimi: 'Kanttarelli', ennustuksen_tulos: 80 }];
    const mockFetch = jest.fn().mockResolvedValue({ json: () => mockTulos });
    global.fetch = mockFetch;

    document.body.innerHTML = `<div id="tulokset"></div>`;

    const mockTulokset = document.querySelector('#tulokset');
    jest.spyOn(document, 'querySelector').mockReturnValueOnce(mockTulokset);

    await haeValitutEnnustukset('2022-08-10', '80', 'Kanttarelli');

    expect(mockTulokset.innerHTML).toContain('Ennustukset');
    expect(mockTulokset.innerHTML).toContain('Kanttarelli');
    expect(mockTulokset.innerHTML).toContain('80 %');
    expect(mockFetch).toHaveBeenCalled(); // kutsutaan vähintään kerran
  });
});
