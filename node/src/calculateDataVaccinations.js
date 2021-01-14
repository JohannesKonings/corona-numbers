const { getExcelDataAsJson } = require('./convertData2Json');
const fs = require('fs');

(async () => {

    const data = await getExcelDataAsJson();

    const vaccinations = data.filter((line, index) => {

        let date;
        let count;

        try {
            date = line[0].toLocaleDateString('de-DE')
            count = line[1]
        }
        catch (err) {
            //console.log('err', err);
        }
        if (typeof date !== "undefined") {
            return {
                date: date,
                count: count,
            };
        }
    })
    vaccinations.sort((a, b) => a[0] > b[0] ? -1 : 1);

    let file = fs.createWriteStream('./../_data/Impfquotenmonitoring_cleansed.csv');
    file.on('error', function (err) { console.log(err) });
    file.write('Datum, Impfungen \n');
    vaccinations.forEach(([key, val]) => {
        file.write(key + ',' +
            val + '\n');
    });
    file.end();

})();