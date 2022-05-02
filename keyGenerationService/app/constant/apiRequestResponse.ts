export type CreateUrlRequest = {
    originalUrl: string
}

export type CreateUrlResponse = {
    success: boolean,
    message: string | null,
    url: string
}