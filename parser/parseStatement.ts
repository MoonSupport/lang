import { match } from "ts-pattern";
import { Token, TOKEN_TYPE, TokenType, TokenTypeValue } from "../token";
import { createIdentifider, createIntegerExpression, createLetStatement, Expression, Identifier, Node } from "../ast";
import { nextToken, State } from "./nextToken";
import { LexerState } from "../lexer";
import { expectPeek, peekTokenIs } from "./expectPeek";
import { ParserState } from "./types";

export const parseStatement = ({
  parserState,
  lexerState,
}: State): {
  nextState: State;
  statement: Node;
} => {
  const result = match(parserState.curToken)
    .with({ type: TOKEN_TYPE.LET }, () => parseLetStatement(parserState, lexerState))
    .otherwise((token) => parseExpressionStatement({ parserState, lexerState }, token));

  return result;
};

const parseLetStatement = (
  parserState: ParserState,
  lexerState: LexerState
): {
  nextState: State;
  statement: Node;
} => {
  const nextState = expectPeek({ parserState, lexerState }, TOKEN_TYPE.IDENT);
  const _nextState = expectPeek({ parserState: nextState.parserState, lexerState: nextState.lexerState }, TOKEN_TYPE.ASSIGN);
  const identifier = createIdentifider({ token: nextState.parserState.curToken, value: nextState.parserState.curToken.literal });

  const __nextState = nextToken(_nextState);

  const expression = parseExpression(__nextState.parserState.curToken);

  return {
    statement: createLetStatement({ token: parserState.curToken, name: identifier, value: expression }),
    nextState: peekTokenIs(__nextState.parserState, TOKEN_TYPE.SEMICOLON) ? nextToken(__nextState) : __nextState,
  };
};

const parseExpressionStatement = (
  state: State,
  curToken: Token
): {
  nextState: State;
  statement: Node;
} => {
  const expression = parseExpression(curToken);

  return { nextState: state, statement: expression };
};

const parseExpression = (curToken: Token): Expression => {
  const prefix = prefixParseFns[curToken.type];
  if (!prefix) {
    return null as any;
  }
  return prefix(curToken);
};

const parseIdentifier = (curToken: Token): Identifier => {
  return createIdentifider({ token: curToken, value: curToken.literal });
};

const parseIntegerLiteral = (curToken: Token): Expression => {
  return createIntegerExpression({ token: curToken, value: parseInt(curToken.literal, 10) });
};

const prefixParseFns = {
  [TOKEN_TYPE.IDENT]: parseIdentifier,
  [TOKEN_TYPE.INT]: parseIntegerLiteral,
} as Record<TokenTypeValue, (curToken: Token) => any>;
