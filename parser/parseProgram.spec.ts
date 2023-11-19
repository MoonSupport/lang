import { describe, expect, test } from "bun:test";
import { initializeState } from "./_mock_/init";
import { parseProgram } from "./parseProgram";

describe("[parserProgram] 파싱한 결과가 상태의 갯수와 일치한다. ", () => {
  test("let 파싱", () => {
    const code = `let five = 5;
    let six = 6;
    let seven = 7
    `;
    const state = initializeState(code);

    const program = parseProgram(state);
    expect(program.statements).toHaveLength(3);
  });

  test("expression 파싱", () => {
    const code = `five; six; seven;`;
    const state = initializeState(code);

    const program = parseProgram(state);
    expect(program.statements).toHaveLength(3);
  });

  test("let과 expression 파싱 ", () => {
    const code = `let five = 5; five;
    let six = 6; six;
    let seven = 7 seven;
    `;
    const state = initializeState(code);

    const program = parseProgram(state);
    expect(program.statements).toHaveLength(6);
  });
});
