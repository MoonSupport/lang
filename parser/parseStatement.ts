import { match } from "ts-pattern";
import { Token, TOKEN_TYPE, TokenType, TokenTypeValue } from "../token";
import {
  Bool,
  createBoolExpression,
  createIdentifider,
  createIntegerExpression,
  createLetStatement,
  createPrefixExpression,
  Expression,
  Identifier,
  IntegerLiteral,
  Node,
  PrefixExpression,
} from "../ast";
import { nextToken, State } from "./nextToken";
import { LexerState } from "../lexer";
import { expectPeek, peekTokenIs } from "./expectPeek";
import { ParserState } from "./types";
import { curTokenIs } from "./curTokenIs";

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

  const { expression, state: ___nextState } = parseExpression(__nextState.parserState.curToken, __nextState);
  return {
    statement: createLetStatement({ token: parserState.curToken, name: identifier, value: expression }),
    nextState: peekTokenIs(___nextState.parserState, TOKEN_TYPE.SEMICOLON) ? nextToken(___nextState) : ___nextState,
  };
};

const parseExpressionStatement = (
  state: State,
  curToken: Token
): {
  nextState: State;
  statement: Expression;
} => {
  const { expression, state: nextState } = parseExpression(curToken, state);
  // if p.peekTokenIs(token.SEMICOLON) {
  // 	p.nextToken()
  // }

  return { nextState: peekTokenIs(nextState.parserState, TOKEN_TYPE.SEMICOLON) ? nextToken(nextState) : nextState, statement: expression };
};

const parseExpression = (curToken: Token, state: State): { expression: Expression; state: State } => {
  const prefix = prefixParseFns[curToken.type];
  if (!prefix) {
    throw new Error(`Unxpected token type: ${curToken.type}`);
  }
  return prefix(curToken, state);
};

const parseIdentifier = (curToken: Token, state: State): { expression: Identifier; state: State } => {
  return {
    expression: createIdentifider({ token: curToken, value: curToken.literal }),
    state,
  };
};

const parseIntegerLiteral = (curToken: Token, state: State): { expression: IntegerLiteral; state: State } => {
  return {
    expression: createIntegerExpression({ token: curToken, value: parseInt(curToken.literal, 10) }),
    state,
  };
};

const parseBoolean = (curToken: Token, state: State): { expression: Bool; state: State } => {
  return {
    expression: createBoolExpression({ token: curToken, value: curTokenIs(curToken, TOKEN_TYPE.TRUE) }),
    state,
  };
};

const parsePrefixExpression = (curToken: Token, state: State): { expression: PrefixExpression; state: State } => {
  const _nextState = nextToken(state);
  const right = parseExpression(_nextState.parserState.curToken, _nextState);
  return {
    expression: createPrefixExpression({ token: curToken, operator: curToken.literal, right: right.expression }),
    state: _nextState,
  };
};

const prefixParseFns = {
  [TOKEN_TYPE.IDENT]: parseIdentifier,
  [TOKEN_TYPE.INT]: parseIntegerLiteral,
  [TOKEN_TYPE.TRUE]: parseBoolean,
  [TOKEN_TYPE.FALSE]: parseBoolean,
  [TOKEN_TYPE.BANG]: parsePrefixExpression,
  [TOKEN_TYPE.MINUS]: parsePrefixExpression,
} as Record<TokenTypeValue, (curToken: Token, state: State) => { expression: Expression; state: State }>;
