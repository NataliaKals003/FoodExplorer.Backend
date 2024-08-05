const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");
const path = require("path");

async function sqliteConnection() {
    const databse = await sqlite.open({
        filename: path.resolve(__dirname, "..", "databse.db"),
        driver: sqlite3.Database
    });
    return databse;
}

module.exports = sqliteConnection;
