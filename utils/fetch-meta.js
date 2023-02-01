const { metaUrl } = require('../config.json');
const fs = require('fs');
const { Readable } = require('stream');
const { finished } = require('stream/promises');

(async() => {
    const stream = fs.createWriteStream('meta.json');
    const { body } = await fetch(metaUrl);
    await finished(Readable.fromWeb(body).pipe(stream));
    console.log("Successfully fetched metadata.")
})();