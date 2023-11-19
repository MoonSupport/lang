import { describe, test, expect } from "bun:test";
import { evaluate } from ".";
import { parseProgram } from "../parser/parseProgram";
import { initializeState } from "../parser/_mock_/init";
import { createContext } from "../context";
import { BoolObject, IntegerObject } from "../object";

describe("eval", () => {
  test("정수 표현식을 평가한다.", () => {
    const [code, expected] = [`let a = 5; a;`, 5];

    const state = initializeState(code);
    const ast = parseProgram(state);
    const rootContext = createContext();

    evaluate(ast.statements[0], rootContext);
    const result = evaluate(ast.statements[1], rootContext) as IntegerObject;
    expect(expected).toBe(result.value);
  });

  test("불리언 표현식을 평가한다.", () => {
    const [code, expected] = [`let a = true; a;`, true];

    const state = initializeState(code);
    const ast = parseProgram(state);
    const rootContext = createContext();

    evaluate(ast.statements[0], rootContext);
    const result = evaluate(ast.statements[1], rootContext) as BoolObject;
    expect(expected).toBe(result.value);
  });

  test("bang 표현식을 평가한다.", () => {
    const [code, expected] = [`let a = !true; a;`, false];

    const state = initializeState(code);
    const ast = parseProgram(state);
    const rootContext = createContext();

    evaluate(ast.statements[0], rootContext);
    const result = evaluate(ast.statements[1], rootContext) as BoolObject;

    expect(expected).toBe(result.value);
  });

  test("후위 표현자를 통해 더할 수 있다.", () => {
    const [code, expected] = [`let ten = 3 + 7; ten;`, 10];

    const state = initializeState(code);
    const ast = parseProgram(state);
    const rootContext = createContext();

    evaluate(ast.statements[0], rootContext);
    const result = evaluate(ast.statements[1], rootContext);
    expect(expected).toBe(result.value);
  });
});
