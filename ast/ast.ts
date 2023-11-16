import { Token } from "../token";

interface Node {
  tokenLiteral: () => string;
  toString: () => string;
}

export interface Statement extends Node {}

interface LetStatement extends Statement {
  token: Token;
  name: Identifier;
  value: Expression;
}

const createLetStatement = (token: Token, name: Identifier, value: Expression): LetStatement => ({
  token,
  name,
  value,
  tokenLiteral: () => token.literal,
  toString: () => `${token.literal} ${name.value} = ${value.toString()}`,
});

interface Identifier {
  token: Token;
  value: string;
}

interface Expression extends Node {}

// export interface ExpressionStatement extends Statement {
//   token: Token;
//   expression: Expression;
// }

// export const constructExpressionStatement = (props: { token: Token }): ExpressionStatement => {
//   return {
//     token: props.token,
//     expression: {
//       tokenLiteral: () => "",
//       toString: () => "",
//       expressionNode: () => {},
//     },
//     tokenLiteral: () => "",
//     toString: () => "",
//     statementNode: () => {},
//   };
// };
