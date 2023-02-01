const fs = require("fs");
const sqlite = require('sqlite3').verbose();

(async() => {
    const initScript = fs.readFileSync('./db/init.sql').toString();
    const init = initScript.toString().split(';');
    const db = new sqlite.Database("./defaults.db");
    console.log(`Starting database initialization. Running ${init.length-1} queries.`)
    db.serialize(() => {
        init.forEach((query) => {
            if(query === '') return;
            db.run(query);
        })
    })
    console.log(`Successfully initialized database.`)
    db.close();
})();