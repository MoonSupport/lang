// @ts-ignore
import { expect, test } from "bun:test";
import { TOKEN_TYPE } from "../token";
import { nextToken, 종료 } from ".";

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

  const expecteds: [(typeof TOKEN_TYPE)[keyof typeof TOKEN_TYPE], string][] = [
    [TOKEN_TYPE.LET, "let"],
    [TOKEN_TYPE.IDENT, "five"],
    [TOKEN_TYPE.ASSIGN, "="],
    [TOKEN_TYPE.INT, "5"],
    [TOKEN_TYPE.SEMICOLON, ";"],
    [TOKEN_TYPE.LET, "let"],
    [TOKEN_TYPE.IDENT, "ten"],
    [TOKEN_TYPE.ASSIGN, "="],
    [TOKEN_TYPE.INT, "10"],
    [TOKEN_TYPE.SEMICOLON, ";"],
    [TOKEN_TYPE.LET, "let"],
    [TOKEN_TYPE.IDENT, "add"],
    [TOKEN_TYPE.ASSIGN, "="],
    [TOKEN_TYPE.FUNCTION, "fn"],
    [TOKEN_TYPE.LPAREN, "("],
    [TOKEN_TYPE.IDENT, "x"],
    [TOKEN_TYPE.COMMA, ","],
    [TOKEN_TYPE.IDENT, "y"],
    [TOKEN_TYPE.RPAREN, ")"],
    [TOKEN_TYPE.LBRACE, "{"],
    [TOKEN_TYPE.IDENT, "x"],
    [TOKEN_TYPE.PLUS, "+"],
    [TOKEN_TYPE.IDENT, "y"],
    [TOKEN_TYPE.SEMICOLON, ";"],
    [TOKEN_TYPE.RBRACE, "}"],
    [TOKEN_TYPE.SEMICOLON, ";"],
    [TOKEN_TYPE.LET, "let"],
    [TOKEN_TYPE.IDENT, "result"],
    [TOKEN_TYPE.ASSIGN, "="],
    [TOKEN_TYPE.IDENT, "add"],
    [TOKEN_TYPE.LPAREN, "("],
    [TOKEN_TYPE.IDENT, "five"],
    [TOKEN_TYPE.COMMA, ","],
    [TOKEN_TYPE.IDENT, "ten"],
    [TOKEN_TYPE.RPAREN, ")"],
    [TOKEN_TYPE.SEMICOLON, ";"],
    [TOKEN_TYPE.BANG, "!"],
    [TOKEN_TYPE.MINUS, "-"],
    [TOKEN_TYPE.SLASH, "/"],
    [TOKEN_TYPE.ASTERISK, "*"],
    [TOKEN_TYPE.INT, "5"],
    [TOKEN_TYPE.SEMICOLON, ";"],
    [TOKEN_TYPE.INT, "5"],
    [TOKEN_TYPE.LT, "<"],
    [TOKEN_TYPE.INT, "10"],
    [TOKEN_TYPE.GT, ">"],
    [TOKEN_TYPE.INT, "5"],
    [TOKEN_TYPE.SEMICOLON, ";"],
    [TOKEN_TYPE.IF, "if"],
    [TOKEN_TYPE.LPAREN, "("],
    [TOKEN_TYPE.INT, "5"],
    [TOKEN_TYPE.LT, "<"],
    [TOKEN_TYPE.INT, "10"],
    [TOKEN_TYPE.RPAREN, ")"],
    [TOKEN_TYPE.LBRACE, "{"],
    [TOKEN_TYPE.RETURN, "return"],
    [TOKEN_TYPE.TRUE, "true"],
    [TOKEN_TYPE.SEMICOLON, ";"],
    [TOKEN_TYPE.RBRACE, "}"],
    [TOKEN_TYPE.ELSE, "else"],
    [TOKEN_TYPE.LBRACE, "{"],
    [TOKEN_TYPE.RETURN, "return"],
    [TOKEN_TYPE.FALSE, "false"],
    [TOKEN_TYPE.SEMICOLON, ";"],
    [TOKEN_TYPE.RBRACE, "}"],
    [TOKEN_TYPE.INT, "10"],
    [TOKEN_TYPE.EQ, "=="],
    [TOKEN_TYPE.INT, "10"],
    [TOKEN_TYPE.SEMICOLON, ";"],
    [TOKEN_TYPE.INT, "10"],
    [TOKEN_TYPE.NOT_EQ, "!="],
    [TOKEN_TYPE.INT, "9"],
    [TOKEN_TYPE.SEMICOLON, ";"],
    [TOKEN_TYPE.EOF, 종료],
  ];

  let meta = {
    입력_값: code,
    현_위치: 0,
    다음_읽을_위치: 1,
    현재_문자: code[0],
  };

  for (const [expectedType, expectedLiteral] of expecteds) {
    const { type, literal, 메타정보 } = nextToken(meta);
    meta = 메타정보;
    expect(type).toBe(expectedType);
    expect(literal).toBe(expectedLiteral);
  }
});
