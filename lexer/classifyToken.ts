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

interface ClassifyToken {
  literal: string;
  type: (typeof TOKEN)[keyof typeof TOKEN];
  메타정보: LexerMeta;
}

export const classifyToken = (메타정보: LexerMeta): ClassifyToken => {
  const token = match(메타정보.현재_문자)
    .returnType<ClassifyToken>()
    .with(종료, () => {
      const _메타정보 = readChar(메타정보);
      return { literal: "", type: TOKEN.EOF, 메타정보: _메타정보 };
    })
    .with(";", () => {
      const _메타정보 = readChar(메타정보);
      return { literal: ";", type: TOKEN.SEMICOLON, 메타정보: _메타정보 };
    })
    .with("=", () => {
      const _메타정보 = readChar(메타정보);
      return { literal: "=", type: TOKEN.ASSIGN, 메타정보: _메타정보 };
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
