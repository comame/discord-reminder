// @ts-check

const sqlite3 = require('sqlite3')
const sqlite = require('sqlite')

/** @typedef {import('sqlite').Database<import('sqlite3').Database, import('sqlite3').Statement>} Db */

/** @type {Db|null} */
let dbInstance = null

/**
 * @returns {Promise<Db>}
 */
async function getDb() {
    if (!dbInstance) {
        dbInstance = await sqlite.open({
            filename: './sqlite.db',
            driver: sqlite3.Database
        })
    }
    return dbInstance
}

module.exports = { getDb }
