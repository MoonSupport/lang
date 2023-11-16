import { expect, test } from "bun:test";
import { parseProgram } from "./parseProgram";

test("LetStatement를 파싱한다.", () => {
  const tests = [
    ["let x = 5;", "x", 5],
    ["let y = true;", "y", true],
    ["let foobar = y;", "foobar", "y"],
  ];

  const program = parseProgram(tests[0]);

  expect(program.statements).toHaveLength(1);
  expect(program.statements[0].tokenLiteral).toBe("let");
  expect(program.statements[0].name.value).toBe("x");
  expect(program.statements[0].name.tokenLiteral).toBe("x");
  expect(program.statements[0].value.value).toBe(5);
  expect(program.statements[0].value.tokenLiteral).toBe(5);
});
