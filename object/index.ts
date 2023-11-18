import { IntegerLiteral, Node } from "../ast";

type ObjectType = "Integer";

interface Object {
  type: ObjectType;
  inspect: () => string;
}

export const createIntegerObject = (node: IntegerLiteral): Object => ({
  type: "Integer",
  inspect: () => String(node.value),
});
