import { TOKEN } from './token'

export const createLexer = (code: string) => {}
export const nextToken = (): {type: typeof TOKEN[keyof typeof TOKEN], literal: string} => {
    return {type: TOKEN.LET, literal:'let'}
}