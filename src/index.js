// @ts-check

const express = require('express')
const { applicationCommandInteractionHandler } = require('./interaction/applicationCommand/applicationCommandInteractionHandler')
const { pingInteractionHandler } = require('./interaction/pingInteractionHandler')
const { periodicReminder } = require('./remind')
const { signatureMiddlleware } = require('./signatureMiddleware')

const app = express()

app.use(signatureMiddlleware)

app.post('/', async (req, res) => {
    try {
        switch (req.body.type) {
            // Ping
            case 1: {
                res.send(pingInteractionHandler(req.body))
                break
            }
            // Application Command
            case 2: {
                res.send(await applicationCommandInteractionHandler(req.body))
                break
            }
            default: {
                res.sendStatus(400)
            }
        }
    } catch (err) {
        console.log(err)
        res.send({
            type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
            data: {
                allowed_mentions: {
                    parse: [ 'users' ]
                },
                content: `<@${req.body.member.user.id}> Something went wrong :/`,
                flags: 1 << 6
            }
        })
    }
})

app.listen(process.env['PORT'] ?? 8080, () => {
    console.log(`Listening on port ${process.env['PORT'] ?? 8080}`)
})

setInterval(() => {
    periodicReminder()
}, 30 * 1000)
