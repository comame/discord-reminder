const { getUpcomingRemindsByUser } = require('../../db')

/** @type {import('../interactionHandler').asyncInteractionHandler} */
const listRemindsCommandHandler = async (data) => {
    /** @type {string} */
    const user = data.member.user.id
    const reminds = await getUpcomingRemindsByUser(user, Date.now())

    return ({
        type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
        data: {
            content: JSON.stringify(reminds, null, 2),
            flags: 1 << 6
        }
    })
}

module.exports = { listRemindsCommandHandler }
