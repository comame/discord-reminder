// @ts-check

const _env = {
    DISCORD_APPLICATION_ID: process.env['DISCORD_APPLICATION_ID'],
    DISCORD_PUBLIC_KEY: process.env['DISCORD_PUBLIC_KEY'],
    DISCORD_BOT_TOKEN: process.env['DISCORD_BOT_TOKEN']
}

let err = false
for (const key of Object.keys(_env)) {
    if ([ '', null, undefined ].includes(/** @type {any}} */ (_env)[key])) {
        err = true
        console.error(`Set ${key}`)
    }
}

if (err) throw ''

module.exports = _env
