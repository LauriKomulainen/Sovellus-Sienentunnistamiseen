const luoPdfButton = document.getElementById("luoPdfRaportti");
const haeEnnustukset = document.getElementById("tulokset");
luoPdfButton.addEventListener("click", luoPdfRaportti);


function luoPdfRaportti() {

  
  // etsitään tr elementti
  const tr = document.querySelector("tr");

  // jos table sisältää tr-elementin
  if (haeEnnustukset.contains(tr)) {
    const asetukset = {
      margin: 1,
      filename: "ennustukset.pdf",
      html2canvas: {scale: 2},
      pagebreak: {mode: 'avoid-all'}
    };

    // luodaan pdf tiedosto
    html2pdf().set(asetukset).from(haeEnnustukset).save();
  } else {
    document.querySelector("#tulokset").innerHTML = "Ei ennustuksia";
  }
}



//module.exports = {luoPdfRaportti};
