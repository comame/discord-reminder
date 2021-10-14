const { getDb } = require('../db')

async function initDb() {
    const db = await getDb()

    await db.exec(`
        CREATE TABLE reminds (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user TEXT,
            title TEXT,
            channel TEXT,
            time INTEGER,
            everyone INTEGER
        )
    `)
}

initDb()
