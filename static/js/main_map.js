const mapboxAccessToken = 'sk.eyJ1IjoicGhhd3Rob3JuZSIsImEiOiJja2F5aGxxZm8wamVhMnhzOGFiazJ3ajVkIn0.SCkw2StsCcK38QmFmaFJ6w';


const mbAttribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
const mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}'

const lightMap = L.tileLayer(mbUrl, {
  attribution: mbAttribution,
  maxZoom: 18,
  id: 'mapbox/light-v10',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: mapboxAccessToken
});
const streetMap = L.tileLayer(mbUrl, {
  attribution: mbAttribution,
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: mapboxAccessToken
});
const baseLayers = {
  "Grayscale": lightMap,
  "Streets": streetMap
};

const chlorocolors = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a'];

const getColor = (d) => {
  const idstr = d.toString();
  const idChar = idstr.charAt(idstr.length-1);
  return chlorocolors[parseInt(idChar)];
}

const style = (feature) => {
  return {
    fillColor: getColor(feature.properties.OBJECTID),
    weight: 1,
    opacity: 0.5,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  };
}

let cbOverlay = L.layerGroup();
let overlays = {"Census blocks": cbOverlay};


let mspmap = L.map('main-map', {
  center: [44.9778, -93.2650],
  zoom: 11,
  layers: [lightMap, cbOverlay]
});

shapeFile = "static/data/census_bg.geojson";
fetch(shapeFile)
  .then(response => response.json())
  .then(data => {
    L.geoJson(data, {style: style}).addTo(cbOverlay);
    L.control.layers(baseLayers, overlays).addTo(mspmap);
  });

