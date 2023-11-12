import { match } from "ts-pattern";
import { LexerMeta } from "./types";
import { 종료 } from "./constant";
import { readChar } from "./readChar";
import { TOKEN_TYPE, TOKEN } from "../token";
import { isLetter } from "./isLetter";
import { lookupIdent } from "./lookupIdent";
import { isDigit } from "./isDigit";
import { readIdentifier } from "./readIdentifier";
import { readNumber } from "./readNumber";
import { peekChar } from "./peekChar";

export interface TokenWithLexerMeta extends TOKEN {
  메타정보: LexerMeta;
}

export const classifyToken = (메타정보: LexerMeta): TokenWithLexerMeta => {
  const token = match(메타정보.현재_문자)
    .returnType<TokenWithLexerMeta>()
    .with(종료, (literal) => ({ literal, type: TOKEN_TYPE.EOF, 메타정보: readChar(메타정보) }))
    .with(";", (literal) => ({ literal, type: TOKEN_TYPE.SEMICOLON, 메타정보: readChar(메타정보) }))
    .with("(", (literal) => ({ literal, type: TOKEN_TYPE.LPAREN, 메타정보: readChar(메타정보) }))
    .with(")", (literal) => ({ literal, type: TOKEN_TYPE.RPAREN, 메타정보: readChar(메타정보) }))
    .with("{", (literal) => ({ literal, type: TOKEN_TYPE.LBRACE, 메타정보: readChar(메타정보) }))
    .with("}", (literal) => ({ literal, type: TOKEN_TYPE.RBRACE, 메타정보: readChar(메타정보) }))
    .with(",", (literal) => ({ literal, type: TOKEN_TYPE.COMMA, 메타정보: readChar(메타정보) }))
    .with("+", (literal) => ({ literal, type: TOKEN_TYPE.PLUS, 메타정보: readChar(메타정보) }))
    .with("-", (literal) => ({ literal, type: TOKEN_TYPE.MINUS, 메타정보: readChar(메타정보) }))
    .with("*", (literal) => ({ literal, type: TOKEN_TYPE.ASTERISK, 메타정보: readChar(메타정보) }))
    .with("/", (literal) => ({ literal, type: TOKEN_TYPE.SLASH, 메타정보: readChar(메타정보) }))
    .with("<", (literal) => ({ literal, type: TOKEN_TYPE.LT, 메타정보: readChar(메타정보) }))
    .with(">", (literal) => ({ literal, type: TOKEN_TYPE.GT, 메타정보: readChar(메타정보) }))
    .with("!", (literal) => {
      if (peekChar(메타정보) == "=") {
        const ch = 메타정보.현재_문자;
        const _메타정보 = readChar(메타정보);
        const literal = ch + _메타정보.현재_문자;
        return { literal, type: TOKEN_TYPE.NOT_EQ, 메타정보: readChar(_메타정보) };
      }
      return { literal, type: TOKEN_TYPE.BANG, 메타정보: readChar(메타정보) };
    })
    .with("=", (literal) => {
      if (peekChar(메타정보) == "=") {
        const ch = 메타정보.현재_문자;
        const _메타정보 = readChar(메타정보);
        const literal = ch + _메타정보.현재_문자;
        return { literal, type: TOKEN_TYPE.EQ, 메타정보: readChar(_메타정보) };
      }
      return { literal, type: TOKEN_TYPE.ASSIGN, 메타정보: readChar(메타정보) };
    })

    .otherwise(() => {
      if (isLetter(메타정보.현재_문자)) {
        const { literal, 메타정보: _메타정보 } = readIdentifier(메타정보);
        const type = lookupIdent(literal);
        return { literal, type, 메타정보: _메타정보 };
      } else if (isDigit(메타정보.현재_문자)) {
        const { literal, 메타정보: _메타정보 } = readNumber(메타정보);
        return {
          메타정보: _메타정보,
          type: TOKEN_TYPE.INT,
          literal: literal,
        };
      }
      throw new Error(`Unexpected Token: ${메타정보.현재_문자}`);
    });

  return token;
};
