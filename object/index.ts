import { IntegerLiteral, Node } from "../ast";

type ObjectType = "Integer";

type Object = IntegerObject;

export interface IntegerObject {
  type: ObjectType;
  inspect: () => string;
  value: number;
}

export const createIntegerObject = (node: IntegerLiteral): Object => ({
  type: "Integer",
  value: node.value,
  inspect: () => String(node.value),
});
