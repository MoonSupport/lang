import { TOKEN_TYPE } from "../token";
import { LexerState } from "./types";
import { skipWhitespace } from "./skipWhitespace";
import { TokenWithLexerMeta, classifyToken } from "./classifyToken";

export const nextToken = (메타정보: LexerState): TokenWithLexerMeta => {
  const 공백제거_메타정보 = skipWhitespace(메타정보);
  return classifyToken(공백제거_메타정보);
};
