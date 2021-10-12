// @ts-check

const https = require('https')

/**
 * @typedef {{
 *     statusCode: number,
 *     body: string
 * }} Response
 */

/**
 * @typedef {[ name: string, value: string ]} Header
 */

/**
 * @param {string} url
 * @param {string} method
 * @param {any} body
 * @param {Header[]} headers
 * @returns {Promise<Response>}
 */
async function request(url, method, headers, body) {
    return new Promise((resolve, reject) => {
        let responseStr = ''

        const req = https.request(url, {
            method,
            headers: Object.fromEntries([
                ...headers,
                [ 'Content-Type', 'application/json' ]
            ])
        }, res => {
            res.on('data', d => {
                responseStr += d.toString('utf8')
            })
            res.on('close', () => {
                resolve({
                    statusCode: res.statusCode ?? 0,
                    body: responseStr
                })
            })
        })

        req.on('error', (/** @type {any} */ err) => {
            reject(err)
        })

        req.end(JSON.stringify(body))
    })
}

module.exports = { request }
