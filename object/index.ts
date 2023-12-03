import { match } from "ts-pattern";
import { BlockStatement, Bool, Expression, FunctionLiteral, Identifier, IntegerLiteral, Node, PrefixExpression, createBoolExpression } from "../ast";
import { Context } from "../context";

type ObjectType = "Integer" | "Bool" | "Null" | "Fn";

export type LangObject = IntegerObject | BoolObject | NullObject | FnObject;

export interface FnObject {
  type: ObjectType;
  inspect: () => string;
  value: "noop";
  parameters: Identifier[];
  body: BlockStatement;
  context: Context;
}

export const createFnObject = (node: FunctionLiteral, parameters: Identifier[], body: BlockStatement, context: Context): FnObject => ({
  type: "Fn",
  inspect: () => node.toString(),
  parameters,
  value: "noop",
  body,
  context,
});

export interface NullObject {
  type: ObjectType;
  inspect: () => string;
  value: null;
}

export interface IntegerObject {
  type: ObjectType;
  inspect: () => string;
  value: number;
}

export const createIntegerObject = (node: IntegerLiteral): IntegerObject => ({
  type: "Integer",
  value: node.value,
  inspect: () => String(node.value),
});

export const createIntegerObjectByValue = (value: number): IntegerObject => ({
  type: "Integer",
  value: value,
  inspect: () => String(value),
});

export interface BoolObject {
  type: ObjectType;
  inspect: () => string;
  value: boolean;
}

export const createBoolObject = (node: Bool): BoolObject => ({
  type: "Bool",
  inspect: () => String(node.value),
  value: node.value,
});

export const createBoolObjectByValue = (value: boolean): BoolObject => ({
  type: "Bool",
  inspect: () => String(value),
  value: value,
});

export const createNullObject = (): NullObject => ({
  type: "Null",
  inspect: () => `null`,
  value: null,
});

export const createPrefixObject = (node: PrefixExpression, right: LangObject): LangObject => {
  const result = match(node)
    .with({ value: "!" }, () => {
      return match(right.value as any)
        .with(true, () => createBoolObjectByValue(false))
        .with(false, () => createBoolObjectByValue(false))
        .with(null, () => createBoolObjectByValue(false))
        .otherwise(() => createBoolObjectByValue(false));
    })
    .with({ value: "-" }, () => {})
    .exhaustive();

  return result;
};
