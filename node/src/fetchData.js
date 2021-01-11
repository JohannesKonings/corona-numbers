const https = require('follow-redirects').https;
const fs = require('fs');

const fetchUrl = (url, filePath) => {
    console.log('fetch:', url);
    https.get(url, resp => resp.pipe(fs.createWriteStream(filePath)));
}

const fetch = async () => {
    let url;
    let filePath;

    url = 'https://npgeo-de.maps.arcgis.com/sharing/rest/content/items/f10774f1c63e40168479a1feb6c7ca74/data';
    filePath = './../raw-data/RKI_COVID19.csv';
    fetchUrl(url, filePath);

    url = 'https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Daten/Impfquotenmonitoring.xlsx;jsessionid=E77F3BDDD7B9730B5EACCD0110AA76D5.internet092?__blob=publicationFile';
    filePath = './../raw-data/Impfquotenmonitoring.xlsx';
    fetchUrl(url, filePath);
};

fetch();

