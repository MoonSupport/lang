import { describe, test, expect } from "bun:test";
import * as parser from "./index";
import { LexerState } from "../lexer";
import { TOKEN, TOKEN_TYPE } from "../token";
import { ParserState } from "./types";
import { initializeState } from "./_mock_/init";

describe("[nextToken]", () => {
  test("처음 nextToken을 실행 시에 parser의 peekToken부터 채워 진다.", () => {
    const code = `let five = 5;`;
    const state = initializeState(code);

    const nextState = parser.nextToken(state);

    expect(nextState.parserState).toStrictEqual({
      curToken: {
        literal: "EOF",
        type: TOKEN_TYPE.EOF,
      },
      peekToken: {
        literal: "let",
        type: TOKEN_TYPE.LET,
      },
    });
  });

  test("parser의 curToken, peekToken 상태를 채우기 위해서 nextToken을 두번 실행하여 초기 셋팅을 한다.", () => {
    const code = `let five = 5;`;
    const state = initializeState(code);

    const nextState = parser.nextToken(state);
    const _nextToken = parser.nextToken(nextState);

    expect(_nextToken.parserState).toStrictEqual({
      curToken: {
        literal: "let",
        type: TOKEN_TYPE.LET,
      },
      peekToken: {
        literal: "five",
        type: TOKEN_TYPE.IDENT,
      },
    });

    expect(_nextToken.lexerState).toStrictEqual({
      다음_읽을_위치: 9,
      입력_값: "let five = 5;",
      현_위치: 8,
      현재_문자: " ",
    });
  });
});
