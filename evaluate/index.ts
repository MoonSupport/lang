import { match } from "ts-pattern";
import {
  LetStatement,
  Node,
  Identifier,
  Operator,
  createIntegerExpression,
  IfExpression,
  BlockStatement,
  FunctionLiteral,
  CallExpression,
  Expression,
  ReturnStatement,
} from "../ast";
import { Context, createSubContext } from "../context";
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
  createFnObject,
  FnObject,
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

export const evaluate = (node: Node, context: Context): LangObject | void => {
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
      const left = evaluate(node.left, context) as LangObject;
      const right = evaluate(node.right, context) as LangObject;

      return evalInfixExpression(node.value, left, right);
    })
    .with({ _type: "IfExpression" }, (node) => {
      return evalIfExpression(node, context);
    })
    .with({ _type: "BlockStatement" }, (node) => {
      return evalBlockStatement(node, context);
    })
    .with({ _type: "FunctionLiteral" }, (node) => evalFunctionLiteral(node, context))
    .with({ _type: "CallExpression" }, (node) => evalCallExpression(node, context))
    .with({ _type: "ReturnStatement" }, (node) => evalReturnStatement(node, context))
    .exhaustive();

  return result;
};

const evalReturnStatement = (node: ReturnStatement, context: Context) => {
  return evaluate(node.returnValue, context);
};

const evalCallExpression = (node: CallExpression, context: Context) => {
  const fn = evaluate(node.fn, context) as FnObject;
  const args = evalExpressions(node.args, context);

  return apply(fn, args);
};

const apply = (fn: FnObject, args: Object[]) => {
  const fnContext = createFnContext(fn, args);
  const evaledBody = evaluate(fn.body, fnContext);
  return evaledBody;
};

const createFnContext = (fn: FnObject, args: Object[]) => {
  const fnContext = createSubContext(fn.context);
  for (const idx in fn.parameters) {
    fnContext.memories.set(fn.parameters[idx].value, args[idx]);
  }
  return fnContext;
};

const evalExpressions = (expressions: Expression[], context: Context) => {
  const objects: Object[] = [];
  for (const expression of expressions) {
    const evaluated = evaluate(expression, context) as LangObject;
    objects.push(evaluated);
  }

  return objects;
};

const evalFunctionLiteral = (node: FunctionLiteral, context: Context) => createFnObject(node, node.parameters, node.body, context);

const isTruthy = (condition: BoolObject) => {
  if (!condition) return false;
  return condition.value;
};

const evalIfExpression = (node: IfExpression, context: Context): LangObject => {
  const condition = evaluate(node.condition, context) as BoolObject;
  if (isTruthy(condition)) {
    return evaluate(node.consequence, context) as LangObject;
  } else if (node?.alternative) {
    return evaluate(node.alternative, context) as LangObject;
  } else {
    // 실행하지 않음
    return createNullObject();
  }
};

const evalBlockStatement = (node: BlockStatement, context: Context): LangObject => {
  let result = null;
  for (const statement of node.statements) {
    result = evaluate(statement, context) as LangObject;
    if (context.type === "Fn") {
      if (statement._type === "ReturnStatement") {
        return result;
      } else {
        return createNullObject();
      }
    }
  }

  return result as LangObject;
};

const evaluateLetStatement = (node: LetStatement, context: Context): void => {
  const value = evaluate(node.value, context);
  context.memories.set(node.name.value, value as any);
};

const evaluatIdentifier = (node: Identifier, context: Context) => {
  if (!context.memories.has(node.value)) throw new Error(`Reference Error: ${node.value}`);
  return context.memories.get(node.value) as LangObject;
};
