import { Token } from "../token";

export type Node = LetStatement | BlockStatement | ReturnStatement | Expression;
export type Statement = Node;

export interface LetStatement {
  _type: "LetStatement";
  name: Identifier;
  value: Expression;
  tokenLiteral: () => string;
  toString: () => string;
}

interface IdentifierRequirement {
  token: Token;
  value: string;
}

export interface Identifier {
  _type: "Identifier";
  value: string;
  tokenLiteral: () => string;
  toString: () => string;
}

export const createIdentifider = ({ token, value }: IdentifierRequirement): Identifier => ({
  _type: "Identifier",
  value,
  tokenLiteral: () => token.literal,
  toString: () => value,
});

interface LetStatementRequirement {
  token: Token;
  name: Identifier;
  value: Expression;
}

export const createLetStatement = ({ token, name, value }: LetStatementRequirement): LetStatement => ({
  _type: "LetStatement",
  name,
  value,
  tokenLiteral: () => token.literal,
  toString: () => `${token.literal} ${name.toString()} = ${value.toString()}`,
});

interface IntegerLiteralRequirement {
  token: Token;
  value: number;
}

export type Expression = IntegerLiteral | Bool | PrefixExpression | Identifier | InfixExpression | IfExpression | FunctionLiteral | CallExpression;

export interface IntegerLiteral {
  _type: "IntegerLiteral";
  value: number;
  tokenLiteral: () => string;
  toString: () => string;
}

export const createIntegerExpression = ({ token, value }: IntegerLiteralRequirement): IntegerLiteral => ({
  _type: "IntegerLiteral",
  value,
  tokenLiteral: () => token.literal,
  toString: () => token.literal,
});

interface BoolRequirement {
  token: Token;
  value: boolean;
}

export interface Bool {
  _type: "Bool";
  value: boolean;
  tokenLiteral: () => string;
  toString: () => string;
}

export const createBoolExpression = ({ token, value }: BoolRequirement): Bool => ({
  _type: "Bool",
  value,
  tokenLiteral: () => token.literal,
  toString: () => token.literal,
});

interface PrefixExpressionRequirement {
  token: Token;
  operator: "-" | "!";
  right: Expression;
}

export interface PrefixExpression {
  _type: "PrefixExpression";
  right: Expression;
  value: "-" | "!";
  tokenLiteral: () => string;
  toString: () => string;
}

export const createPrefixExpression = ({ token, operator, right }: PrefixExpressionRequirement): PrefixExpression => ({
  _type: "PrefixExpression",
  right,
  value: operator,
  tokenLiteral: () => token.literal,
  toString: () => `(${operator}${right.toString()})`,
});

export type Operator = "+" | "-" | "*" | "/" | ">" | "<" | "==" | "!=";

interface InfixExpressionRequirement {
  token: Token;
  left: Expression;
  value: Operator;
  right: Expression;
}

export interface InfixExpression {
  _type: "InfixExpression";
  left: Expression;
  value: Operator;
  right: Expression;
  tokenLiteral: () => string;
  toString: () => string;
}

export const createInfixExpression = ({ token, value, left, right }: InfixExpressionRequirement): InfixExpression => ({
  _type: "InfixExpression",
  left,
  value,
  right,
  tokenLiteral: () => token.literal,
  toString: () => `(${left.toString()} ${value} ${right.toString()})`,
});

export interface IfExpression {
  _type: "IfExpression";
  token: Token;
  condition: Expression;
  value: "noop";
  consequence: BlockStatement;
  alternative?: BlockStatement;
  tokenLiteral: () => string;
  toString: () => string;
}

interface IfExpressionRequirement {
  token: Token;
  condition: Expression;
  consequence: BlockStatement;
  alternative?: BlockStatement;
}

export const createIfExpression = ({ token, condition, consequence, alternative }: IfExpressionRequirement): IfExpression => ({
  _type: "IfExpression",
  token,
  value: "noop",
  condition,
  consequence,
  alternative,
  tokenLiteral: () => token.literal,
  toString: () => `if${condition.toString()} ${consequence.toString()} ${alternative ? `else ${alternative.toString()}` : ""}`,
});

export interface BlockStatement {
  _type: "BlockStatement";
  value: "noop";
  token: Token;
  statements: Statement[];
  tokenLiteral: () => string;
  toString: () => string;
}

interface BlockStatementRequirement {
  token: Token;
  statements: Statement[];
}

export const createBlockStatement = ({ token, statements }: BlockStatementRequirement): BlockStatement => ({
  _type: "BlockStatement",
  value: "noop",
  token,
  statements,
  tokenLiteral: () => token.literal,
  toString: () => `{ ${statements.map((stmt) => stmt.toString()).join("\n")} }`,
});

export interface FunctionLiteral {
  _type: "FunctionLiteral";
  token: Token;
  parameters: Identifier[];
  body: BlockStatement;
  value: "noop";
  tokenLiteral: () => string;
  toString: () => string;
}

interface FunctionLiteralRequirement {
  token: Token;
  parameters: Identifier[];
  body: BlockStatement;
}

export const createFunctionLiteral = ({ token, parameters, body }: FunctionLiteralRequirement): FunctionLiteral => ({
  _type: "FunctionLiteral",
  token,
  parameters,
  body,
  value: "noop",
  tokenLiteral: () => token.literal,
  toString: () => `${token.literal}(${parameters.map((p) => p.toString()).join(",")})${body.toString()}`,
});

export interface CallExpression {
  _type: "CallExpression";
  token: Token;
  value: "noop";
  fn: Expression;
  args: Expression[];
  tokenLiteral: () => string;
  toString: () => string;
}

interface CallExpressionRequirement {
  token: Token;
  fn: Expression;
  args: Expression[];
}

export const createCallExpression = ({ token, fn, args }: CallExpressionRequirement): CallExpression => ({
  _type: "CallExpression",
  token,
  value: "noop",
  fn,
  args,
  tokenLiteral: () => token.literal,
  toString: () => `${fn.toString()}(${args.map((arg) => arg.toString()).join(",")})`,
});

export interface ReturnStatement {
  _type: "ReturnStatement";
  token: Token;
  returnValue: Expression;
  value: "noop";
  tokenLiteral: () => string;
  toString: () => string;
}

interface ReturnStatementRequirement {
  token: Token;
  returnValue: Expression;
}

export const createReturnStatement = ({ token, returnValue }: ReturnStatementRequirement): ReturnStatement => ({
  _type: "ReturnStatement",
  token,
  returnValue,
  value: "noop",
  tokenLiteral: () => token.literal,
  toString: () => `${token.literal} ${returnValue.toString()};`,
});
