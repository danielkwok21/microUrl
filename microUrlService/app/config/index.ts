import dotenv from 'dotenv'

dotenv.config()

const config = {
    port: process.env.PORT,
    domainName: process.env.DOMAIN_NAME,
}

export default config