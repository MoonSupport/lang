import { describe, test, expect } from "bun:test";
import { parseStatement } from "./parseStatement";
import { nextToken } from "./nextToken";
import { initializeState } from "./_mock_/init";

describe("[parseStatement]", () => {
  test("let문을 파싱한다.", () => {
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
