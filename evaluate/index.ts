import { match } from "ts-pattern";
import { LetStatement, Node, Identifier } from "../ast";
import { Context } from "../context";
import { createIntegerObject, createBoolObject, createPrefixObject, LangObject } from "../object";

export const evaluate = (node: Node, context: Context) => {
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
    .exhaustive();

  return result;
};

const evaluateLetStatement = (node: LetStatement, context: Context): void => {
  const value = evaluate(node.value, context);
  context.memories.set(node.name.value, value as any);
};

const evaluatIdentifier = (node: Identifier, context: Context) => {
  return context.memories.get(node.value);
};
