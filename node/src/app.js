const csv = require('csv-parser');
const fs = require('fs');


console.log("test");

function getFilteredData(y, callback){ 
    const result = [];                 
    fs.createReadStream('Names.csv')
      .pipe(csv())
      .on('data', (row) => {
          const headers = Object.keys(row);
          if(Number(row[headers[1]]) === 6 && row[headers[2]] === y )
              result.push(row)
       })
      .on('end', () => {
          console.log('CSV file successfully processed');
          callback(result)
       });
}