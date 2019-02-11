// Asetukset paikkatiedon hakua varten (valinnainen)
const map = L.map('map');

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

// Funktio, joka ajetaan, kun paikkatiedot on haettu
function success(pos) {
  const crd = pos.coords;

  // Tulostetaan paikkatiedot konsoliin
  console.log('Your current position is:');
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);
  // näytetään kartta
  naytaKartta(crd);
  // näytetään markkeri
  lisaaMarker(crd);
}

// siirretään kartan päivitys omaan funktioon
function naytaKartta(crd) {
  // Käytetään leaflet.js -kirjastoa näyttämään sijainti kartalla (https://leafletjs.com/)
  map.setView([crd.latitude, crd.longitude], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
}

// siirretään markkereiden lisäys omaan funktioon
function lisaaMarker(crd) {
  L.marker([crd.latitude, crd.longitude]).addTo(map)
  .bindPopup('Olen tässä.')
  .openPopup();
}


// Funktio, joka ajetaan, jos paikkatietojen hakemisessa tapahtuu virhe
function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

// Käynnistetään paikkatietojen haku
navigator.geolocation.watchPosition(success, error, options);