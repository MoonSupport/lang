import { match } from "ts-pattern";
import { Token, TOKEN_TYPE, TokenType, TokenTypeValue } from "../token";
import {
  BlockStatement,
  Bool,
  createBlockStatement,
  createBoolExpression,
  createCallExpression,
  createFunctionLiteral,
  createIdentifider,
  createIfExpression,
  createInfixExpression,
  createIntegerExpression,
  createLetStatement,
  createPrefixExpression,
  createReturnStatement,
  Expression,
  Identifier,
  IfExpression,
  InfixExpression,
  IntegerLiteral,
  Node,
  Operator,
  PrefixExpression,
  Statement,
} from "../ast";
import { nextToken, State } from "./nextToken";
import { LexerState } from "../lexer";
import { expectPeek, peekTokenIs } from "./expectPeek";
import { ParserState } from "./types";
import { curTokenIs } from "./curTokenIs";

const PrecedenceLevel = [0, 1, 2, 3, 4, 5, 6] as const;
const [LOWEST, EQUALS, LESSGREATER, SUM, PRODUCT, PREFIX, CALL] = PrecedenceLevel;
const Precedences = {
  [TOKEN_TYPE.EQ]: EQUALS,
  [TOKEN_TYPE.NOT_EQ]: EQUALS,
  [TOKEN_TYPE.LT]: LESSGREATER,
  [TOKEN_TYPE.GT]: LESSGREATER,
  [TOKEN_TYPE.PLUS]: SUM,
  [TOKEN_TYPE.MINUS]: SUM,
  [TOKEN_TYPE.SLASH]: PRODUCT,
  [TOKEN_TYPE.ASTERISK]: PRODUCT,
  [TOKEN_TYPE.LPAREN]: CALL,
} as Readonly<Record<TokenTypeValue, (typeof PrecedenceLevel)[number]>>;

export const parseStatement = ({
  parserState,
  lexerState,
}: State): {
  nextState: State;
  statement: Statement;
} => {
  const result = match(parserState.curToken)
    .with({ type: TOKEN_TYPE.LET }, () => parseLetStatement(parserState, lexerState))
    .with({ type: TOKEN_TYPE.RETURN }, () => parseReturnStatement(parserState, lexerState))
    .otherwise(() => parseExpressionStatement({ parserState, lexerState }));

  return result;
};

const parseReturnStatement = (
  parserState: ParserState,
  lexerState: LexerState
): {
  nextState: State;
  statement: Node;
} => {
  const nextState = nextToken({ parserState, lexerState });
  const { expression, state: _nextState } = parseExpression(nextState, LOWEST);

  if (peekTokenIs(_nextState.parserState, TOKEN_TYPE.SEMICOLON)) {
    return {
      statement: createReturnStatement({ token: parserState.curToken, returnValue: expression }),
      nextState: nextToken(_nextState),
    };
  }

  return {
    statement: createReturnStatement({ token: parserState.curToken, returnValue: expression }),
    nextState: _nextState,
  };
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

  const { expression, state: ___nextState } = parseExpression(__nextState, LOWEST);
  return {
    statement: createLetStatement({ token: parserState.curToken, name: identifier, value: expression }),
    nextState: peekTokenIs(___nextState.parserState, TOKEN_TYPE.SEMICOLON) ? nextToken(___nextState) : ___nextState,
  };
};

const parseExpressionStatement = (
  state: State
): {
  nextState: State;
  statement: Expression;
} => {
  const { expression, state: nextState } = parseExpression(state, LOWEST);

  return { nextState: peekTokenIs(nextState.parserState, TOKEN_TYPE.SEMICOLON) ? nextToken(nextState) : nextState, statement: expression };
};

const peekPrecedence = ({ parserState }: State) => {
  if (Precedences[parserState.peekToken.type]) {
    return Precedences[parserState.peekToken.type];
  }

  return LOWEST;
};

const parseExpression = (state: State, precedence: (typeof PrecedenceLevel)[number]): { expression: Expression; state: State } => {
  const prefix = prefixParseFns[state.parserState.curToken.type];
  if (!prefix) {
    throw new Error(`Unxpected token type: ${state.parserState.curToken.type}`);
  }

  let leftExpressionWithState = prefix(state);

  while (precedence < peekPrecedence(leftExpressionWithState.state)) {
    const infix = infixParseFns[leftExpressionWithState.state.parserState.peekToken.type];
    if (!infix) return leftExpressionWithState;
    const nextState = nextToken(leftExpressionWithState.state);

    leftExpressionWithState = infix(nextState, leftExpressionWithState.expression);
  }

  return leftExpressionWithState;
};

