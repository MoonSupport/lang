import { describe, expect, test } from "bun:test";
import { expectPeek } from "./expectPeek";
import { initializeState } from "./_mock_/init";
import { TOKEN_TYPE } from "../token";

describe("[expectPeek]", () => {
  test("다음 토큰을 확인하고 예상과 동일하다면 다음 토큰을 반환한다.", () => {
    const code = `let five = 5;`;
    const state = initializeState(code);
    expect(state.parserState).toStrictEqual({
      curToken: {
        type: TOKEN_TYPE._NOOP,
        literal: TOKEN_TYPE._NOOP,
      },
      peekToken: {
        type: TOKEN_TYPE._NOOP,
        literal: TOKEN_TYPE._NOOP,
      },
    });

    const token = expectPeek(state, TOKEN_TYPE._NOOP);

    expect(token.parserState).toStrictEqual({
      curToken: {
        type: TOKEN_TYPE._NOOP,
        literal: TOKEN_TYPE._NOOP,
      },
      peekToken: {
        type: TOKEN_TYPE.LET,
        literal: "let",
      },
    });
  });

  test("다음 토큰이 예상과 다르다면 에러를 반환한다.", () => {
    const code = `let five = 5;`;
    const state = initializeState(code);
    expect(() => expectPeek(state, TOKEN_TYPE.IF)).toThrow();
  });
});
