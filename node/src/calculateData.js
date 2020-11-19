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

        const i0 = typeof Object.values(sortObject)[index] != "undefined" ? Object.values(sortObject)[index].sum : 0;
        const i1 = typeof Object.values(sortObject)[index + 1] != "undefined" ? Object.values(sortObject)[index + 1].sum : 0;
        const i2 = typeof Object.values(sortObject)[index + 2] != "undefined" ? Object.values(sortObject)[index + 2].sum : 0;
        const i3 = typeof Object.values(sortObject)[index + 3] != "undefined" ? Object.values(sortObject)[index + 3].sum : 0;
        const i4 = typeof Object.values(sortObject)[index + 4] != "undefined" ? Object.values(sortObject)[index + 4].sum : 0;
        const i5 = typeof Object.values(sortObject)[index + 5] != "undefined" ? Object.values(sortObject)[index + 5].sum : 0;
        const i6 = typeof Object.values(sortObject)[index + 6] != "undefined" ? Object.values(sortObject)[index + 6].sum : 0;
        const i7 = typeof Object.values(sortObject)[index + 7] != "undefined" ? Object.values(sortObject)[index + 7].sum : 0;

        const day0Before = i1;
        const day1Before = i2;
        const day2Before = i3;
        const day3Before = i4;
        const day4Before = i5;
        const day5Before = i6;
        const day6Before = i7;
        const day0After = i0;
        const day1After = i1;
        const day2After = i2;
        const day3After = i3;
        const day4After = i4;
        const day5After = i5;
        const day6After = i6;

        const averageLast7DaysBefore = day0Before +
            day1Before +
            day2Before +
            day3Before +
            day4Before +
            day5Before +
            day6Before;
        const averageLast7DaysAfter = day0After +
            day1After +
            day2After +
            day3After +
            day4After +
            day5After +
            day6After;

        const itemPreviousWeek = Object.values(sortObject)[index + 7];
        const dateObj = new Date(day);

        if (typeof itemPreviousDay != "undefined") {
            differenceInPercentDay = ((item.sum / itemPreviousDay.sum) * 100) - 100;
            differenceInPercentDay = differenceInPercentDay.toFixed(2);
        } else {
            differenceInPercentDay = -1;
        }

        averageLast7Days             = (averageLast7DaysAfter / 7).toFixed(2);
        differenceInPercentLast7Days = ((averageLast7DaysAfter / averageLast7DaysBefore) * 100) - 100;
        differenceInPercentLast7Days = differenceInPercentLast7Days.toFixed(2);

        if (typeof itemPreviousWeek != "undefined") {
            differenceInPercentWeek = ((item.sum / itemPreviousWeek.sum) * 100) - 100;
            differenceInPercentWeek = differenceInPercentWeek.toFixed(2);
        } else {
            differenceInPercentWeek = -1;
        }

        return {
            weekday: dateObj.toLocaleString("de-DE", { weekday: "short" }),
            date: dateObj.toLocaleDateString('de-DE'),
            sum: item.sum,
            differenceInPercentDay: differenceInPercentDay,
            averageLast7Days: averageLast7Days,
            differenceInPercentLast7Days: differenceInPercentLast7Days,
            differenceInPercentWeek: differenceInPercentWeek,
        };
    });

    Object.entries(sortObjectWeekDay).forEach(([key, val]) => {

    });

    let file = fs.createWriteStream('./../_data/RKI_COVID19_aggregated.csv');
    file.on('error', function (err) { console.log(err) });
    file.write('Datum, Anz. Fälle, Abw. Vortag in %, Ø letzte 7 Tage, Abw. letzte 7 Tage in %,  Abw. Vorwoche in %\n');
    Object.entries(sortObjectWeekDay).forEach(([key, val]) => {
        console.log(val);
        file.write(val.date + ' ' +
            val.weekday + ',' +
            val.sum + ',' +
            val.differenceInPercentDay + ',' +
            val.averageLast7Days + ',' +
            val.differenceInPercentLast7Days + ',' +
            val.differenceInPercentWeek + '\n');
    });
    file.end();

})();