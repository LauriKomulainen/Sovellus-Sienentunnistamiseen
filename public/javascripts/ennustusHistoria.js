document.addEventListener("DOMContentLoaded", function(event) {
  const inputPaivamaara = document.querySelector("#paivamaara");
  const inputEnnustus = document.querySelector("#ennustus");
  const sieniHaku = document.querySelector("#sieni");
  const haeEnnustukset = document.querySelector("#haeEnnustukset");

  haeEnnustukset.addEventListener("click", async () => {
      const paivamaara = inputPaivamaara.value;
      const ennustus = inputEnnustus.value;
      const sieni = sieniHaku.value;
      await haeValitutEnnustukset(paivamaara, ennustus, sieni);
  });
});

async function haeValitutEnnustukset(paivamaara, ennustus, sieni) {
  try {
    let url = `/haesieni?`;

    if (paivamaara) {
      url += `paivamaara=${paivamaara}&`;
    }

    if (ennustus) {
      url += `ennustus=${ennustus}&`;
    }

    if (sieni) {
      url += `sieni=${sieni}&`;
    }

    const vastaus = await fetch(url);
    const tulos = await vastaus.json();

    const htmlRivit = tulos.map((item) => {
      return `
        <tr>
          <td>${item.paivamaara}</td>
          <td>${item.sieni_nimi}</td>
          <td>${item.ennustuksen_tulos} %</td>
        </tr>
      `;
    });

    const htmlTaulukko = `
      <h1>Ennustukset</h1>
      <table>
        <tr>
          <th>Päivämäärä</th>
          <th>Sieni</th>
          <th>Ennustuksen tulos</th>
        </tr>
        ${htmlRivit.join('')}
      </table>
    `;

    document.querySelector("#tulokset").innerHTML = htmlTaulukko;
  }
    catch (error) {
    console.log("Virhe tapahtui!", error);
  }
}

module.exports = {haeValitutEnnustukset};
