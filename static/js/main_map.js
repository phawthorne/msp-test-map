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

shapeFile = "static/data/census_bg.geojson";
fetch(shapeFile)
  .then(response => response.json())
  .then(data => L.geoJson(data).addTo(mspmap))
