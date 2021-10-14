const { insertRemind } = require('../../db')
const { parseTime } = require('../../parseTime')

/** @type {import('../interactionHandler').asyncInteractionHandler} */
const remindCommandHandler = async (data) => {
    /** @type {string} */
    const title = data.data.options.find((/** @type {any} */ op) => op.name === 'title').value
    /** @type {boolean} */
    const everyone = data.data.options.find((/** @type {any} */ op) => op.name === 'everyone')?.value ?? false
    /** @type {string} */
    const time = data.data.options.find((/** @type {any} */ op) => op.name === 'time').value
    /** @type {string} */
    const user = data.member.user.id
    /** @type {string} */
    const channel = data.channel_id

    const remindTime = parseTime(time)

    if (remindTime == null) {
        return ({
            type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
            data: {
                allowed_mentions:{ parse: [ 'users' ]},
                content: `<@${user}> Invlid time format :/`,
                flags: 1 << 6
            },
        })
    }

    if (remindTime <= Date.now()) {
        return ({
            type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
            data: {
                allowed_mentions: { parse: [ 'users' ] },
                content: `<@${user}> You cannot set past reminder.`
            }
        })
    }

    const content = everyone ?
        `@everyone I will remind you all to ${title} at ${new Date(remindTime).toLocaleString('ja-JP', { timeZone: 'JST' })}.` :
        `<@${user}> I will remind you to ${title} at ${new Date(remindTime).toLocaleString('ja-JP', { timeZone: 'JST' })}.`

    /** @type {import('../../tables').reminds} */
    const row = {
        user,
        title,
        everyone,
        channel,
        time: remindTime
    }

    await insertRemind(row)

    return ({
        type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
        data: {
            allowed_mentions: {
                parse: [ 'users', 'everyone' ]
            },
            content,
            flags: everyone ? 0 : 1 << 6
        }
    })
}

module.exports = { remindCommandHandler }
