const { listRemindsCommandHandler } = require('./listRemindsCommandHandler')
const { remindCommandHandler } = require('./remindCommandHandler')

/** @type {import('../interactionHandler').asyncInteractionHandler} */
const applicationCommandInteractionHandler = async (data) => {
    switch (data.data.name) {
        case 'remind': {
            return await remindCommandHandler(data)
        }
        case 'list-reminders': {
            return await listRemindsCommandHandler(data)
        }
    }

}

module.exports = { applicationCommandInteractionHandler }
