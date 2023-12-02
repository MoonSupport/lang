import { match } from "ts-pattern";
import { LetStatement, Node, Identifier, Operator, createIntegerExpression, IfExpression, BlockStatement } from "../ast";
import { Context } from "../context";
import {
  createIntegerObject,
  createBoolObject,
  createPrefixObject,
  LangObject,
  createIntegerObjectByValue,
  IntegerObject,
  createBoolObjectByValue,
  BoolObject,
  createNullObject,
} from "../object";

const evalIntegerInfixExpression = (operator: Operator, left: IntegerObject, right: IntegerObject) => {
  return match(operator)
    .with("+", () => createIntegerObjectByValue(left.value + right.value))
    .with("-", () => createIntegerObjectByValue(left.value - right.value))
    .with("*", () => createIntegerObjectByValue(left.value * right.value))
    .with("/", () => createIntegerObjectByValue(left.value / right.value))
    .with("<", () => createBoolObjectByValue(left.value < right.value))
    .with(">", () => createBoolObjectByValue(left.value > right.value))
    .with("==", () => createBoolObjectByValue(left.value == right.value))
    .with("!=", () => createBoolObjectByValue(left.value != right.value))

    .otherwise(() => createIntegerObjectByValue(-1));
};

const evalInfixExpression = (operator: Operator, left: LangObject, right: LangObject) => {
  switch (true) {
    case left.type === "Integer" && right.type === "Integer":
      return evalIntegerInfixExpression(operator, left as IntegerObject, right as IntegerObject);
    default:
      throw new Error("");
  }
};

export const evaluate = (node: Node, context: Context): LangObject => {
  const result = match(node)
    .with({ _type: "LetStatement" }, (node) => evaluateLetStatement(node, context))
    .with({ _type: "Identifier" }, (node) => {
      return evaluatIdentifier(node, context);
    })
    .with({ _type: "IntegerLiteral" }, (node) => {
      return createIntegerObject(node);
    })
    .with({ _type: "Bool" }, (node) => {
      return createBoolObject(node);
    })
    .with({ _type: "PrefixExpression" }, (node) => {
      const right = evaluate(node.right, context) as LangObject;
      return createPrefixObject(node, right);
    })
    .with({ _type: "InfixExpression" }, (node) => {
      const left = evaluate(node.left, context);
      const right = evaluate(node.right, context);

      return evalInfixExpression(node.value, left, right);
    })
    .with({ _type: "IfExpression" }, (node) => {
      return evalIfExpression(node, context);
    })
    .with({ _type: "BlockStatement" }, (node) => {
      return evalBlockStatement(node, context);
    })
    .exhaustive();

  return result;
};

const isTruthy = (condition: BoolObject) => {
  if (!condition) return false;
  return condition.value;
};

const evalIfExpression = (node: IfExpression, context: Context): LangObject => {
  const condition = evaluate(node.condition, context) as BoolObject;
  if (isTruthy(condition)) {
    return evaluate(node.consequence, context);
  } else if (node?.alternative) {
    return evaluate(node.alternative, context);
  } else {
    // 실행하지 않음
    return createNullObject();
  }
};

const evalBlockStatement = (node: BlockStatement, context: Context): LangObject => {
  let result = null;
  for (const statement of node.statements) {
    result = evaluate(statement, context);
  }
  return result as LangObject;
};

const evaluateLetStatement = (node: LetStatement, context: Context): void => {
  const value = evaluate(node.value, context);
  context.memories.set(node.name.value, value as any);
};

const evaluatIdentifier = (node: Identifier, context: Context) => {
  return context.memories.get(node.value);
};
