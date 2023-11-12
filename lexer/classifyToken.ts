import { match } from "ts-pattern";
import { LexerMeta } from "./types";
import { 종료 } from "./constant";
import { readChar } from "./readChar";
import { TOKEN } from "../token";
import { isLetter } from "./isLetter";
import { lookupIdent } from "./lookupIdent";
import { isDigit } from "./isDigit";
import { readIdentifier } from "./readIdentifier";
import { readNumber } from "./readNumber";
import { peekChar } from "./peekChar";

interface ClassifyToken {
  literal: string;
  type: (typeof TOKEN)[keyof typeof TOKEN];
  메타정보: LexerMeta;
}

export const classifyToken = (메타정보: LexerMeta): ClassifyToken => {
  const token = match(메타정보.현재_문자)
    .returnType<ClassifyToken>()
    .with(종료, (literal) => ({ literal, type: TOKEN.EOF, 메타정보: readChar(메타정보) }))
    .with(";", (literal) => ({ literal, type: TOKEN.SEMICOLON, 메타정보: readChar(메타정보) }))
    .with("(", (literal) => ({ literal, type: TOKEN.LPAREN, 메타정보: readChar(메타정보) }))
    .with(")", (literal) => ({ literal, type: TOKEN.RPAREN, 메타정보: readChar(메타정보) }))
    .with("{", (literal) => ({ literal, type: TOKEN.LBRACE, 메타정보: readChar(메타정보) }))
    .with("}", (literal) => ({ literal, type: TOKEN.RBRACE, 메타정보: readChar(메타정보) }))
    .with(",", (literal) => ({ literal, type: TOKEN.COMMA, 메타정보: readChar(메타정보) }))
    .with("+", (literal) => ({ literal, type: TOKEN.PLUS, 메타정보: readChar(메타정보) }))
    .with("-", (literal) => ({ literal, type: TOKEN.MINUS, 메타정보: readChar(메타정보) }))
    .with("*", (literal) => ({ literal, type: TOKEN.ASTERISK, 메타정보: readChar(메타정보) }))
    .with("/", (literal) => ({ literal, type: TOKEN.SLASH, 메타정보: readChar(메타정보) }))

    .with("<", (literal) => ({ literal, type: TOKEN.LT, 메타정보: readChar(메타정보) }))
    .with(">", (literal) => ({ literal, type: TOKEN.GT, 메타정보: readChar(메타정보) }))

    // .with("!", (literal) => ({ literal, type: TOKEN.SLASH, 메타정보: readChar(메타정보) }))
    // .with("!", (literal) => ({ literal, type: TOKEN.SLASH, 메타정보: readChar(메타정보) }))
    // .with("!", (literal) => ({ literal, type: TOKEN.SLASH, 메타정보: readChar(메타정보) }))
    .with("!", (literal) => {
      if (peekChar(메타정보) == "=") {
        const ch = 메타정보.현재_문자;
        const _메타정보 = readChar(메타정보);
        const literal = ch + _메타정보.현재_문자;
        return { literal, type: TOKEN.NOT_EQ, 메타정보: readChar(_메타정보) };
      }
      return { literal, type: TOKEN.BANG, 메타정보: readChar(메타정보) };
    })
    .with("=", (literal) => {
      if (peekChar(메타정보) == "=") {
        const ch = 메타정보.현재_문자;
        const _메타정보 = readChar(메타정보);
        const literal = ch + _메타정보.현재_문자;
        return { literal, type: TOKEN.EQ, 메타정보: readChar(_메타정보) };
      }
      return { literal, type: TOKEN.ASSIGN, 메타정보: readChar(메타정보) };
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
          type: TOKEN.INT,
          literal: literal,
        };
      }
      throw new Error(`Unexpected Token: ${메타정보.현재_문자}`);
    });

  return token;
};
