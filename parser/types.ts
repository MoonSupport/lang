import { Token } from "../token";

export interface ParserState {
  curToken: Token;
  peekToken: Token;
}
