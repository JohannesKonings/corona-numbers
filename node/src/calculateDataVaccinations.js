const { getExcelDataAsJson } = require('./convertData2Json');
const fs = require('fs');

(async () => {

    const data = await getExcelDataAsJson();

    const total = data.find(element => element[0] === 'Gesamt');

    const vaccinationsFiltered = data.filter((line, index) => {

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
    vaccinationsFiltered.sort((a, b) => a[0] > b[0] ? -1 : 1);

    const vaccinationsFormated = vaccinationsFiltered.map((line, index) => {

        return {
            weekday: line[0].toLocaleString("de-DE", { weekday: "short" }),
            date: line[0].toLocaleDateString('de-DE'),
            count1: line[1],
            count2: line[2],
            sum: line[3],
        };
    });

    let fileCleansed = fs.createWriteStream('./../_data/Impfquotenmonitoring_cleansed.csv');
    fileCleansed.on('error', function (err) { console.log(err) });
    fileCleansed.write('Datum, erste Impfungen, zweite Impfungen, Gesamt \n');
    vaccinationsFormated.forEach((line) => {
        fileCleansed.write(line.date + ' ' + line.weekday + ',' +
            line.count1 + ',' +
            line.count2 + ',' +
            line.sum + '\n');
    });
    fileCleansed.end();

    let fileTotal = fs.createWriteStream('./../_data/Impfquotenmonitoring_total.yml');
    fileTotal.on('error', function (err) { console.log(err) });
    fileTotal.write('totalCount1: ' + total[1] + '\n' +
        'totalCount2: ' + total[2] + '\n' +
        'totalSum: ' + total[3]);
    fileTotal.end();

})();