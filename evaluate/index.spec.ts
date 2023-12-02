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

  test("전위 표현자를 통해 부정 표현식을 평가한다.", () => {
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

  test("우선 순위 연산자를 통해 더할 수 있다.", () => {
    const cases: [string, number | boolean][] = [
      [`let a = 1 + 2 * 3; a;`, 7],
      [`let a = (1 + 2) * 3; a;`, 9],
      [`let a = 2 > 1 * 3; a;`, false],
      [`let a = 2 < 1 * 3; a;`, true],
      [`let a = 2 == 1 * 3; a;`, false],
      [`let a = 2 != 1 * 3; a;`, true],
    ];

    for (const [code, expected] of cases) {
      const state = initializeState(code);
      const ast = parseProgram(state);
      const rootContext = createContext();

      evaluate(ast.statements[0], rootContext);
      const result = evaluate(ast.statements[1], rootContext);
      expect(expected).toBe(result.value);
    }
  });

  test("조건에 따른 구문을 실행할 수 있다.", () => {
    const cases: [string, number | null][] = [
      ["if (true) { 10 }", 10],
      ["if (false) { 10 }", null],
      ["if (1) { 10 }", 10],
      ["if (1 < 2) { 10 }", 10],
      ["if (1 > 2) { 10 }", null],
      ["if (1 > 2) { 10 } else { 20 }", 20],
      ["if (1 < 2) { 10 } else { 20 }", 10],
    ];

    for (const [code, expected] of cases) {
      const state = initializeState(code);
      const ast = parseProgram(state);
      const rootContext = createContext();

      const result = evaluate(ast.statements[0], rootContext);
      expect(expected).toBe(result?.value || null);
    }
  });
});
