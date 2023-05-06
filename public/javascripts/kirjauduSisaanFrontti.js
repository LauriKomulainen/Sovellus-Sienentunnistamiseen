const kirjauduSisaan = document.querySelector("#kirjaudu");

kirjauduSisaan.addEventListener("submit", async (event) => {
  event.preventDefault();

  const salasana = document.querySelector("#password");
  await kirjaudu(salasana);
});

async function kirjaudu(salasana) {
  const vastaus = await fetch("/kirjaudu", {
    method: 'POST',
    body: JSON.stringify({password: salasana.value}),
    headers: {"Content-Type": "application/json"},
  });

  if (vastaus.ok) {
    // Tallenna salasana sessionStorageen
    sessionStorage.setItem("password", salasana.value);
    // Siirry etusivulle
    window.location.href = "etusivu.html";
  } else {
    // Jos vastaus epäonnistui, näytä virheilmoitus
    document.querySelector("#vaarin").innerHTML = "Salasana väärin";
  }
} 

module.exports = {kirjaudu};