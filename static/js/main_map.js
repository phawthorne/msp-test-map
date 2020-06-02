const mapboxAccessToken = 'pk.eyJ1IjoicGhhd3Rob3JuZSIsImEiOiJja2F5ZXBpbzgwaTkyMnRvYWV2OGE5bGs2In0.rN3rLLwuUnA5D4QHDgsPjg';
let mspmap = L.map('main-map').setView([44.9778, -93.2650], 11);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: mapboxAccessToken
}).addTo(mspmap);


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

shapeFile = "static/data/census_bg.geojson";
fetch(shapeFile)
  .then(response => response.json())
  .then(data => L.geoJson(data, {style: style}).addTo(mspmap))
