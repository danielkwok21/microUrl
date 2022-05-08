import config from "../../config";
import fetch from 'node-fetch'

export function getPostfixKey(createUrlRequest: GetPostfixRequest): Promise<GetPostfixResponse> {
    return fetch(`${config.ksgApi}/key`)
        .then(res => res.json())
        .then(res => {
            console.log(res)
            return res as GetPostfixResponse
        })
}

export type GetPostfixRequest = {

}

export type GetPostfixResponse = {
    success: boolean,
    message: string | null,
    postfix: string
}