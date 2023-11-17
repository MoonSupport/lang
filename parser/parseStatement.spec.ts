import { describe, test } from "bun:test";
import { parseStatement } from "./parseStatement";
import { TOKEN_TYPE, Token } from "../token";
import { LexerState } from "../lexer";
import { nextToken } from "./nextToken";
import { ParserState } from "./types";
import { initializeState } from "./_mock_/init";

describe("[parseStatement]", () => {
  test("let문을 파싱한다.", () => {
    const code = `let five = 5;`;
    const { parserState, lexerState } = initializeState(code);

    const nextState = nextToken({ parserState: parserState, lexerState });
    const _nextState = nextToken(nextState);
    const statement = parseStatement(_nextState);
    console.log(statement.toString());
  });
});
