const mapboxAccessToken = 'sk.eyJ1IjoicGhhd3Rob3JuZSIsImEiOiJja2F5aGxxZm8wamVhMnhzOGFiazJ3ajVkIn0.SCkw2StsCcK38QmFmaFJ6w';


const mbAttribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
const mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}'


const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

const capitalizeEachWord = (s) => {
  if (typeof s !== 'string') return ''
  words = s.split(" ").map(w => capitalize(w));
  return words.join(" ")
}

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

// SET UP MAIN DISTANCE TO MARKET OVERLAYS
const chlorocolors = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a'];

const getColor = (d) => {
  const idstr = d.toString();
  const idChar = idstr.charAt(idstr.length-1);
  return chlorocolors[parseInt(idChar)];
}

const distanceStyle = (feature) => {
  return {
    fillColor: getColor(feature.properties.OBJECTID),
    weight: 0,
    opacity: 0.5,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.5
  };
}

let cbOverlay = L.geoJSON(null, {style: distanceStyle});
let hexOverlay = L.geoJSON(null, {style: distanceStyle});

// SET UP MARKET POINT OVERLAYS
const farmersMarketMarkerStyle = {
  radius: 5,
  fillColor: "#228800",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};
const farmersMarketMarkerFunction = (feature, latlng) => {
  return L.circleMarker(latlng, farmersMarketMarkerStyle);
}
const farmersMarketOnEachFeature = (feature, layer) => {
  if (feature.properties && feature.properties.Market_Nam) {
      const popupContent = capitalizeEachWord(feature.properties.Market_Nam);
      layer.bindPopup(popupContent);
  }
}
let farmersMarkets = L.geoJSON(null, {
  pointToLayer: farmersMarketMarkerFunction,
  onEachFeature: farmersMarketOnEachFeature
});

const superMarketMarkerStyle = {
  radius: 5,
  fillColor: "#ff7800",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};
const supermarketMarkerFunction = (feature, latlng) => {
  return L.circleMarker(latlng, superMarketMarkerStyle);
};
const supermarketOnEachFeature = (feature, layer) => {
  if (feature.properties && feature.properties.CONAME) {
    const popupContent = capitalizeEachWord(feature.properties.CONAME);
    layer.bindPopup(popupContent);
}
}
let supermarkets = L.geoJSON(null, {
  pointToLayer: supermarketMarkerFunction,
  onEachFeature: supermarketOnEachFeature
});


// CREATE THE MAP
let mspmap = L.map('main-map', {
  center: [44.9778, -93.2650],
  zoom: 11,
  layers: [lightMap, cbOverlay]
});


// LOAD DATA FROM THE GEOJSONS AND ADD TO LAYERS
censusBlocksFile = "static/data/census_bg.geojson";
fetch(censusBlocksFile)
  .then(response => response.json())
  .then(data => {
    cbOverlay.addData(data);
});

hexMspFile = "static/data/hex_msp.geojson";
fetch(hexMspFile)
  .then(response => response.json())
  .then(data => {
    hexOverlay.addData(data);
});

farmersMarketsFile = "static/data/MSP_Farmers_Markets.geojson";
fetch(farmersMarketsFile)
  .then(response => response.json())
  .then(data => {
    farmersMarkets.addData(data);
});

supermarketsFile = "static/data/ESRI_Supermarkets.geojson";
fetch(supermarketsFile)
  .then(response => response.json())
  .then(data => {
    supermarkets.addData(data);
});


// SET UP LAYER CONTROL
const overlays = {
  "Aggregation Layers": {
    "Census blocks": cbOverlay,
    "Grid": hexOverlay
  },
  "Food sources (?)": {
    "Farmers markets": farmersMarkets,
    "Supermarkets": supermarkets
  }
};
const overlayOptions = {
  // exclusiveGroups:["Aggregation Layers"]
}

let layerControl = L.control.groupedLayers(baseLayers, overlays, overlayOptions);
mspmap.addControl(layerControl);
