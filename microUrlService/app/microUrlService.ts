import express from 'express';
import { CreateUrlRequest, CreateUrlResponse } from './constant/apiRequestResponse';
import { Url } from './constant/types';
import { getKey } from './external/ksg/ksg';
import bodyParser from 'body-parser'
import { getMicroUrl } from './util';

const app = express();
const port = 3000;

/**Bodyparser middleware */
app.use(bodyParser.json())


app.get('/', async (req, res) => {
    res.send("Hello world from microUrlService")
})


app.post('/', async (req, res) => {
        try {
            const body: CreateUrlRequest = req.body
            const {
                originalUrl
            } = body
            if(!originalUrl) throw new Error("Missing property \"originalUrl\"")

            const key = await getKey()

            if (key) {
                throw new Error("No key found")
            }

            const url: Url = {
                originalUrl: originalUrl,
                key: key,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            }

            const response: CreateUrlResponse = {
                success: true,
                message: null,
                url: getMicroUrl(url.key)
            }

            res.json(response)

        } catch (err) {
            const message = err instanceof Error ? err.message : err
            res.status(500).send(message)
        }
    })


app.listen(port, () => {
    console.log(`Timezones by location application is running on port ${port}.`);
});