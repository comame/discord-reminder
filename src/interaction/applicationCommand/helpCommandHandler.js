/** @type {import('../interactionHandler').asyncInteractionHandler} */
const helpCommandHandler = async (data) => {
    /** @type {string} */
    const user = data.member.user.id

    const content = `<@${user}> Time examples:\n` +
        'today midnight\n' +
        'tomorrow afternoon\n' +
        'tomorrow 1am\n' +
        '1hours\n' +
        '5minuts\n' +
        '7days'


    return ({
        type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
        data: {
            allowed_mentions:{ parse: [ 'users' ] },
            flags: 1 << 6,
            content
        }
    })
}

module.exports = { helpCommandHandler }
