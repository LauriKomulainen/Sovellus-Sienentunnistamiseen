require('@testing-library/jest-dom');
const {describe, expect, test} = require('@jest/globals');
const {analysoiKuva} = require('../../public/javascripts/analysoiKuva.js');
const {halytysIkkuna} = require('../../public/javascripts/analysoiKuva.js');


const mockFetch = jest.fn().mockResolvedValue({ json: () => {} });
global.fetch = mockFetch;


describe('analysoiKuva', () => {
  document.body.innerHTML = `
  <main class="primary-content">
      <div class="container d-flex justify-content-center mt-100 post">
          <h2>Tiedoston lataaminen</h2>
          <form id="uploadForm" action="/upload" method="POST" enctype="multipart/form-data">
              <div class="file-drop-area">
                  <span class="header">Raahaa kuva tähän</span>
                  <span class="header">&nbsp;tai&nbsp;<span class="button-browse">selaa</span></span>
                  <input type="file" name="image" hidden>
              </div>
              <div class="image-container" name="container"></div>
          </form>
          <div class="form-action">
              <button id="analysoi" type="button">Analysoi</button>
              <button id="poistakuva" type="button">Poista kuva</button>
          </div>
      </div>

      <article class="post">
          <h2>Tulos</h2>
          <h1 id="result">Et ole valinnut kuvaa</h1>
          <p id="sienikertomus">Lataa ensin kuva, jotta pystyt muodostamaan ennustuksia sienistä.</p>
          <button id="lisaatietoa" type="button" hidden>Lisää tietoja</button>
          <p id="sienitiedot"></p>
      </article>
      <article class="post">
          <h2>Tietoa projektista</h2>
          <p>Tähän joku vastuuvapautuslauseke</p>
          <a target="_blank" href="https://dev.azure.com/OT2-K23-GroupA/Websovellus%20kuvantunnistamiseen">Linkki
              projektin
              azureen</a>
      </article>
  </main>
`;


  test('analysoiKuva funktio: fetch kutsun tulee käyttää /tallenna', async () => {
    const data = new FormData();
    await analysoiKuva(data);

    expect(mockFetch).toHaveBeenCalledWith('/tallenna', {
      method: 'POST',
      body: data,
    });
  });

  test('analysoiKuva funktio: käsittelee virheen oikein', async () => {
    const spy = jest.spyOn(console, 'log');
    mockFetch.mockRejectedValueOnce('mock error');

    await analysoiKuva({});

    expect(spy).toHaveBeenCalledWith('Virhe tapahtui mock error');
  });

  test('naytaEnnuste näyttää tunnistetun sienen', async () => {
    const ennustuksenTulos = document.querySelector("#result");
    const sieniKertomus = document.querySelector("#sienikertomus");

    const tulos = {
      probability: "0.99",
      tagId : "5c7bd04b-6497-48da-abc7-181507e34538",
      tagName : "myrkkynääpikkä",
      tagType : "Regular"
    };
    const ennustus = tulos.probability * 100;

    function naytaEnnuste(tulos, ennustus) {
      ennustuksenTulos.innerHTML = `${tulos.tagName}`;
      sieniKertomus.innerHTML =
        "Sieni on " +
        `${tulos.tagName}` +
        " " +
        Math.round(ennustus * 100) / 100 +
        "% varmuudella. Lisätietoa saat alla olevaa nappia painamalla." +
        "<br>";
    }

    naytaEnnuste(tulos, ennustus);

    //tarkastetaan että oikeat tiedot tulostetaan käyttäjälle
    expect(document.getElementById("result").innerHTML).toContain("myrkkynääpikkä");
    expect(document.getElementById("sienikertomus").innerHTML).toContain("99% varmuudella. Lisätietoa saat alla olevaa nappia painamalla.");

       
  });

  test('naytaTunnistamatonKuva antaa virheen ja tyhjentää sienikertomuksen', async () => {
    const ennustuksenTulos = document.querySelector("#result");
    const sieniKertomus = document.querySelector("#sienikertomus");

    function naytaTunnistamatonKuva() {
      ennustuksenTulos.innerHTML = "Kuvaa ei pystytty tunnistamaan";
      sieniKertomus.innerHTML = "";
    };

    naytaTunnistamatonKuva();

    //tarkastetaan, että oikea viesti näkyy, ja että sienikertomus on tyhjä
    expect(document.getElementById("result").innerHTML).toContain("Kuvaa ei pystytty tunnistamaan");
    expect(document.getElementById("sienikertomus").innerHTML).toBe("");

  });

  test('naytaLisatiedotNappi tulee näkyviin funktiota kutsuttaessa', async () => {
    const lisatiedotNappi = document.querySelector("#lisaatietoa");

    function naytaLisatiedotNappi() {
      document.getElementById('lisaatietoa').removeAttribute("hidden");
    };

    naytaLisatiedotNappi()
    
    //tarkastetaan, että lisätietonappi on  näkyvissä
    expect(lisatiedotNappi.getAttribute('hidden')).toBeFalsy();
    expect(lisatiedotNappi).toHaveStyle({visibility: 'visible' });
  });

  test('halytys funktio tekee punaiset rajat tuloslaatikkoon 2s ajaksi', async () => {
    const ennustuksenTulos = document.querySelector("#result");
    
    function halytys() {
      ennustuksenTulos.style.border = "3px solid red";
      setTimeout(() => {
        ennustuksenTulos.style.border = "none";
      }, 2000);
    };

    halytys();
  
    //tarkastetaan punaiset rajat
    expect(ennustuksenTulos.style.border).toBe('3px solid red');
    //odotetaan 2sec, tarkastetaan että raja poistunut
    setTimeout(() => {
      expect(ennustuksenTulos.style.border).toBe("");
    }, 2000);
  });


  test('halytysIkkuna- funktion modal tulee näkyville ja napit toimivat', async () => {
    // kutsutaan funktiota
    const result = halytysIkkuna();

    // odotetaan modalin lisäys, tarkastetaan sisältö
    await expect(document.querySelector('.modal')).not.toBeNull();
    await expect(document.querySelector('.modal-content .hyvaksy').innerText).toBe('OK');
    await expect(document.querySelector('.modal-content .peruuta').innerText).toBe('Peruuta');
    await expect(document.querySelector('.modal-content h2').innerText).toBe('Huomio');
    await expect(document.querySelector('.modal-content p:nth-of-type(1)').innerText).toBe('Huomioithan, että kuva tallennetaan Custom Visioniin.');
    await expect(document.querySelector('.modal-content p:nth-of-type(2)').innerText).toBe('Mikäli et halua tallentaa kuvaa, paina peruuta.');

    // hyväksy napin painallus
    document.querySelector('.hyvaksy').click();
    await expect(result).resolves.toBeUndefined();

    // odotetaan modalin sulkeutuminen
    await expect(document.querySelector('.modal')).toBeNull();

    // kutsutaan uudestaan
    const result2 = halytysIkkuna();

    // odotetaan modalin lisäys
    await expect(document.querySelector('.modal')).not.toBeNull();

    // peruuta- napin painallus
    document.querySelector('.peruuta').click();

    // odotetaan että tulee reject ja viskaa errorin peruutettu
    await expect(result2).rejects.toThrow('Peruutettu');

    // modal poistetaan
    await expect(document.querySelector('.modal')).toBeNull();

  });

});




