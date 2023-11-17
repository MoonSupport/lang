import { describe, test } from "bun:test";
import { parseStatement } from "./parseStatement";
import { TOKEN_TYPE, Token } from "../token";
import { LexerMeta } from "../lexer";
import { nextToken } from "./nextToken";
import { ParserState } from "./types";

describe("[parseStatement]", () => {
  test.only("let문을 파싱한다.", () => {
    const token: Token = { type: TOKEN_TYPE.LET, literal: "let" };

    const code = `let five = 5;`;
    const lexerMeta: LexerMeta = {
      입력_값: code,
      현_위치: 0,
      다음_읽을_위치: 1,
      현재_문자: code[0],
    };
    const noopToken: Token = {
      type: TOKEN_TYPE.EOF,
      literal: TOKEN_TYPE.EOF,
    };
    const parserState: ParserState = {
      curToken: noopToken,
      peekToken: noopToken,
    };

    const nextState = nextToken({ state: parserState, lexerMeta });
    const _nextState = nextToken(nextState);
    const statement = parseStatement(_nextState);
    console.log(statement.toString());
  });
});
