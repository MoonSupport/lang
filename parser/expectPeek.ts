import { LexerState } from "../lexer";
import { TokenTypeValue } from "../token";
import { State, nextToken } from "./nextToken";
import { ParserState } from "./types";

export const expectPeek = ({ parserState, lexerState }: State, expectedTokenTypeValue: TokenTypeValue): State => {
  if (peekTokenIs(parserState, expectedTokenTypeValue)) {
    return nextToken({ parserState, lexerState });
  }

  throw new Error(`Unexpected Expect Peek Token expected: ${expectedTokenTypeValue} but: ${state.peekToken.type}`);
};

const peekTokenIs = (state: ParserState, expectedTokenTypeValue: TokenTypeValue): boolean => {
  return state.peekToken.type === expectedTokenTypeValue;
};
