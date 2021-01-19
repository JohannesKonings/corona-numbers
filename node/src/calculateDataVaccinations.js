const { getExcelDataAsJson } = require('./convertData2Json');
const fs = require('fs');

(async () => {

    const data = await getExcelDataAsJson();

    const vaccinations = data.filter((line, index) => {

        let date;
        let count1;
        let count2;

        try {
            date = line[0].toLocaleDateString('de-DE');
            count1 = line[1];
            count2 = line[2];
        }
        catch (err) {
            //console.log('err', err);
        }
        if (typeof date !== "undefined") {
            return {
                date: date,
                count1: count1,
                count2: count2,
            };
        }
    })
    vaccinations.sort((a, b) => a[0] > b[0] ? -1 : 1);

    let file = fs.createWriteStream('./../_data/Impfquotenmonitoring_cleansed.csv');
    file.on('error', function (err) { console.log(err) });
    file.write('Datum, erste Impfungen, zweite Impfungen \n');
    vaccinations.forEach((line) => {
        console.log("line", line);
        file.write(line[0] + ',' +
            line[1] + ',' +
            line[2] + '\n');
    });
    file.end();

})();