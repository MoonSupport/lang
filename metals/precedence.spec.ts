import { describe, test, expect } from "bun:test";
import { solution } from "./precedence";

describe("우선 연산자 테스트", () => {
  test("우선 연산자를 테스트합니다유", () => {
    const cases = [
      ["a + b + c", "((a + b) + c)"],
      ["a + b - c", "((a + b) - c)"],
      ["a * b * c", "((a * b) * c)"],
      ["a * b / c", "((a * b) / c)"],
      ["a + b / c", "(a + (b / c))"],
      ["a + b * c + d", "((a + (b * c)) + d)"],
      ["a + b * c + d / e", "((a + (b * c)) + (d / e))"],
      ["a + b * c + d / e - f", "(((a + (b * c)) + (d / e)) - f)"],
    ];

    for (const [input, expected] of cases) {
      expect(solution(input)).toBe(expected);
    }
  });
});
