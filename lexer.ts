import { match } from "ts-pattern";
import { TOKEN, TOKEN_STRUCT, keywords } from "./token";

export type LexerMeta = {
  입력_값: string;
  현_위치: number;
  다음_읽을_위치: number;
  현재_문자: string;
};

export const 종료 = "😇";

export const createLexer = (code: string) => {};
export const nextToken = (): {
  type: (typeof TOKEN)[keyof typeof TOKEN];
  literal: string;
} => {
  return { type: TOKEN.LET, literal: "let" };
};

export const readChar = (메타정보: LexerMeta): LexerMeta => {
  const { 다음_읽을_위치, 입력_값 } = 메타정보;
  if (다음_읽을_위치 >= 입력_값.length) {
    return {
      ...메타정보,
      현_위치: 다음_읽을_위치,
      다음_읽을_위치: 다음_읽을_위치 + 1,
      현재_문자: 종료,
    };
  }

  return {
    ...메타정보,
    현_위치: 다음_읽을_위치,
    다음_읽을_위치: 다음_읽을_위치 + 1,
    현재_문자: 입력_값[다음_읽을_위치],
  };
};

export const skipWhitespace = (메타정보: LexerMeta) => {
  let _메타정보 = 메타정보;
  while ([" ", "\t", "\n", "\r"].includes(_메타정보.현재_문자)) {
    _메타정보 = readChar(_메타정보);
  }
  return _메타정보;
};

export const classifyToken = (메타정보: LexerMeta) => {
  const token = match(메타정보.입력_값)
    .with(종료, () => {
      return { literla: "", type: TOKEN.EOF };
    })
    .with(";", () => {
      return { literal: ";", type: TOKEN.SEMICOLON };
    })
    .otherwise(() => {
      if (isLetter(메타정보.현재_문자)) {
        const literal = readIdentifier(메타정보);
        const type = lookupIdent(literal);
        return { literal, type };
      }
      return {
        type: TOKEN.IDENT,
        literal: 메타정보.입력_값,
      };
    });

  return token;
};

const readIdentifier = (메타정보: LexerMeta) => {
  let _메타정보 = 메타정보;
  while (isLetter(_메타정보.현재_문자)) {
    _메타정보 = readChar(_메타정보);
  }
  return _메타정보.입력_값.substring(메타정보.현_위치, _메타정보.현_위치);
};

const lookupIdent = (ident: string) => {
  if (keywords[ident]) {
    return keywords[ident];
  }
  return TOKEN.IDENT;
};

const isLetter = (ch: string): boolean => {
  return ("a" <= ch && ch <= "z") || ("A" <= ch && ch <= "Z") || ch == "_";
};
