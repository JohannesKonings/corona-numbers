const csv = require('csv-parser');
const readXlsxFile = require('read-excel-file/node');
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

const readExcelData = async (y) => {
    console.log('start read Excel...');
    return new Promise((resolve, reject) => {
        readXlsxFile(fs.createReadStream('./../raw-data/Impfquotenmonitoring.xlsx'), { sheet: 3 }).then((rows) => {
            resolve(rows);
        })
    })
}

const getCsvDataAsJson = async () => {
    const jsonData = await readCsvData();
    return jsonData;
};

const getExcelDataAsJson = async () => {
    const jsonData = await readExcelData();
    return jsonData;
};

module.exports = { getCsvDataAsJson, getExcelDataAsJson };
