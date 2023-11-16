import { match } from "ts-pattern";
import { Token, TOKEN_TYPE, TokenType, TokenTypeValue } from "../token";
import { constructExpressionStatement, ExpressionStatement } from "../ast";

export const parseStatement = (curToken: Token) => {
  const result = match(curToken)
    .with({ type: TOKEN_TYPE.LET }, (token) => parseLetStatement(token))
    .with({ type: TOKEN_TYPE.RETURN }, () => parseReturnStatement())
    .otherwise((token) => parseExpressionStatement(token));

  return result;
};

const parseLetStatement = (curToken: Token) => {};
const parseReturnStatement = () => {};
const parseExpressionStatement = (curToken: Token): ExpressionStatement => {
  const expression = parseExpression(curToken);

  return constructExpressionStatement({ token: curToken });
};

const parseExpression = (curToken: Token) => {
  const prefix = prefixParseFns[curToken.type];
  return prefix();
};

const parseIdentifier = (curToken: Token) => {
  return { token: curToken, value: curToken.literal };
};

const prefixParseFns = {
  [TOKEN_TYPE.IDENT]: parseIdentifier,
} as Record<TokenTypeValue, () => any>;
