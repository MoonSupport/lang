import { describe, test, expect } from "bun:test";
import { createIntegerObject } from ".";
import { createIntegerExpression } from "../ast";
import { TOKEN_TYPE } from "../token";

describe("[object] 생성", () => {
  test("Integer Object를 생성할 수 있다.", () => {
    const expression = createIntegerExpression({
      token: {
        type: TOKEN_TYPE.INT,
        literal: "4",
      },
      value: 4,
    });

    const integerObject = createIntegerObject(expression);

    expect(integerObject.inspect()).toBe("4");
    expect(integerObject.type).toBe("Integer");
  });
});
