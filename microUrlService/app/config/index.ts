import dotenv from 'dotenv'

dotenv.config()

const config = {
    port: process.env.PORT,
    domainName: process.env.DOMAIN_NAME,
    ksgApi: process.env.KSG_API,
    database: {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        name: process.env.DATABASE_NAME,
    }
}

export default config