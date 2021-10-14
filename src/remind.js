const { getPastReminds, deleteRemind } = require('./db')
const { sendMessage } = require('./interaction/channel/sendMessage')

async function periodicReminder() {
    const pastReminds = await getPastReminds(Date.now())
    for (const remind of pastReminds) {
        await sendMessage(
            remind.channel,
            remind.title,
            remind.everyone,
            remind.user
        )
        await deleteRemind(/** @type {any} */ (remind.id))
    }
}

module.exports = { periodicReminder }
