import bodyParser from 'body-parser';
import express from 'express';
import { nanoid } from 'nanoid';
import config from './config';
import { GetPostfixResponse } from './constant/apiRequestResponse';
import { AvailableKey } from './constant/types';
import db from './database/client';
import morgan from 'morgan'
import { getCurrentEpochInSeconds } from './util'

const app = express();
const port = config.port;

/**Middleware */
app.use(bodyParser.json())
app.use(morgan('tiny'))

app.get('/', async (req, res) => {
    res.status(200).send("hello world from key generation service")
})

app.get('/healthcheck', async (req, res) => {
    res.status(200).send(true)
})

let isRunning = false
async function generateAvailableKeys(limit: number = 10): Promise<AvailableKey[]> {
    let keys: AvailableKey[] = []
    if (isRunning) {
        console.log(`generateKeysIfLow is already running. Skipping`)
        keys = await db(`SELECT * FROM availableKeys`) as AvailableKey[]
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
        /**Get one key */
        let availableKey: AvailableKey = await db(`SELECT * FROM availableKeys LIMIT 1`).then(res => res[0])

        if (!availableKey) {
            /**
             * If no keys found, generate one first, and return it
             * Then, spin off separate process to generate more keys, async 
             */
            availableKey = await generateAvailableKeys(1).then(res => res[0])

            generateAvailableKeys()
        } else {
            /**Generate unavailablekey and remove availablekey, async */
            const q1 = `INSERT INTO unavailableKeys (postfixKey, createdAt) VALUES ('${availableKey.postfixKey}', ${getCurrentEpochInSeconds()})`
            db(q1)
            const q2 = `DELETE FROM availableKeys WHERE postfixKey='${availableKey.postfixKey}'`
            db(q2)
        }

        const response: GetPostfixResponse = {
            success: true,
            message: null,
            postfix: availableKey.postfixKey
        }

        res.json(response)
    } catch (err) {
        const message = err instanceof Error ? err.message : err

        const response: GetPostfixResponse = {
            success: false,
            message: message,
            postfix: null
        }

        res.status(500).json(response)
    }
})

app.listen(port, () => {
    console.log(`keyGenerationService is running on port ${port}.`);
});