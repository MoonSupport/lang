import { match } from "ts-pattern";
import { Token, TOKEN_TYPE, TokenType, TokenTypeValue } from "../token";
import { createIdentifider, createIntegerExpression, createLetStatement, ExpressionNode, StatementNode } from "../ast";
import { nextToken, State } from "./nextToken";
import { LexerState } from "../lexer";
import { expectPeek } from "./expectPeek";
import { ParserState } from "./types";

export const parseStatement = ({ parserState, lexerState }: State): StatementNode | ExpressionNode => {
  const result = match(parserState.curToken)
    .with({ type: TOKEN_TYPE.LET }, () => parseLetStatement(parserState, lexerState))
    .otherwise((token) => parseExpressionStatement(token));

  return result;
};

const parseLetStatement = (parserState: ParserState, lexerState: LexerState): StatementNode => {
  const nextState = expectPeek({ parserState, lexerState }, TOKEN_TYPE.IDENT);
  const _nextState = expectPeek({ parserState: nextState.parserState, lexerState: nextState.lexerState }, TOKEN_TYPE.ASSIGN);
  const identifier = createIdentifider({ token: nextState.parserState.curToken, value: nextState.parserState.curToken.literal });

  const __nextState = nextToken(_nextState);

  const expression = parseExpression(__nextState.parserState.curToken);

  return createLetStatement({ token: parserState.curToken, name: identifier, value: expression });
};

const parseExpressionStatement = (curToken: Token): ExpressionNode => {
  const expression = parseExpression(curToken);

  return expression;
};

const parseExpression = (curToken: Token): ExpressionNode => {
  const prefix = prefixParseFns[curToken.type];
  if (!prefix) {
    return null as any;
  }
  return prefix(curToken);
};

const parseIdentifier = (curToken: Token): ExpressionNode => {
  return createIdentifider({ token: curToken, value: curToken.literal });
};

const parseIntegerLiteral = (curToken: Token): ExpressionNode => {
  return createIntegerExpression({ token: curToken, value: parseInt(curToken.literal, 10) });
};

const prefixParseFns = {
  [TOKEN_TYPE.IDENT]: parseIdentifier,
  [TOKEN_TYPE.INT]: parseIntegerLiteral,
} as Record<TokenTypeValue, () => any>;
