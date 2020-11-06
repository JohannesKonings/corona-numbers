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

    const sortObjectWeekDay = Object.keys(sortObject).map((day, index) => {
        let differenceInPercentDay;
        let differenceInPercentWeek;

        const item = sortObject[day];
        const itemPreviousDay = Object.values(sortObject)[index + 1];
        const itemPreviousWeek = Object.values(sortObject)[index + 7];
        const dateObj = new Date(day);

        if (typeof itemPreviousDay != "undefined") {
            differenceInPercentDay = ((item.sum / itemPreviousDay.sum) * 100) - 100;
            differenceInPercentDay = differenceInPercentDay.toFixed(2);
        } else {
            differenceInPercentDay = -1;
        }

        if (typeof itemPreviousWeek != "undefined") {
            differenceInPercentWeek = ((item.sum / itemPreviousWeek.sum) * 100) - 100;
            differenceInPercentWeek = differenceInPercentWeek.toFixed(2);
        } else {
            differenceInPercentWeek = -1;
        }

        return {
            weekday: dateObj.toLocaleString("default", { weekday: "short" }),
            date: dateObj.toLocaleDateString(),
            sum: item.sum,
            differenceInPercentDay: differenceInPercentDay,
            differenceInPercentWeek: differenceInPercentWeek,
        };
    });

    Object.entries(sortObjectWeekDay).forEach(([key, val]) => {

    });

    let file = fs.createWriteStream('./../_data/RKI_COVID19_aggregated.csv');
    file.on('error', function (err) { Console.log(err) });
    file.write('Datum, Anzahl Fälle, Abweichung Vortag in %, Abweichung Vorwoche in %\n');
    Object.entries(sortObjectWeekDay).forEach(([key, val]) => {
        console.log(val);
        file.write(val.date + ' ' + val.weekday + ',' + val.sum + ',' + val.differenceInPercentDay + ',' + val.differenceInPercentWeek + '\n');
    });
    file.end();

})();