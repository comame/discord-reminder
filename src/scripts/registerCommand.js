// @ts-check

const { request } = require('../request')
const { DISCORD_APPLICATION_ID, DISCORD_BOT_TOKEN } = require('../env')

async function registerCommand() {
    const url = `https://discord.com/api/v8/applications/${DISCORD_APPLICATION_ID}/commands`
    const commands = [{
        name: 'remind',
        description: 'Set a reminder',
        options: [{
            name: "title",
            description: "The title of reminder",
            type: 3, // string
            required: true
        }, {
            name: 'time',
            description: 'When to remind (/help for syntax)',
            type: 3, // string
            required: true
        }, {
            name: 'everyone',
            description: 'Set a reminder for everyone',
            type: 5, // boolean
            required: false
        }]
    }, {
        name: 'help',
        description: 'Get help'
    }, {
        name: 'list-reminders',
        description: 'List your reminders'
    }]

    /** @type {import('../request').Header[]} */
    const headers = [[ 'Authorization', `Bot ${DISCORD_BOT_TOKEN}` ]]

    commands.forEach(async body => {
        const res = await request(url, 'POST', headers, body)
        console.log(res)
    })
}

module.exports = { registerCommand }

registerCommand()
