import { TOKEN } from "../token";
import { LexerMeta } from "./types";
import { skipWhitespace } from "./skipWhitespace";
import { classifyToken } from "./classifyToken";

export const nextToken = (
  메타정보: LexerMeta
): {
  token: {
    type: (typeof TOKEN)[keyof typeof TOKEN];
    literal: string;
  };
  meta: LexerMeta;
} => {
  const 공백제거_메타정보 = skipWhitespace(메타정보);

  const { 메타정보: 새_메타정보, ...token } = classifyToken(공백제거_메타정보);
  return {
    token: token,
    meta: 새_메타정보,
  };
};
