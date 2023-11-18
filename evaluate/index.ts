import { match } from "ts-pattern";
import { Node } from "../ast";
import { Context } from "../context";

export const evaluate = (node: Node, context: Context): any => {
  const result = match(node._type)
    .with("LetStatement", () => {})
    .with("Identifier", () => {})
    .with("IntegerLiteral", () => {})
    .exhaustive();
};
