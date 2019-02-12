// elementit, joihin tulostetaan tiedot
const nimi = document.getElementById('nimi');
const asemanOsoite = document.getElementById('osoite');
const kaupunki = document.getElementById('kaupunki');
const lisatiedot = document.getElementById('lisatiedot');
const navigoi = document.getElementById('navigoi');
const paikanna = document.getElementById('paikanna');

// jatka paikannusta kartan liikuttamisen jälkeen
paikanna.addEventListener('click', kaynnistaPaikannus);

// tyhjä olio oman paikan tallennusta varten
let paikka = null;

// tyhjä olio paikannuksen aloittamista ja pysäyttämistä varten
let paikannus = null;

// zoomtaso
let zoomlevel = 11;

// liitetään kartta elementtiin #map
const map = L.map('map');
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// taulukko markkereita varten
const markers = L.layerGroup();
map.addLayer(markers);

// Asetukset paikkatiedon hakua varten (valinnainen)
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
  // poistetaan vanhat markerit
  markers.clearLayers();
  console.log('markkerit', markers);
  // asetetaan oma paikka
  paikka = pos.coords;

  // Tulostetaan paikkatiedot konsoliin
  console.log('Your current position is:');
  console.log(`Latitude : ${paikka.latitude}`);
  console.log(`Longitude: ${paikka.longitude}`);
  console.log(`More or less ${paikka.accuracy} meters.`);
  paivitaKartta(paikka);
  lisaaMarker(paikka, 'Olen tässä', punainenIkoni);
  haeLatauspisteet(paikka);
}

function paivitaKartta(crd) {
  // Käytetään leaflet.js -kirjastoa näyttämään sijainti kartalla (https://leafletjs.com/)
  map.setView([crd.latitude, crd.longitude], zoomlevel);
}

function lisaaMarker(crd, teksti, ikoni, latauspiste) {
  const marker = L.marker([crd.latitude, crd.longitude], {icon: ikoni}).
      bindPopup(teksti).
      on('popupopen', function(popup) {
        console.log(latauspiste);
        nimi.innerHTML = latauspiste.AddressInfo.Title;
        asemanOsoite.innerHTML = latauspiste.AddressInfo.AddressLine1;
        kaupunki.innerHTML = latauspiste.AddressInfo.Town;
        lisatiedot.innerHTML = latauspiste.AddressInfo.AccessComments;
        navigoi.href = `https://www.google.com/maps/dir/?api=1&origin=${paikka.latitude},${paikka.longitude}&destination=${crd.latitude},${crd.longitude}&travelmode=driving`;
      });
  markers.addLayer(marker);
}

// Funktio, joka ajetaan, jos paikkatietojen hakemisessa tapahtuu virhe
function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

function kaynnistaPaikannus() {
// Käynnistetään paikkatietojen haku
  console.log('aloita paikannus');
  paikannus = navigator.geolocation.watchPosition(success, error, options);
}

// keskeytä paikannus, jos käyttäjä siirtää karttaa
map.on('mousedown', function() {
  console.log('paikannus keskeytetty?');
  navigator.geolocation.clearWatch(paikannus);
});

map.on('zoom', function() {
  zoomlevel = map.getZoom();
  console.log(zoomlevel);
});

// haetaan sähköautojen latauspisteet 10 km säteellä annetuista koordinaateista
// API-dokumentaatio: https://openchargemap.org/site/develop/api
const osoite = 'https://api.openchargemap.io/v3/poi/?';

function haeLatauspisteet(crd) {
  const parametrit = `coutrycode=FI&latitude=${crd.latitude}&longitude=${crd.longitude}&distance=10&distanceunit=km`;
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
      lisaaMarker(koordinaatit, teksti, vihreaIkoni, latauspisteet[i]);
    }
  });
}

// aloita paikannus
kaynnistaPaikannus();
