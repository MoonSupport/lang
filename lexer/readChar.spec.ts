// @ts-ignore
import { expect, test } from "bun:test";
import { LexerState } from "./types";
import { readChar, 종료 } from ".";

test("[readChar] 문자열을 읽는다.", () => {
  const meta: LexerState = {
    입력_값: "const a = 1",
    현_위치: 0,
    다음_읽을_위치: 1,
    현재_문자: "c",
  };
  const result = readChar(meta);

  expect(result).toStrictEqual({
    입력_값: "const a = 1",
    현_위치: 1,
    다음_읽을_위치: 2,
    현재_문자: "o",
  });
});

test("[readChar] 더 읽을 문자열이 없다면 종료한다.", () => {
  const meta: LexerState = {
    입력_값: "const a = 1",
    현_위치: 10,
    다음_읽을_위치: 11,
    현재_문자: "1",
  };
  const result = readChar(meta);

  expect(result).toStrictEqual({
    입력_값: "const a = 1",
    현_위치: 11,
    다음_읽을_위치: 12,
    현재_문자: 종료,
  });
});
