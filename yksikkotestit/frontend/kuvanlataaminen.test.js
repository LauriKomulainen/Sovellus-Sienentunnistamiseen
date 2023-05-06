const {describe, expect, test} = require('@jest/globals');
const { TextEncoder, TextDecoder } = require('util');
const {queryByAttribute } = require('@testing-library/dom');

require('@testing-library/jest-dom');
Object.assign(global, { TextDecoder, TextEncoder });

const { JSDOM } = require('jsdom');

const jsdom = new JSDOM(`<!doctype html><html><body>
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
  </main></body></html>`, {
  url: 'http://localhost'
});

global.window = jsdom.window;
global.document = window.document;
global.navigator = window.navigator;



describe('Kuvan lisääminen ja poistaminen:', () => {
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


test('Poista kuva napin toiminta', async () => {



  //const latausForm = document.getElementById("fileinput");
  const sieniKertomus = document.getElementById("sienikertomus");
  const tulokset = document.getElementById("result");
  const sieniTiedot = document.getElementById("sienitiedot");
  const poistaKuvaButton = document.getElementById("poistakuva");
  
  

  //latausForm.value = '<input type="file" value="test file">';
  sieniKertomus.value = 'Testikertomus';
  tulokset.value = 'Testituloksia';
  sieniTiedot.value = 'Testitietoja';

  poistaKuvaButton.click();
  

  //expect(document.getElementById("uploadForm").innerHTML).toEqual('<input type="file">');
  expect(document.getElementById("sienikertomus").innerHTML).toEqual("Lataa ensin kuva, jotta pystyt muodostamaan ennustuksia sienistä.");
  expect(document.getElementById("result").innerHTML).toEqual("Et ole valinnut kuvaa");
  expect(document.getElementById("sienitiedot").innerHTML).toEqual("");
});

test('Testataan selaa- nappi', () => {
  const selaaKuva = document.querySelector(".button-browse");
    const input = document.querySelector("input");
    const inputClickSpy = jest.spyOn(input, "click");
    
    selaaKuva.dispatchEvent(new Event("click"));
    selaaKuva.click();
    input.click();
    
    expect(inputClickSpy).toHaveBeenCalled();
});

test('Testataan kuvan lisääminen selaa kautta inputtiin', () => {
  const input = document.querySelector("input");
  const output = document.querySelector(".image-container");
  let imagesArray = [];

  const displayImages = jest.fn();
  

  input.addEventListener("change", function () {
    const file = input.files[0];
    imagesArray.push(file);
    displayImages();
    
  });

  // simuloidaan tiedoston valinta test.jpg tiedostolla
  const file = new File(["test file content"], "test.jpg", {
    type: "image/jpeg",
  });
  const event = new Event("change");
  Object.defineProperty(input, "files", {
    value: [file],
  });
  input.dispatchEvent(event);

  //container = jsdom.window.document.querySelector('.image-container');
  const element = queryByAttribute("src", jsdom.window.document, "test.jpg");
  

  // tarkastetaan että imagesArrayhin on lisätty tiedosto
  expect(imagesArray).toContain(file);
  //tarkastetaan että inputtiin on lisätty tiedosto
  expect(input).toHaveProperty('files', [file]);
  //expect(element).toBeTruthy();
  //expect(element.tagName).toBe("IMG");
});

test('Kuvan lisääminen raahaamalla', async () => {
 // const displayImages = require('../../public/javascripts/kuvanlataaminen.js')
  const dragArea = document.createElement("div");
  const imagesArray = [];
  const displayImages = jest.fn();
  
  dragArea.addEventListener("drop", function (event) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    imagesArray.push(file);
    displayImages();
  });

  const file = new File(["content"], "test.png", { type: "image/png" });
  const dropEvent = new Event("drop", { bubbles: true });
  Object.defineProperty(dropEvent, "dataTransfer", {
      value: { files: [file] },
  });
  
  dragArea.dispatchEvent(dropEvent);
  
  expect(imagesArray).toHaveLength(1);
  expect(imagesArray[0]).toBe(file);
  expect(displayImages).toHaveBeenCalledTimes(1);
  

});

});