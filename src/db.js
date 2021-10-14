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
    const remind = (await getDb()).all(`
        SELECT * from reminds where user = ?
    `, user)
    return remind
}

/**
 * @param {string} user
 * @param {number} time
 * @return {Promise<import('./tables').reminds[]>}
 */
async function getPastRemindsByUser(user, time) {
    return (await getDb()).all(`
        select * from reminds where user = ? and time <= ?
    `, user, time)
}

/**
 * @param {string} user
 * @param {number} time
 * @return {Promise<import('./tables').reminds[]>}
 */
async function getUpcomingRemindsByUser(user, time) {
    return (await getDb()).all(`
        select * from reminds where user = ? and time > ?
    `, user, time)
}

/**
 * @param {number} id
 */
async function deleteRemind(id) {
    return (await getDb()).run(`
        delete from reminds where id = ?
    `, id)
}

module.exports = { getDb, insertRemind, getRemindByUser, getPastRemindsByUser, getUpcomingRemindsByUser, deleteRemind }
