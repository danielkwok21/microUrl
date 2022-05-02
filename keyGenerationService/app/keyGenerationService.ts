import express from 'express';
import { CreateUrlRequest, CreateUrlResponse } from './constant/apiRequestResponse';
import { AvailableKey, Url } from './constant/types';
import db from './database/client';
import bodyParser from 'body-parser'
import { getMicroUrl } from './util';
import config from './config';
import { nanoid } from 'nanoid'

const app = express();
const port = config.port;

/**Bodyparser middleware */
app.use(bodyParser.json())


app.get('/', async (req, res) => {
    res.send("hello world from key generation service")
})

function getCurrentEpochInSeconds() {
    return Math.floor(Date.now() / 1000)
}

let isRunning = false
async function generateAvailableKeys(limit: number = 3): Promise<AvailableKey[]> {
    let keys: AvailableKey[] = []
    if (isRunning) {
        console.log(`generateKeysIfLow is already running. Skipping`)
        return keys
    } else {
        console.log(`generateKeysIfLow...`)
        isRunning = true

        for (let i = 0; i < limit; i++) {
            try {
                const postfixKey = nanoid(10)
                const availableKey: AvailableKey = {
                    postfixKey,
                    createdAt: getCurrentEpochInSeconds(),
                }

                const query = `INSERT INTO availableKeys (postfixKey, createdAt) VALUES ('${availableKey.postfixKey}', ${availableKey.createdAt})`
                
                await db(query)
                await new Promise<void>((res, rej) => setTimeout(() => res(), 3 * 1000))

                keys.push(availableKey)
                console.log({ i, postfixKey })
            } catch (err) {
                console.log(`Error for i=${i}`, err)
                continue
            }
        }
        isRunning = false
        console.log(`...generateKeysIfLow`)

        return keys
    }
}

app.get('/key', async (req, res) => {
    try {
        const {
            originalUrl
        } = <CreateUrlRequest>req.query
        if (!originalUrl) throw new Error("No originalUrl provided")

        /**Get 1 key */
        let availableKey: AvailableKey = await db(`SELECT * FROM availableKeys LIMIT 1`).then(res => res[0])


        if (!availableKey) {
            availableKey = await generateAvailableKeys(1).then(res => res[0])

            /**Spin off separate process to generate more keys, async */
            generateAvailableKeys()
        }else{
            /**Generate unavailablekey and remove availablekey, async */
            const q1 = `INSERT INTO unavailableKeys (postfixKey, createdAt) VALUES ('${availableKey.postfixKey}', ${availableKey.createdAt})`
            db(q1)
            const q2 = `DELETE FROM availableKeys WHERE postfixKey='${availableKey.postfixKey}'`
            db(q2)
        }

        const response: CreateUrlResponse = {
            success: true,
            message: null,
            url: getMicroUrl(availableKey.postfixKey)
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
    console.log(`keyGenerationService is running on port ${port}.`);
});