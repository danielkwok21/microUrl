import express from 'express';
import { CreateUrlRequest, CreateUrlResponse } from './constant/apiRequestResponse';
import { Url } from './constant/types';
import { getPostfixKey, GetPostfixRequest, GetPostfixResponse } from './external/ksg/ksg';
import bodyParser from 'body-parser'
import { getMicroUrl } from './util';
import db from './database/client';
import morgan from 'morgan'
import {
    getCurrentEpochInSeconds
} from './util'

const app = express();
const port = 3000;

/**Bodyparser middleware */
app.use(bodyParser.json())

/**Morgan middle ware for logging */
app.use(morgan('tiny'))

app.get('/', async (req, res) => {
    res.send("Hello world from microUrlService")
})

app.get('/:postfix', async (req, res) => {
    const {
        postfix
    } = req.params

    const query = `SELECT * FROM urls where postfixKey = '${postfix}'`
    const url: Url = await db(query).then(res => res[0])

    if (url) {
        res.redirect(url.originalUrl)
    } else {
        res.send(`Oops, no url detected.`)
    }
})

app.post('/createUrl', async (req, res) => {
    try {
        const body: CreateUrlRequest = req.body
        const {
            originalUrl
        } = body
        if (!originalUrl) throw new Error("Missing property 'originalUrl'")

        const getKeyRequest: GetPostfixRequest = {}
        const getKeyResponse = await getPostfixKey(getKeyRequest)
        const { postfix } = getKeyResponse
        if (!postfix) {
            throw new Error("No key found")
        }

        const url: Url = {
            originalUrl: originalUrl,
            postfixKey: postfix,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        }

        const q1 = `INSERT INTO urls (originalUrl, postfixKey, createdAt, updatedAt) VALUES ('${url.originalUrl}', '${url.postfixKey}',${getCurrentEpochInSeconds()},${getCurrentEpochInSeconds()})`
        await db(q1)

        const response: CreateUrlResponse = {
            success: true,
            message: null,
            url: getMicroUrl(url.postfixKey)
        }

        res.json(response)

    } catch (err) {
        const message = err instanceof Error ? err.message : err

        const response: CreateUrlResponse = {
            success: false,
            message: message,
            url: null
        }
        res.status(500).json(response)
    }
})


app.listen(port, () => {
    console.log(`MicrourlService is running on port ${port}.`);
});