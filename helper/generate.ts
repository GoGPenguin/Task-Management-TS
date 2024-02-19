export const generateRandomString = (length: number): string => {
    const character: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789"

    let result: string = ''

    for (let i = 0; i < length; i++) {
        result += character.charAt(Math.floor(Math.random() * character.length));
    }

    return result
}

export const generateRandomNumber = (length: number): string => {
    const character: string = "0123456789"

    let result: string = ''

    for (let i = 0; i < length; i++) {
        result += character.charAt(Math.floor(Math.random() * character.length));
    }

    return result
}