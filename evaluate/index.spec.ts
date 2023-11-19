import { describe, test, expect } from "bun:test";
import { evaluate } from ".";
import { parseProgram } from "../parser/parseProgram";
import { initializeState } from "../parser/_mock_/init";
import { createContext } from "../context";
import { IntegerObject } from "../object";

describe.only("eval", () => {
  test("표현식을 평가한다.", () => {
    const [code, expected] = [`let a = 5; a;`, 5];

    const state = initializeState(code);
    const ast = parseProgram(state);
    const rootContext = createContext();

    evaluate(ast.statements[0], rootContext);
    const result = evaluate(ast.statements[1], rootContext) as IntegerObject;
    expect(expected).toBe(result.value);
  });
});
