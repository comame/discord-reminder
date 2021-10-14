const { DISCORD_BOT_TOKEN } = require('../../env')
const { request } = require('../../request')

/**
 * @param {string} channel
 * @param {string} text
 * @param {boolean} everyone
 * @param {string|null} replyUser
 */
async function sendMessage(channel, text, everyone, replyUser = null) {
    const url = `https://discord.com/api/v9/channels/${channel}/messages`

    let content = text
    if (everyone) {
        content = '@everyone ' + text
    } else if (replyUser) {
        content = `<@${replyUser}> ${text}`
    }

    /** @type {string[]} */
    const allowedMentions = []
    if (everyone) allowedMentions.push('everyone')

    const body = {
        content,
        allowed_mentions: {
            parse: allowedMentions,
            users: [ replyUser ]
        }
    }
    await request(url, 'POST', [
        [ 'User-Agent', 'Reminder (https://comame.xyz, 1)' ],
        [ 'Authorization', `Bot ${ DISCORD_BOT_TOKEN}` ]
    ], body)
}

module.exports = { sendMessage }