const parseIdentifier = (state: State): { expression: Identifier; state: State } => {
  return {
    expression: createIdentifider({ token: state.parserState.curToken, value: state.parserState.curToken.literal }),
    state,
  };
};
``;
const parseIntegerLiteral = (state: State): { expression: IntegerLiteral; state: State } => {
  return {
    expression: createIntegerExpression({ token: state.parserState.curToken, value: parseInt(state.parserState.curToken.literal, 10) }),
    state,
  };
};

const parseBoolean = (state: State): { expression: Bool; state: State } => {
  return {
    expression: createBoolExpression({ token: state.parserState.curToken, value: curTokenIs(state.parserState.curToken, TOKEN_TYPE.TRUE) }),
    state,
  };
};

const parseGroupedExpression = (
  state: State
): {
  expression: Expression;
  state: State;
} => {
  const nextState = nextToken(state);
  const { expression, state: _nextState } = parseExpression(nextState, LOWEST);

  const __nextState = expectPeek(_nextState, TOKEN_TYPE.RPAREN);
  return { expression, state: __nextState };
};

const parsePrefixExpression = (state: State): { expression: PrefixExpression; state: State } => {
  const _nextState = nextToken(state);

  const right = parseExpression(_nextState, PREFIX);
  return {
    expression: createPrefixExpression({
      token: state.parserState.curToken,
      operator: state.parserState.curToken.literal as "-" | "!",
      right: right.expression,
    }),
    state: _nextState,
  };
};

const parseBlockStatement = (state: State): { statement: BlockStatement; state: State } => {
  const statements = [];
  let nextState = nextToken(state);

  while (!curTokenIs(nextState.parserState.curToken, TOKEN_TYPE.RBRACE) && !curTokenIs(nextState.parserState.curToken, TOKEN_TYPE.EOF)) {
    const { statement, nextState: _nextState } = parseStatement(nextState);
    if (statement) statements.push(statement);
    nextState = nextToken(_nextState);
  }

  return {
    statement: createBlockStatement({
      token: state.parserState.curToken,
      statements,
    }),
    state: nextState,
  };
};

const parseIfExpression = (state: State): { expression: IfExpression; state: State } => {
  const nextState = expectPeek(state, TOKEN_TYPE.LPAREN);
  const _nextState = nextToken(nextState);

  const condition = parseExpression(_nextState, LOWEST);

  const __nextState = expectPeek(condition.state, TOKEN_TYPE.RPAREN);
  const ___nextState = expectPeek(__nextState, TOKEN_TYPE.LBRACE);

  const { state: ____nextState, statement: consequence } = parseBlockStatement(___nextState);
  if (peekTokenIs(____nextState.parserState, TOKEN_TYPE.ELSE)) {
    const _____nextState = nextToken(____nextState);
    const ______nextState = expectPeek(_____nextState, TOKEN_TYPE.LBRACE);
    const { state: _______nextState, statement: alternative } = parseBlockStatement(______nextState);
    return {
      expression: createIfExpression({
        token: state.parserState.curToken,
        condition: condition.expression,
        consequence,
        alternative,
      }),
      state: _______nextState,
    };
  }

  return {
    expression: createIfExpression({
      token: state.parserState.curToken,
      condition: condition.expression,
      consequence,
    }),
    state: ____nextState,
  };
};

const parseFunctionParameters = (state: State): { parameters: Identifier[]; state: State } => {
  const parameters: Identifier[] = [];
  if (peekTokenIs(state.parserState, TOKEN_TYPE.RPAREN)) {
    const nextState = nextToken(state);
    return { parameters, state: nextState };
  }

  let nextState = nextToken(state);

  parameters.push(createIdentifider({ token: nextState.parserState.curToken, value: nextState.parserState.curToken.literal }));

  while (peekTokenIs(nextState.parserState, TOKEN_TYPE.COMMA)) {
    nextState = nextToken(nextToken(nextState));
    parameters.push(createIdentifider({ token: nextState.parserState.curToken, value: nextState.parserState.curToken.literal }));
  }

  const _nextState = expectPeek(nextState, TOKEN_TYPE.RPAREN);
  return { state: _nextState, parameters };
};

