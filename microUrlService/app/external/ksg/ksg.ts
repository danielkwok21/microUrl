export function getKey(): Promise<string> {
    return new Promise((res, rej) => {
        return setTimeout(() => {
            return res(Math.random().toFixed(5))
        }, 0.5 * 1000)

    })
}