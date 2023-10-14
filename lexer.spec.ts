
import { expect, test } from "bun:test";
import { TOKEN } from './token'
import { createLexer, nextToken } from './lexer'
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
    `

    const lexer = createLexer(code)

    const expecteds: [typeof TOKEN[keyof typeof TOKEN], string][] = [
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
    ]

    for(const [expectedType, expectedLiteral] of expecteds) {
        const token = nextToken()
        expect(token.type).toBe(expectedType);
        expect(token.literal).toBe(expectedLiteral)
    }
});