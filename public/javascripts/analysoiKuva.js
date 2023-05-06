const form = document.querySelector("#uploadForm");
const ennustuksenTulos = document.querySelector("#result");
const sieniKertomus = document.querySelector("#sienikertomus");
const analysoiButton = document.querySelector("#analysoi");

document.addEventListener("DOMContentLoaded", function(event) {
  analysoiButton.addEventListener('click', async () => {
        try {
          await halytysIkkuna();
          const data = new FormData();
          data.append('image', form.image.files[0]);
          await analysoiKuva(data);
        } catch (error) {
          console.log('Virhe tapahtui ' + error);
        }
    });
  });

async function analysoiKuva(data) {
  try {
    const tulos = await lahetaKuvaAnalysoitavaksi(data);
    const ennustus = tulos.probability * 100;

    if (ennustus > 95) {
      halytys();
      naytaEnnuste(tulos, ennustus);
      naytaLisatiedotNappi();
    } else {
      halytys();
      naytaTunnistamatonKuva();
    } 
  } catch (error) {
    console.log('Virhe tapahtui ' + error);
  }
}

async function lahetaKuvaAnalysoitavaksi(data) {
  const vastaus = await fetch('/tallenna', {
    method: 'POST',
    body: data,
  });

  return await vastaus.json();
}

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

function naytaTunnistamatonKuva() {
  ennustuksenTulos.innerHTML = "Kuvaa ei pystytty tunnistamaan";
  sieniKertomus.innerHTML = "";
}

function naytaLisatiedotNappi() {
  document.getElementById('lisaatietoa').removeAttribute("hidden");
}

function halytys() {
  ennustuksenTulos.style.border = "3px solid red";
  setTimeout(() => {
    ennustuksenTulos.style.border = "none";
  }, 2000);
}

async function halytysIkkuna() {
  return new Promise((resolve, reject) => {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    const sisalto = document.createElement('div');
    sisalto.classList.add('modal-content');

    const otsikko = document.createElement('h2');
    otsikko.innerText = 'Huomio';

    const teksti = document.createElement('p');
    teksti.innerText = 'Huomioithan, että kuva tallennetaan Custom Visioniin.';

    const lisaaTekstia = document.createElement('p');
    lisaaTekstia.innerText = 'Mikäli et halua tallentaa kuvaa, paina peruuta.';

    const hyvaksy = document.createElement('button');
    hyvaksy.classList.add('hyvaksy');
    hyvaksy.innerText = 'OK';
    hyvaksy.addEventListener('click', () => {
      resolve();
      modal.remove();
    });

    const peruuta = document.createElement('button');
    peruuta.classList.add('peruuta');
    peruuta.innerText = 'Peruuta';
    peruuta.addEventListener('click', () => {
      //console.log('Peruutettu');
      const error = new Error('Peruutettu');
      reject(error);
      //reject();
      modal.remove();
    });

    // Lisää elementit modaaliseen ikkunaan
    sisalto.appendChild(otsikko);
    sisalto.appendChild(teksti);
    sisalto.appendChild(lisaaTekstia);
    sisalto.appendChild(hyvaksy);
    sisalto.appendChild(peruuta);

    modal.appendChild(sisalto);
    document.body.appendChild(modal);

    // Lisää CSS-tyylit
    modal.classList.add('modal');
    sisalto.classList.add('modal-content');
  });
}

module.exports = {
  analysoiKuva,
  lahetaKuvaAnalysoitavaksi,
  naytaEnnuste,
  naytaTunnistamatonKuva,
  halytys,
  halytysIkkuna,
};