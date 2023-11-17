import { TOKEN, Token } from "../token";

export interface ParserMeta {
  curToken: Token;
  peekToken: Token;

  prefixParseFns: () => void;
}

export * from "./nextToken";
