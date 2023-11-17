import { Token } from "../token";

// 상태란 무엇인가
// 표현식과 또 다른 상태, 식별자로 구성되어 있음
// 표현식이란 무엇인가
//   연산 가능한 값. 문자열, 숫자, 그 외 여러 연산자
// 식별자란 상태도 표현식도 아닌 것인가
// 값을 담아두는 ( 표현식을 담아둔다고도 볼 수 있나? ) 메모리를 참조하는 이름

interface Node {
  tokenLiteral: () => string;
  toString: () => string;
}

export interface StatementNode extends Node {}

interface LetStatement {
  token: Token;
  name: IdentifierNode;
  value: ExpressionNode;
}

interface Identifier {
  token: Token;
  value: string;
}

interface IdentifierNode extends Node {}

export const createIdentifider = ({ token, value }: Identifier): Node => ({
  tokenLiteral: () => token.literal,
  toString: () => value,
});

export const createLetStatement = ({ token, name, value }: LetStatement): StatementNode => ({
  tokenLiteral: () => token.literal,
  toString: () => `${token.literal} ${name.toString()} = ${value.toString()}`,
});

interface IntegerExpression {
  token: Token;
  value: number;
}
export interface ExpressionNode extends Node {}

export const createIntegerExpression = ({ token, value }: IntegerExpression): ExpressionNode => ({
  tokenLiteral: () => token.literal,
  toString: () => token.literal,
});
