export type Url = {
    originalUrl: string,
    key: string,
    createdAt: number,
    updatedAt: number,
}

export type AvailableKey = {
    postfixKey: string,
    createdAt: number,
}

export type UnavailableKey = {
    postfixKey: string,
    createdAt: number,
}