import { nextToken as nextTokenL } from "../lexer/nextToken";
import { ParserState } from "./types";
import { LexerMeta } from "../lexer";

export interface State {
  state: ParserState;
  lexerMeta: LexerMeta;
}

export const nextToken = ({ lexerMeta, state }: State): State => {
  const nextLexerMeta = nextTokenL(lexerMeta);
  return {
    state: {
      curToken: state.peekToken,
      peekToken: {
        type: nextLexerMeta.type,
        literal: nextLexerMeta.literal,
      },
    },
    lexerMeta: nextLexerMeta.메타정보,
  };
};
