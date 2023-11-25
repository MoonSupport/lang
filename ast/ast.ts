import { Token } from "../token";

export type Node = LetStatement | IfStatement | Expression;
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

export type Expression = IntegerLiteral | Bool | PrefixExpression | Identifier | InfixExpression;

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

export interface IfStatement {
  _type: "IfStatement";
  condition: Expression;
  value: "if";
  consequence: BlockStatement;
  alternative: BlockStatement;
}

export interface BlockStatement {
  _type: "BlockStatement";
  token: Token;
  statements: Statement[];
}
