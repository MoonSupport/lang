import { match } from "ts-pattern";
import { TOKEN } from "../token";

export const parseStatement = (curToken: (typeof TOKEN)[keyof typeof TOKEN]) => {
  const result = match(curToken)
    .with(TOKEN.LET, () => parseLetStatement())
    .with(TOKEN.RETURN, () => parseReturnStatement())
    .otherwise((_curToken) => parseExpressionStatement(_curToken));
};

const parseLetStatement = () => {};
const parseReturnStatement = () => {};
const parseExpressionStatement = (curToken: (typeof TOKEN)[keyof typeof TOKEN]) => {
  const statement = { Token: curToken };
  const expression = parseExpression(curToken);

  return { statement, expression };
};

const parseExpression = (curToken: (typeof TOKEN)[keyof typeof TOKEN]) => {
  const prefix = prefixParseFns[curToken];
  return prefix();
};

const parseIdentifier = (curToken: (typeof TOKEN)[keyof typeof TOKEN]) => {
  return { token: curToken, value: curToken.Literal };
};

const prefixParseFns = {
  [TOKEN.IDENT]: parseIdentifier,
} as Record<(typeof TOKEN)[keyof typeof TOKEN], () => any>;