const parseFunctionLiteral = (state: State): { expression: Expression; state: State } => {
  const nextState = expectPeek(state, TOKEN_TYPE.LPAREN);
  const { parameters, state: _nextState } = parseFunctionParameters(nextState);
  const __nextState = expectPeek(_nextState, TOKEN_TYPE.LBRACE);
  const { state: ___nextState, statement: body } = parseBlockStatement(__nextState);
  return {
    expression: createFunctionLiteral({
      token: state.parserState.curToken,
      parameters,
      body,
    }),
    state: ___nextState,
  };
};

const prefixParseFns = {
  [TOKEN_TYPE.IF]: parseIfExpression,
  [TOKEN_TYPE.IDENT]: parseIdentifier,
  [TOKEN_TYPE.INT]: parseIntegerLiteral,
  [TOKEN_TYPE.TRUE]: parseBoolean,
  [TOKEN_TYPE.FALSE]: parseBoolean,
  [TOKEN_TYPE.BANG]: parsePrefixExpression,
  [TOKEN_TYPE.MINUS]: parsePrefixExpression,
  [TOKEN_TYPE.LPAREN]: parseGroupedExpression,
  [TOKEN_TYPE.FUNCTION]: parseFunctionLiteral,
  // p.registerPrefix(token.LPAREN, p.parseGroupedExpression)
} as Record<TokenTypeValue, (state: State) => { expression: Expression; state: State }>;

const curPrecedence = ({ parserState }: State) => {
  if (Precedences[parserState.curToken.type]) {
    return Precedences[parserState.curToken.type];
  }
  return LOWEST;
};

const parseInfixExpression = (
  state: State,
  left: Expression
): {
  expression: InfixExpression;
  state: State;
} => {
  const precedence = curPrecedence(state);

  // 3 + 4
  const nextState = nextToken(state);

  const right = parseExpression(nextState, precedence);

  return {
    expression: createInfixExpression({
      token: state.parserState.curToken,
      value: state.parserState.curToken.literal as Operator,
      left,
      right: right.expression,
    }),
    state: right.state,
  };
};

const parseCallArguments = (state: State): { state: State; args: Expression[] } => {
  const args: Expression[] = [];

  if (peekTokenIs(state.parserState, TOKEN_TYPE.RPAREN)) {
    return {
      state: nextToken(state),
      args,
    };
  }

  const nextState = nextToken(state);
  const { expression, state: _nextState } = parseExpression(nextState, LOWEST);
  args.push(expression);

  let loopNextState = _nextState;
  while (peekTokenIs(loopNextState.parserState, TOKEN_TYPE.COMMA)) {
    const { expression: _expression, state: _loopNextState } = parseExpression(nextToken(nextToken(loopNextState)), LOWEST);
    loopNextState = _loopNextState;
    args.push(_expression);
  }

  return { state: expectPeek(loopNextState, TOKEN_TYPE.RPAREN), args };
};

const parseCallExpression = (state: State, left: Expression): { expression: Expression; state: State } => {
  const { state: _nextState, args } = parseCallArguments(state);

  return {
    expression: createCallExpression({
      token: state.parserState.curToken,
      fn: left,
      args,
    }),
    state: _nextState,
  };
};

const infixParseFns = {
  [TOKEN_TYPE.EQ]: parseInfixExpression,
  [TOKEN_TYPE.NOT_EQ]: parseInfixExpression,
  [TOKEN_TYPE.LT]: parseInfixExpression,
  [TOKEN_TYPE.GT]: parseInfixExpression,
  [TOKEN_TYPE.PLUS]: parseInfixExpression,
  [TOKEN_TYPE.MINUS]: parseInfixExpression,
  [TOKEN_TYPE.SLASH]: parseInfixExpression,
  [TOKEN_TYPE.ASTERISK]: parseInfixExpression,
  [TOKEN_TYPE.LPAREN]: parseCallExpression,
} as Record<TokenTypeValue, (state: State, left: Expression) => { expression: Expression; state: State }>;

// 1 + 2 / 3 * 5 - 1

// (1 +
//.. ( 1 + ( 2 /
//.... ( 1 + ( 2 / 3 )
//.... ( 1 + ((2 / 3) * 5) )
