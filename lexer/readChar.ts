import { LexerState } from "./types";
import { 종료 } from "./constant";
export const readChar = (메타정보: LexerState): LexerState => {
  const { 다음_읽을_위치, 입력_값 } = 메타정보;
  if (다음_읽을_위치 >= 입력_값.length) {
    return {
      ...메타정보,
      현_위치: 다음_읽을_위치,
      다음_읽을_위치: 다음_읽을_위치 + 1,
      현재_문자: 종료,
    };
  }

  return {
    ...메타정보,
    현_위치: 다음_읽을_위치,
    다음_읽을_위치: 다음_읽을_위치 + 1,
    현재_문자: 입력_값[다음_읽을_위치],
  };
};
