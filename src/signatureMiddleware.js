// @ts-check
const express = require('express')

const { DISCORD_PUBLIC_KEY } = require('./env')
const { verifyKey } = require('discord-interactions')

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const signatureMiddlleware = (req, res, next) => {
    /** @type {string} */
    let rawBody = ''
    express.json({
        verify: (_req, _res, buf) => {
            rawBody = buf.toString('utf-8')
        }
    })(req, res, () => {
        const signature = req.header('X-Signature-Ed25519')
        const timestamp = req.header('X-Signature-Timestamp')
        const key = /** @type {string} */ (DISCORD_PUBLIC_KEY)

        if (!signature || !timestamp) {
            res.sendStatus(401)
            return
        }

        const verified = verifyKey(rawBody, signature, timestamp, key)

        if (!verified) {
            res.sendStatus(401)
        } else {
            next()
        }
    })
}

module.exports = { signatureMiddlleware }
