import { Token } from "../token";

type NodeType = "LetStatement" | "IntegerLiteral" | "Identifier";

export interface Node {
  _type: NodeType;
  tokenLiteral: () => string;
  toString: () => string;
}

export interface StatementNode extends Node {}

interface LetStatementRequirement {
  token: Token;
  name: Identifier;
  value: Expression;
}

interface IdentifierRequirement {
  token: Token;
  value: string;
}

interface Identifier extends Node {}

export const createIdentifider = ({ token, value }: IdentifierRequirement): Node => ({
  _type: "Identifier",
  tokenLiteral: () => token.literal,
  toString: () => value,
});

export const createLetStatement = ({ token, name, value }: LetStatementRequirement): StatementNode => ({
  _type: "LetStatement",
  tokenLiteral: () => token.literal,
  toString: () => `${token.literal} ${name.toString()} = ${value.toString()}`,
});

interface IntegerLiteralRequirement {
  token: Token;
  value: number;
}

export interface Expression extends Node {}

export interface IntegerLiteral extends Node {
  value: number;
}

export const createIntegerExpression = ({ token, value }: IntegerLiteralRequirement): IntegerLiteral => ({
  _type: "IntegerLiteral",
  value,
  tokenLiteral: () => token.literal,
  toString: () => token.literal,
});
