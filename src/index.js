// @ts-check

const express = require('express')
const { applicationCommandInteractionHandler } = require('./applicationCommandInteractionHandler')
const { pingInteractionHandler } = require('./pingInteractionHandler')
const { signatureMiddlleware } = require('./signatureMiddleware')

const app = express()

app.use(signatureMiddlleware)

app.post('/', async (req, res) => {
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
})

app.listen(process.env['PORT'] ?? 8080, () => {
    console.log(`Listening on port ${process.env['PORT'] ?? 8080}`)
})
