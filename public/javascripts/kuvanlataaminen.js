const dragArea = document.querySelector(".file-drop-area");
const input = document.querySelector("input");
const output = document.querySelector(".image-container");
const poistaKuvaButton = document.querySelector("#poistakuva");
const fileInput = document.querySelector('input[type="file"]');
const uploadForm = document.querySelector("#uploadForm");
const selaaKuva = document.querySelector(".button-browse");


let imagesArray = [];

function clearInput() {
  document.getElementById("uploadForm").reset();
  document.getElementById("sienikertomus").innerHTML = "Lataa ensin kuva, jotta pystyt muodostamaan ennustuksia sienistä.";
  document.getElementById("result").innerHTML = "Et ole valinnut kuvaa";
  document.getElementById("sienitiedot").innerHTML = "";
};

// Klikkaamalla "selaa"-nappia
document.addEventListener("DOMContentLoaded", function() {
  selaaKuva.addEventListener("click", function () {
    input.click();
  });


// Kuuntelija, joka käynnistyy, kun uusi tiedosto on valittu
input.addEventListener("change", function () {
  const file = input.files[0];
  imagesArray.push(file);
  displayImages();
  //blobUpload(file, url, 'images', sasKey);
});

// Kuuntelija, joka käynnistyy, kun tiedosto on raahattu alueelle
dragArea.addEventListener("dragover", function (event) {
  event.preventDefault();
  dragArea.classList.add("active");
  dragArea.querySelector(".header").textContent = "Vapauta ladataksesi kuva";
});

// Kuuntelija, joka käynnistyy, kun tiedosto poistuu raahausten alueelta
dragArea.addEventListener("dragleave", function () {
  dragArea.classList.remove("active");
  dragArea.querySelector(".header").textContent = "Raahaa kuva tähän";
});

// Kuuntelija, joka käynnistyy, kun tiedosto pudotetaan alueelle
dragArea.addEventListener("drop", function (event) {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  imagesArray.push(file);
  displayImages();
  //blobUpload(file, url, 'images', sasKey);
});

poistaKuvaButton.addEventListener("click", () => {
  imagesArray = [];
  displayImages();
  clearInput();
  document.getElementById('lisaatietoa').setAttribute("hidden", "hidden");
});

// Funktio, joka näyttää kuvan output-elementissä
function displayImages() {
  let images = "";
  let imageinput = "";

  
//käydään imagearray läpi, lisätään kuva imagecontaineriin ja lisätään kuva inputtiin
  imagesArray.forEach((image, index) => {
    images = `<div class="image">
                <img src="${URL.createObjectURL(image)}" alt="image">
              </div>`;
              fetch(URL.createObjectURL(image))
              .then(function (response) {
                 return response.blob();
              })
              .then(function (blob) {
                var myFile = new File([blob], "filename")
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(myFile);
                fileInput.files = dataTransfer.files;
              });
  });
  

  output.innerHTML = images;

}



});
