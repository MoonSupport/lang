import { LexerMeta } from "../lexer";
import { TokenTypeValue } from "../token";
import { State, nextToken } from "./nextToken";
import { ParserState } from "./types";

export const expectPeek = ({ state, lexerMeta }: State, expectedTokenTypeValue: TokenTypeValue): State => {
  if (peekTokenIs(state, expectedTokenTypeValue)) {
    return nextToken({ state, lexerMeta });
  }

  throw new Error(`Unexpected Expect Peek Token expected: ${expectedTokenTypeValue} but: ${state.peekToken.type}`);
};

const peekTokenIs = (state: ParserState, expectedTokenTypeValue: TokenTypeValue): boolean => {
  return state.peekToken.type === expectedTokenTypeValue;
};
