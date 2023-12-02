import { match } from "ts-pattern";
import { LetStatement, Node, Identifier, Operator, createIntegerExpression } from "../ast";
import { Context } from "../context";
import {
  createIntegerObject,
  createBoolObject,
  createPrefixObject,
  LangObject,
  createIntegerObjectByValue,
  IntegerObject,
  createBoolObjectByValue,
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
    .with({ _type: "IfExpression" }, () => {
      return evalIfExpression();
    })
    .with({ _type: "BlockStatement" }, () => {
      return evalBlockStatement();
    })
    .exhaustive();

  return result;
};

const evalIfExpression = (): LangObject => {
  return null as unknown as LangObject;
};

const evalBlockStatement = (): LangObject => {
  return null as unknown as LangObject;
};

const evaluateLetStatement = (node: LetStatement, context: Context): void => {
  const value = evaluate(node.value, context);
  context.memories.set(node.name.value, value as any);
};

const evaluatIdentifier = (node: Identifier, context: Context) => {
  return context.memories.get(node.value);
};
