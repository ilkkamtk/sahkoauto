// liitetään kartta elementtiin #map
const map = L.map('map');
// käytetään openstreetmapia
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

// Asetukset paikkatiedon hakua varten (valinnainen)
const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

// Funktio, joka ajetaan, kun paikkatiedot on haettu
function success(pos) {
  const crd = pos.coords;

  // Tulostetaan paikkatiedot konsoliin
  console.log('Your current position is:');
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);
  paivitaKartta(crd);
  lisaaMarker(crd);
}

function paivitaKartta(crd) {
  // Käytetään leaflet.js -kirjastoa näyttämään sijainti kartalla (https://leafletjs.com/)
  map.setView([crd.latitude, crd.longitude], 13);
}

function lisaaMarker(crd) {
  L.marker([crd.latitude, crd.longitude]).
  addTo(map).
  bindPopup('Olen tässä.').
  openPopup();
}

// Funktio, joka ajetaan, jos paikkatietojen hakemisessa tapahtuu virhe
function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

// Käynnistetään paikkatietojen haku
navigator.geolocation.watchPosition(success, error, options);

// haetaan sähköautojen latauspisteet 10 km säteellä (koordinaatit kovakoodattu)
// API-dokumentaatio: https://openchargemap.org/site/develop/api
const osoite = 'https://api.openchargemap.io/v3/poi/?';
const parametrit = 'coutrycode=FI&latitude=60.2208611&longitude=24.8034188&distance=10&distanceunit=km';
fetch(osoite + parametrit).then(function(vastaus) {
  return vastaus.json();
}).then(function(latauspisteet) {
  console.log(latauspisteet);
  for (let i = 0; i < latauspisteet.length; i++) {
    console.log(latauspisteet[i].AddressInfo.Title);
  }
});
