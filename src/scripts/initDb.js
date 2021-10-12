const { getDb } = require('../db')

async function initDb() {
    const db = await getDb()

    await db.exec(`
        CREATE TABLE reminds (
            user TEXT,
            title TEXT,
            time INTEGER,
            everyone INTEGER
        )
    `)
}

initDb()
