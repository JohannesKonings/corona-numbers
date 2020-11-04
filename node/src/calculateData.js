const convertData2Json = require('./convertData2Json');
const fs = require('fs');

(async () => {

    const data = await convertData2Json();

    const total = data.reduce((acc, curr) => {
        if (!acc[curr.Meldedatum]) {
            acc[curr.Meldedatum] = { sum: parseInt(curr.AnzahlFall) };
            return acc;
        }
        acc[curr.Meldedatum].sum += parseInt(curr.AnzahlFall);

        return acc;
    }, {});

    const sortObject = Object.entries(total).sort().reverse().reduce((o, [k, v]) => (o[k] = v, o), {})

    const sortObjectWeekDay = Object.keys(sortObject).map(day => {
        const item = sortObject[day];
        let dateObj = new Date(day);
        return {
            weekday: dateObj.toLocaleString("default", { weekday: "short" }),
            date: dateObj.toLocaleDateString(),
            sum: item.sum
        };
    });

    var file = fs.createWriteStream('./../_data/RKI_COVID19_aggregated.csv');
    file.on('error', function (err) { Console.log(err) });
    file.write('Datum, Anzahl Fälle\n');
    Object.entries(sortObjectWeekDay).forEach(([key, val]) => {
        console.log(val);
        file.write(val.date + ' ' + val.weekday + ',' + val.sum + '\n');
    });
    file.end();

})();