const csv = require('csv-parser');
const fs = require('fs');

const readCsvData = async (y) => {
    const result = [];
    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream('./../raw-data/RKI_COVID19.csv')
            .pipe(csv())
            .on('data', async (row) => {
                result.push(row)
            })
            .on('end', () => {
                console.log('CSV file successfully processed');
                resolve(result);
            });
    })
}

const getCsvDataAsJson = async () => {
    const jsonData = await readCsvData();
    return jsonData;
};

module.exports = getCsvDataAsJson;
