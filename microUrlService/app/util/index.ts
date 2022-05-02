import config from "../config";

export function getMicroUrl(key: string): string {
    return `${config.domainName}/${key}`
}