
import winston from 'winston'
import config from "../config";

export function getMicroUrl(key: string): string {
    return `${config.domainName}/${key}`
}

export function getCurrentEpochInSeconds() {
    return Math.floor(Date.now() / 1000)
}

export const logger = winston.createLogger({
    transports: [
        new winston.transports.Console()
    ],
    defaultMeta: {
        time: Date()
    }
});