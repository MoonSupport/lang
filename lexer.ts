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
  const token = match(메타정보.현재_문자)
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
    });

  return token;
};

const readIdentifier = (메타정보: LexerMeta) => {
  let _메타정보 = 메타정보;
  while (isLetter(_메타정보.현재_문자)) {
    _메타정보 = readChar(_메타정보);
  }
  return {
    메타정보: _메타정보,
    literal: _메타정보.입력_값.substring(메타정보.현_위치, _메타정보.현_위치),
  };
};

const readNumber = (메타정보: LexerMeta) => {
  let _메타정보 = 메타정보;
  while (isDigit(_메타정보.현재_문자)) {
    _메타정보 = readChar(_메타정보);
  }
  return {
    메타정보: _메타정보,
    literal: _메타정보.입력_값.substring(메타정보.현_위치, _메타정보.현_위치),
  };
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

const isDigit = (ch: string): boolean => {
  return "0" <= ch && ch <= "9";
};
