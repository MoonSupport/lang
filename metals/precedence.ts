const precedence = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2,
};

type Operator = "+" | "-" | "*" | "/";

const isOperator = (char: string): char is Operator => ["+", "-", "*", "/"].includes(char);

const applyPrecedence = (stack: string[], operators: Operator[], newOperator: Operator) => {
  while (operators.length > 0 && precedence[operators[operators.length - 1]] >= precedence[newOperator]) {
    const operator = operators.pop();
    const operand2 = stack.pop();
    const operand1 = stack.pop();
    stack.push(`(${operand1} ${operator} ${operand2})`);
  }
  operators.push(newOperator);
};

export function solution(input: string) {
  const stack: string[] = [];
  const operators: Operator[] = [];

  const tokens = input.split(" ");

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (isOperator(token)) {
      applyPrecedence(stack, operators, token);
    } else {
      stack.push(token);
    }
  }

  while (operators.length > 0) {
    const operator = operators.pop();
    const operand2 = stack.pop();
    const operand1 = stack.pop();
    stack.push(`(${operand1} ${operator} ${operand2})`);
  }

  return stack[0];
}

// ["a + b * c + d / e", "((a + (b * c)) + (d / e))"],

// stack = a
// operator = +
// stack a b
// operator + *
// stack a b c
// stack a, ( b * c )
// operator +
// stack (a + ( b *  c) )
// operator +

// stack (a + ( b * c )), d
// operator + /
// stack (a + ( b * c )), d, e
// stack ((a + ( b * c )) (d/ e))
// stack ((a + ( b * c )) + (d/ e))
