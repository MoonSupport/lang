// @ts-ignore
import { expect, test } from "bun:test";
import { LexerMeta, skipWhitespace } from ".";

test("[skipWhitespace] 다음 문자열이 공백이라면 읽지 않는다.", () => {
  const meta: LexerMeta = {
    입력_값: "const    a = 1",
    현_위치: 5,
    다음_읽을_위치: 6,
    현재_문자: " ",
  };

  const result = skipWhitespace(meta);

  expect(result).toStrictEqual({
    입력_값: "const    a = 1",
    현_위치: 9,
    다음_읽을_위치: 10,
    현재_문자: "a",
  });
});
