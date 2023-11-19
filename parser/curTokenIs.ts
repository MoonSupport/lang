import { Token, TokenTypeValue } from "../token";

export const curTokenIs = (curToken: Token, type: TokenTypeValue) => {
  return curToken.type === type;
};
