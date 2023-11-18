import { describe, test, expect } from "bun:test";
import { evaluate } from ".";

describe("eval", () => {
  test("표현식을 평가한다.", () => {
    const testCases: [string, number][] = [["let a = 5; a;", 5]];

    testCases.forEach(([code, result]) => {
      expect(evaluate(code)).toBe(result);
    });
  });
});
