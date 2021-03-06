const { deleteRemindCommandHandler } = require('./deleteRemindCommandHandler')
const { helpCommandHandler } = require('./helpCommandHandler')
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
        case 'help': {
            return await helpCommandHandler(data)
        }
        case 'delete-reminder': {
            return await deleteRemindCommandHandler(data)
        }
    }

}

module.exports = { applicationCommandInteractionHandler }
