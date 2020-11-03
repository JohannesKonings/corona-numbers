const convertData2Json = require('./convertData2Json');
const fs = require('fs');

(async () => {

    const data = await convertData2Json();

    console.log("data", data);

    var file = fs.createWriteStream('./../_data/RKI_COVID19_aggregated.csv');
    file.on('error', function (err) { Console.log(err) });
    file.write('test');
    file.end();

})();