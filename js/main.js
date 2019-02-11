// Asetukset paikkatiedon hakua varten (valinnainen)
const map = L.map('map');

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

// kustom ikonit: oma paikka punainen, latauspiste vihreä
const punainenIkoni = L.divIcon({className: 'punainen-ikoni'});
const vihreaIkoni = L.divIcon({className: 'vihrea-ikoni'});

// Funktio, joka ajetaan, kun paikkatiedot on haettu
function success(pos) {
  const crd = pos.coords;

  // Tulostetaan paikkatiedot konsoliin
  console.log('Your current position is:');
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);
  naytaKartta(crd);
  lisaaMarker(crd, 'Olen tässä', punainenIkoni);
}

function naytaKartta(crd) {
  // Käytetään leaflet.js -kirjastoa näyttämään sijainti kartalla (https://leafletjs.com/)
  map.setView([crd.latitude, crd.longitude], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
}

function lisaaMarker(crd, teksti, ikoni) {
  L.marker([crd.latitude, crd.longitude], {icon: ikoni}).
  addTo(map).
  bindPopup(teksti).
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
    const teksti = latauspisteet[i].AddressInfo.Title;
    const koordinaatit = {
      latitude: latauspisteet[i].AddressInfo.Latitude,
      longitude: latauspisteet[i].AddressInfo.Longitude,
    };
    lisaaMarker(koordinaatit, teksti, vihreaIkoni);
  }
});