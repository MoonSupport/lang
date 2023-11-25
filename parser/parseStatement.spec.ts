import { describe, test, expect } from "bun:test";
import { parseStatement } from "./parseStatement";
import { nextToken } from "./nextToken";
import { initializeState } from "./_mock_/init";
import { TOKEN_TYPE } from "../token";

describe("[parseStatement]", () => {
  test("숫자 리터럴을 가지는 let문을 파싱한다.", () => {
    const code = `let five = 5;`;
    const { parserState, lexerState } = initializeState(code);

    const nextState = nextToken({ parserState: parserState, lexerState });
    const _nextState = nextToken(nextState);
    const { statement } = parseStatement(_nextState);
    if (statement._type !== "LetStatement") throw new Error("Unxpected Value");

    expect(statement._type).toBe("LetStatement");
    expect(statement.name._type).toBe("Identifier");
    expect(statement.name.value).toBe("five");
    expect(statement.value._type).toBe("IntegerLiteral");
    expect(statement.value.value).toBe(5);
    expect(statement.toString()).toBe("let five = 5");
  });

  test("true 리터럴을 가지는 let문을 파싱한다.", () => {
    const code = `let isTrue = true;`;
    const { parserState, lexerState } = initializeState(code);

    const nextState = nextToken({ parserState: parserState, lexerState });
    const _nextState = nextToken(nextState);
    const { statement } = parseStatement(_nextState);
    if (statement._type !== "LetStatement") throw new Error("Unxpected Value");

    expect(statement._type).toBe("LetStatement");
    expect(statement.name._type).toBe("Identifier");
    expect(statement.name.value).toBe("isTrue");
    expect(statement.value._type).toBe("Bool");
    expect(statement.value.value).toBe(true);
    expect(statement.toString()).toBe("let isTrue = true");
  });

  test("false 리터럴을 가지는 let문을 파싱한다.", () => {
    const code = `let isTrue = false;`;
    const { parserState, lexerState } = initializeState(code);

    const nextState = nextToken({ parserState: parserState, lexerState });
    const _nextState = nextToken(nextState);
    const { statement } = parseStatement(_nextState);
    if (statement._type !== "LetStatement") throw new Error("Unxpected Value");

    expect(statement._type).toBe("LetStatement");
    expect(statement.name._type).toBe("Identifier");
    expect(statement.name.value).toBe("isTrue");
    expect(statement.value._type).toBe("Bool");
    expect(statement.value.value).toBe(false);
    expect(statement.toString()).toBe("let isTrue = false");
  });

  test("NOT prefix를 가지는 연산자를 파싱한다.", () => {
    const code = `let isTrue = !false;`;
    const { parserState, lexerState } = initializeState(code);

    const nextState = nextToken({ parserState: parserState, lexerState });
    const _nextState = nextToken(nextState);
    const { statement } = parseStatement(_nextState);
    if (statement._type !== "LetStatement") throw new Error("Unxpected Value");

    expect(statement._type).toBe("LetStatement");
    expect(statement.name._type).toBe("Identifier");
    expect(statement.name.value).toBe("isTrue");
    expect(statement.value._type).toBe("PrefixExpression");
    expect(statement.value.value).toBe("!");
    expect(statement.toString()).toBe("let isTrue = (!false)");
  });

  test("Minus prefix를 가지는 연산자를 파싱한다.", () => {
    const code = `let minusFive = -5;`;
    const { parserState, lexerState } = initializeState(code);

    const nextState = nextToken({ parserState: parserState, lexerState });
    const _nextState = nextToken(nextState);
    const { statement } = parseStatement(_nextState);
    if (statement._type !== "LetStatement") throw new Error("Unxpected Value");

    expect(statement._type).toBe("LetStatement");
    expect(statement.name._type).toBe("Identifier");
    expect(statement.name.value).toBe("minusFive");
    expect(statement.value._type).toBe("PrefixExpression");
    expect(statement.value.value).toBe("-");
    expect(statement.toString()).toBe("let minusFive = (-5)");
  });

  test("합 연산자를 파싱한다.", () => {
    const code = `let ten = 3 + 7;`;
    const { parserState, lexerState } = initializeState(code);

    const nextState = nextToken({ parserState: parserState, lexerState });
    const _nextState = nextToken(nextState);
    const { statement } = parseStatement(_nextState);
    if (statement._type !== "LetStatement") throw new Error("Unxpected Value");

    expect(statement._type).toBe("LetStatement");
    expect(statement.name._type).toBe("Identifier");
    expect(statement.name.value).toBe("ten");
    expect(statement.value._type).toBe("InfixExpression");
    expect(statement.value.value).toBe("+");
    expect(statement.toString()).toBe("let ten = (3 + 7)");
  });

  test("우선순위에 따라 연산자를 파싱한다.", () => {
    const codes = [
      ["-a * b", "((-a) * b)"],
      ["!-a", "(!(-a))"],
      [`a + b + c`, "((a + b) + c)"],
      ["a + b - c", "((a + b) - c)"],
      ["a * b * c", "((a * b) * c)"],
      ["a * b / c", "((a * b) / c)"],
      ["a + b / c", "(a + (b / c))"],
      ["a + b * c + d / e - f", "(((a + (b * c)) + (d / e)) - f)"],
      ["3 + 4;", "(3 + 4)"],
      ["5 > 4 == 3 < 4", "((5 > 4) == (3 < 4))"],
      ["5 < 4 != 3 > 4", "((5 < 4) != (3 > 4))"],
      ["3 + 4 * 5 == 3 * 1 + 4 * 5", "((3 + (4 * 5)) == ((3 * 1) + (4 * 5)))"],
      ["3 > 5 == false", "((3 > 5) == false)"],
      ["3 < 5 == true", "((3 < 5) == true)"],
      ["1 + (2 + 3) + 4", "((1 + (2 + 3)) + 4)"],
      ["(5 + 5) * 2", "((5 + 5) * 2)"],
      ["2 / (5 + 5)", "(2 / (5 + 5))"],
      ["(5 + 5) * 2 * (5 + 5)", "(((5 + 5) * 2) * (5 + 5))"],
      ["-(5 + 5)", "(-(5 + 5))"],
      ["!(true == true)", "(!(true == true))"],
    ];

    for (const [code, expected] of codes) {
      const { parserState, lexerState } = initializeState(code);

      const nextState = nextToken({ parserState: parserState, lexerState });
      const _nextState = nextToken(nextState);
      const { statement, nextState: __nextState } = parseStatement(_nextState);
      expect(statement.toString()).toBe(expected);
    }
  });

  test("expression을 파싱한다.", () => {
    const code = `five;`;
    const { parserState, lexerState } = initializeState(code);

    const nextState = nextToken({ parserState: parserState, lexerState });
    const _nextState = nextToken(nextState);
    const { statement } = parseStatement(_nextState);
    expect(statement._type).toBe("Identifier");
    expect(statement.value).toBe("five");
  });
});
