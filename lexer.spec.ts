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

test.only("[classifyToken] 토큰을 구분한다.", () => {
  const token = classifyToken({
    입력_값: "const    a = 1",
    현_위치: 0,
    다음_읽을_위치: 1,
    현재_문자: "c",
  });

  expect(token).toStrictEqual({});
});

test("Lexer가 토큰을 처리한다.", () => {
  const code = `let five = 5;
    let ten = 10;

	let add = fn(x, y) {
		x + y;
	};

	let result = add(five, ten);
	!-/*5;
	5 < 10 > 5;

	if (5 < 10) {
		return true;
	} else {
		return false;
	}

	10 == 10;
	10 != 9;
    `;

  const lexer = createLexer(code);

  const expecteds: [(typeof TOKEN)[keyof typeof TOKEN], string][] = [
    [TOKEN.LET, "let"],
    [TOKEN.IDENT, "five"],
    [TOKEN.ASSIGN, "="],
    [TOKEN.INT, "5"],
    [TOKEN.SEMICOLON, ";"],
    [TOKEN.LET, "let"],
    [TOKEN.IDENT, "ten"],
    [TOKEN.ASSIGN, "="],
    [TOKEN.INT, "10"],
    [TOKEN.SEMICOLON, ";"],
    [TOKEN.LET, "let"],
    [TOKEN.IDENT, "add"],
    [TOKEN.ASSIGN, "="],
    [TOKEN.FUNCTION, "fn"],
    [TOKEN.LPAREN, "("],
    [TOKEN.IDENT, "x"],
    [TOKEN.COMMA, ","],
    [TOKEN.IDENT, "y"],
    [TOKEN.RPAREN, ")"],
    [TOKEN.LBRACE, "{"],
    [TOKEN.IDENT, "x"],
    [TOKEN.PLUS, "+"],
    [TOKEN.IDENT, "y"],
    [TOKEN.SEMICOLON, ";"],
    [TOKEN.RBRACE, "}"],
    [TOKEN.SEMICOLON, ";"],
    [TOKEN.LET, "let"],
    [TOKEN.IDENT, "result"],
    [TOKEN.ASSIGN, "="],
    [TOKEN.IDENT, "add"],
    [TOKEN.LPAREN, "("],
    [TOKEN.IDENT, "five"],
    [TOKEN.COMMA, ","],
    [TOKEN.IDENT, "ten"],
    [TOKEN.RPAREN, ")"],
    [TOKEN.SEMICOLON, ";"],
    [TOKEN.BANG, "!"],
    [TOKEN.MINUS, "-"],
    [TOKEN.SLASH, "/"],
    [TOKEN.ASTERISK, "*"],
    [TOKEN.INT, "5"],
    [TOKEN.SEMICOLON, ";"],
    [TOKEN.INT, "5"],
    [TOKEN.LT, "<"],
    [TOKEN.INT, "10"],
    [TOKEN.GT, ">"],
    [TOKEN.INT, "5"],
    [TOKEN.SEMICOLON, ";"],
    [TOKEN.IF, "if"],
    [TOKEN.LPAREN, "("],
    [TOKEN.INT, "5"],
    [TOKEN.LT, "<"],
    [TOKEN.INT, "10"],
    [TOKEN.RPAREN, ")"],
    [TOKEN.LBRACE, "{"],
    [TOKEN.RETURN, "return"],
    [TOKEN.TRUE, "true"],
    [TOKEN.SEMICOLON, ";"],
    [TOKEN.RBRACE, "}"],
    [TOKEN.ELSE, "else"],
    [TOKEN.LBRACE, "{"],
    [TOKEN.RETURN, "return"],
    [TOKEN.FALSE, "false"],
    [TOKEN.SEMICOLON, ";"],
    [TOKEN.RBRACE, "}"],
    [TOKEN.INT, "10"],
    [TOKEN.EQ, "=="],
    [TOKEN.INT, "10"],
    [TOKEN.SEMICOLON, ";"],
    [TOKEN.INT, "10"],
    [TOKEN.NOT_EQ, "!="],
    [TOKEN.INT, "9"],
    [TOKEN.SEMICOLON, ";"],
    [TOKEN.EOF, ""],
  ];

  for (const [expectedType, expectedLiteral] of expecteds) {
    const token = nextToken();
    expect(token.type).toBe(expectedType);
    expect(token.literal).toBe(expectedLiteral);
  }
});
