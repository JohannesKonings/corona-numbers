const getCsvDataAsJson = require('./importData');

(async () => {

    const data = await getCsvDataAsJson();

    console.log("data", data);

})();