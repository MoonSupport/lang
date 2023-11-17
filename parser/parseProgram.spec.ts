import { describe, expect, test } from "bun:test";
import { initializeState } from "./_mock_/init";
import { parseProgram } from "./parseProgram";

describe.only("[parserProgram]", () => {
  test("let 파싱", () => {
    const code = `let five = 5;
    let six = 6;
    let seven = 7
    `;
    const state = initializeState(code);

    const program = parseProgram(state);
    expect(program.statements).toHaveLength(3);
  });
});
