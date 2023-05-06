const lisaatietoaButton = document.querySelector("#lisaatietoa");
const tulos = document.querySelector("#result");

document.addEventListener("DOMContentLoaded", function(event) {
  lisaatietoaButton.addEventListener("click", async () => {
    try {
      const valittuSieni = tulos.textContent;
      const sieniTiedot = await haeSieniTiedot(valittuSieni);
      paivitaSieniTiedot(sieniTiedot);
    } catch (error) {
      console.log("Virhe tapahtui!", error);
    }
  });
});

async function haeSieniTiedot(sienenNimi) {
  try {
    const vastaus = await fetch(`/haetiedot?nimi=${sienenNimi.charAt(0).toUpperCase() + sienenNimi.slice(1)}`);
    const tulos = await vastaus.json();
    
    let tiedot = "";

    if (tulos.length === 0) {
      document.querySelector("#sienitiedot").innerHTML = "Tuloksia ei löytynyt";
    } else {
      tulos.forEach((item) => {
        tiedot += `
          <div><h2>Nimi</h2> <p>${item.nimi}</p></div>
          <div><h2>Latinankielinen nimi</h2> <p>${item.latnimi}</p></div>
          <div><h2>Myrkyllisyys</h2> <p>${item.myrkyllisyys}</p></div>
          <div><h2>Ruokasieni</h2> <p>${item.ruokasieni}</p></div>
          <div><h2>Lisätiedot</h2> <p>${item.tiedot}</p></div>`;
      });
    }

    return tiedot;

  } catch (error) {
    console.log("Virhe tapahtui!", error);
  }
}

function paivitaSieniTiedot(tiedot) {
  document.querySelector("#sienitiedot").innerHTML = tiedot;
}

module.exports = {haeSieniTiedot, paivitaSieniTiedot};

