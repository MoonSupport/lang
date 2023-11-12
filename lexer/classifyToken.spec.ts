// @ts-ignore
import { expect, test } from "bun:test";
import { TOKEN_TYPE } from "../token";
import { classifyToken } from ".";

test("[classifyToken] 토큰을 구분한다.", () => {
  const { 메타정보, ...token } = classifyToken({
    입력_값: "const    a = 1",
    현_위치: 0,
    다음_읽을_위치: 1,
    현재_문자: "c",
  });

  expect(token).toStrictEqual({
    literal: "const",
    type: TOKEN_TYPE.CONST,
  });
});
