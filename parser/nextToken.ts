import { nextToken as nextTokenL } from "../lexer/nextToken";
import { ParserState } from "./types";
import { LexerState } from "../lexer";

export interface State {
  parserState: ParserState;
  lexerState: LexerState;
}

export const nextToken = ({ lexerState, parserState }: State): State => {
  const nextLexerMeta = nextTokenL(lexerState);
  return {
    parserState: {
      curToken: parserState.peekToken,
      peekToken: {
        type: nextLexerMeta.type,
        literal: nextLexerMeta.literal,
      },
    },
    lexerState: nextLexerMeta.메타정보,
  };
};
