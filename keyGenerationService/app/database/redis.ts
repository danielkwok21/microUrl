import { createClient } from 'redis'
import config from '../config'

const redisClient = createClient({
    url: `redis://${config.redis.instanceUrl}`
})

redisClient.connect().then(() => {

    redisClient.auth({
        password: config.redis.password
    })

})

export enum REDIS_KEYS {
    availableKeys = 'availableKeys'
}

export default redisClient