const { parseTime } = require('./parseTime')

/** @type {import('./interactionHandler').asyncInteractionHandler} */
const applicationCommandInteractionHandler = async (data) => {
    /** @type {string} */
    const title = data.data.options.find((/** @type {any} */ op) => op.name === 'title').value
    /** @type {boolean} */
    const everyone = data.data.options.find((/** @type {any} */ op) => op.name === 'everyone')?.value ?? false
    /** @type {string} */
    const time = data.data.options.find((/** @type {any} */ op) => op.name === 'time').value
    /** @type {string} */
    const user = data.member.user.id

    const remindTime = parseTime(time)

    const content = everyone ?
        `@everyone I will remind you all to ${title} at ${new Date(remindTime).toLocaleString('ja-JP', { timeZone: 'JST' })}.` :
        `<@${user}> I will remind you to ${title} at ${new Date(remindTime).toLocaleString('ja-JP', { timeZone: 'JST' })}.`

    /** @type {import('./tables').reminds} */
    const row = {
        user,
        title,
        everyone,
        time: remindTime
    }

    return ({
        type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
        data: {
            allowed_mentions: {
                parse: [ 'users', 'everyone' ]
            },
            content,
            flags: everyone ? null : 1 << 6
        }
    })
}

module.exports = { applicationCommandInteractionHandler }
