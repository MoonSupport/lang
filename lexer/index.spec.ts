// @ts-ignore
import { expect, test } from "bun:test";
import { TOKEN } from "../token";
import { nextToken } from ".";

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
