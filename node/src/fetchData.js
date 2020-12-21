const https = require('follow-redirects').https;
const fs = require('fs');

const url = 'https://npgeo-de.maps.arcgis.com/sharing/rest/content/items/f10774f1c63e40168479a1feb6c7ca74/data';
const filePath = './../raw-data/RKI_COVID19.csv';

https.get(url, resp => resp.pipe(fs.createWriteStream(filePath)));

