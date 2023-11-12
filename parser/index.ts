import { TOKEN } from "../token";

export interface ParserMeta {
  curToken: (typeof TOKEN)[keyof typeof TOKEN];
  peekToken: (typeof TOKEN)[keyof typeof TOKEN];

  prefixParseFns: () => void;
}
