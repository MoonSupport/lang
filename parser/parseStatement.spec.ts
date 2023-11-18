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
    const { statementNode } = parseStatement(_nextState);
    expect(statementNode.toString()).toBe("let five = 5");
  });
});
