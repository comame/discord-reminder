const { getUpcomingRemindsByUser } = require('../../db')

/** @type {import('../interactionHandler').asyncInteractionHandler} */
const listRemindsCommandHandler = async (data) => {
    /** @type {string} */
    const user = data.member.user.id
    const reminds = await getUpcomingRemindsByUser(user, Date.now())

    if (reminds.length == 0) {
        return ({
            type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
            data: {
                content: 'No reminders!',
                flags: 1 << 6
            }
        })
    }

    let text = ''
    for (const remind of reminds) {
        text += `ID ${remind.id}: ${remind.title} (${new Date(remind.time).toLocaleString('ja-JP', {
            timeZone: 'JST'
        })})\n`
    }

    return ({
        type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
        data: {
            content: text,
            flags: 1 << 6
        }
    })
}

module.exports = { listRemindsCommandHandler }
