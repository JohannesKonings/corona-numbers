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

    const sortObject = Object.entries(total).sort().reverse().reduce( (o,[k,v]) => (o[k]=v,o), {} )

    //console.log("total", sortObject);

    var file = fs.createWriteStream('./../_data/RKI_COVID19_aggregated.csv');
    file.on('error', function (err) { Console.log(err) });
    file.write('Datum, Anzahl Fälle\n' );
    Object.entries(sortObject).forEach(([key, val]) => {
        console.log(key); // the name of the current key.
        console.log(val.sum); // the value of the current key.
        file.write(key + ',' + val.sum + '\n');
      });
    file.end();

})();