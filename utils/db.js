const sqlite = require('sqlite3').verbose();

module.exports = {
    async setDefaults(alphanef, pseudo, tag) {
        const db = new sqlite.Database("./defaults.db");
        db.run("INSERT INTO defaults VALUES (?, ?, ?) ON CONFLICT(tag) DO UPDATE SET alphanef = ?, pseudo = ?", [tag, alphanef, pseudo, alphanef, pseudo]);
        db.close();
    },
    async getDefautls(tag) {
        const db = new sqlite.Database("./defaults.db");
        db.get(`SELECT * FROM defaults WHERE tag = ${tag}`, (row) => {
            db.close();
            return row;
        })
    }
}