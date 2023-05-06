require('@testing-library/jest-dom')
const { toContainHTML } = require('@testing-library/jest-dom/matchers')


describe('luoPdfRaportti', () => {
    document.body.innerHTML = `
    <main class="primary-content">
        <div class="container d-flex justify-content-center mt-100 post">
            <button id="haeEnnustukset" type="button">Hae ennustukset</button>
            <button id="luoPdfRaportti" type="button">Luo PDF raportti</button>
            <table id="tulokset" class="">
            <h1>Ennustukset</h1>
            <tbody>
            <tr>
                <th>Päivämäärä</th>
                <th>Sieni</th>
                <th>Ennustuksen tulos</th>
            </tr>
            <tr>
                <td>21.4.2023</td>
                <td>suppilovahvero</td>
                <td>99 %</td>
            </tr>    
            </tbody>
            </table>
        </div>
    </main>
    `;
    let haeEnnustukset = document.getElementById('tulokset');
    const luoPdfButton = document.querySelector('#luoPdfRaportti');

    function luoPdfRaportti() {
        document.addEventListener("DOMContentLoaded", function() {
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
          //html2pdf().set(asetukset).from(haeEnnustukset).save();
        } else {
          document.querySelector("#tulokset").innerHTML = "Ei ennustuksia";
        }
      });
    }

  test('Testataan luoPdfRaportti- nappi', async () => {
    const ennustusClickSpy = jest.spyOn(luoPdfButton, "click");
    const luoPdfRaporttiMock = jest.fn();

    luoPdfButton.addEventListener("click", luoPdfRaporttiMock);

    
    luoPdfButton.click();

    luoPdfRaportti();

    expect(ennustusClickSpy).toHaveBeenCalled();
    expect(luoPdfRaporttiMock).toHaveBeenCalled();
    expect(haeEnnustukset).toContainHTML('<td>suppilovahvero</td>');

  });

  test('Testataan funktion toiminta kun taulukko on tyhjä', async () => {
    const ennustusClickSpy = jest.spyOn(luoPdfButton, "click");
    haeEnnustukset.innerHTML = '';
    
    function luoPdfRaporttiEmpty() {
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
          //html2pdf().set(asetukset).from(haeEnnustukset).save();
        } else {
          document.querySelector("#tulokset").innerHTML = "Ei ennustuksia";
        }
    }

    const mockLuoPdfRaporttiEmpty = jest.fn(luoPdfRaporttiEmpty);
    luoPdfButton.addEventListener("click", mockLuoPdfRaporttiEmpty);
    luoPdfButton.click();
      
    expect(mockLuoPdfRaporttiEmpty).toHaveBeenCalled();
    expect(ennustusClickSpy).toHaveBeenCalled();
    expect(haeEnnustukset).not.toContainHTML('<td>suppilovahvero</td>');
    expect(haeEnnustukset.innerHTML).toBe('Ei ennustuksia');
    
  });
});
