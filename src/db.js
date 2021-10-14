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

/**
 * @param {import('./tables').reminds} remind
 */
async function insertRemind(remind) {
    (await getDb()).run(
        `
            INSERT INTO reminds
            (user, title, 'time', everyone, channel)
            values (?, ?, ?, ?, ?)
        `, remind.user,
        remind.title,
        remind.time,
        remind.everyone ? 1 : 0,
        remind.channel
    )
}

/**
 * @param {string} user
 * @returns {Promise<import('./tables').reminds[]>}
 */
async function getRemindByUser(user) {
    const reminds = (await getDb()).all(`
        SELECT * from reminds where user = ?
    `, user)
    return (await reminds).map(dbRemindToJson)
}

/**
 * @param {number} time
 * @return {Promise<import('./tables').reminds[]>}
 */
async function getPastReminds(time) {
    const reminds = (await getDb()).all(`
        select * from reminds where time <= ?
    `, time)
    return (await reminds).map(dbRemindToJson)
}

/**
 * @param {string} user
 * @param {number} time
 * @return {Promise<import('./tables').reminds[]>}
 */
async function getUpcomingRemindsByUser(user, time) {
    const reminds = await (await getDb()).all(`
        select * from reminds where (user = ? or everyone = 1) and time > ?
    `, user, time)
    return reminds.map(dbRemindToJson)
}

/**
 * @param {number} id
 */
async function deleteRemind(id) {
    return (await getDb()).run(`
        delete from reminds where id = ?
    `, id)
}

/**
 * @param {any} remind
 * @returns {import('./tables').reminds}
 */
function dbRemindToJson(remind) {
    return {
        ...remind,
        everyone: remind.everyone == 1
    }
}

module.exports = { getDb, insertRemind, getRemindByUser, getPastReminds, getUpcomingRemindsByUser, deleteRemind }
