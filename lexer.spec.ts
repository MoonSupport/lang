import { expect, test } from "bun:test";
import { TOKEN } from "./token";
import {
  LexerMeta,
  classifyToken,
  createLexer,
  nextToken,
  readChar,
  skipWhitespace,
  종료,
} from "./lexer";

test("[readChar] 문자열을 읽는다.", () => {
  const meta: LexerMeta = {
    입력_값: "const a = 1",
    현_위치: 0,
    다음_읽을_위치: 1,
    현재_문자: "c",
  };
  const result = readChar(meta);

  expect(result).toStrictEqual({
    입력_값: "const a = 1",
    현_위치: 1,
    다음_읽을_위치: 2,
    현재_문자: "o",
  });
});

test("[readChar] 더 읽을 문자열이 없다면 종료한다.", () => {
  const meta: LexerMeta = {
    입력_값: "const a = 1",
    현_위치: 10,
    다음_읽을_위치: 11,
    현재_문자: "1",
  };
  const result = readChar(meta);

  expect(result).toStrictEqual({
    입력_값: "const a = 1",
    현_위치: 11,
    다음_읽을_위치: 12,
    현재_문자: 종료,
  });
});

test("[skipWhitespace] 다음 문자열이 공백이라면 읽지 않는다.", () => {
  const meta: LexerMeta = {
    입력_값: "const    a = 1",
    현_위치: 5,
    다음_읽을_위치: 6,
    현재_문자: " ",
  };

  const result = skipWhitespace(meta);

  expect(result).toStrictEqual({
    입력_값: "const    a = 1",
    현_위치: 9,
    다음_읽을_위치: 10,
    현재_문자: "a",
  });
});

test("[classifyToken] 토큰을 구분한다.", () => {
  const { 메타정보, ...token } = classifyToken({
    입력_값: "const    a = 1",
    현_위치: 0,
    다음_읽을_위치: 1,
    현재_문자: "c",
  });

  expect(token).toStrictEqual({
    literal: "const",
    type: TOKEN.CONST,
  });
});

test("Lexer가 토큰을 처리한다.", () => {
  const code = `let five = 5;`;

  const expecteds: [(typeof TOKEN)[keyof typeof TOKEN], string][] = [
    [TOKEN.LET, "let"],
    [TOKEN.IDENT, "five"],
    [TOKEN.ASSIGN, "="],
    [TOKEN.INT, "5"],
    [TOKEN.SEMICOLON, ";"],
    [TOKEN.EOF, ""],
  ];

  let meta = {
    입력_값: code,
    현_위치: 0,
    다음_읽을_위치: 1,
    현재_문자: code[0],
  };
  for (const [expectedType, expectedLiteral] of expecteds) {
    const { token, meta: _meta } = nextToken(meta);
    meta = _meta;
    expect(token.type).toBe(expectedType);
    expect(token.literal).toBe(expectedLiteral);
  }
});
