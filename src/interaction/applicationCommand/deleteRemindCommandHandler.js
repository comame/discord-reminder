const { deleteRemind } = require('../../db')

/** @type {import('../interactionHandler').asyncInteractionHandler} */
const deleteRemindCommandHandler = async (data) => {
    /** @type {string} */
    const id = data.data.options.find((/** @type {any} */ op) => op.name == 'id').value
    await deleteRemind(Number.parseInt(id, 10))
    return ({
        type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
        data: {
            content: `Deleted.`,
            flags: 1 << 6
        },
    })
}

module.exports = { deleteRemindCommandHandler }
