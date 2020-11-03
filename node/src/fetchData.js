const http = require('https');
const fs = require('fs');

const file = fs.createWriteStream("./../raw-data/RKI_COVID19.csv");
const request = http.get("https://npgeo-de.maps.arcgis.com/sharing/rest/content/items/f10774f1c63e40168479a1feb6c7ca74/data", function (response) {
    console.log("start to fetch data");
    response.pipe(file);
});
