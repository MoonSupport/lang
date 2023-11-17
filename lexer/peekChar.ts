import { 종료 } from "./constant";
import { LexerState } from "./types";

export const peekChar = (메타정보: LexerState): string => {
  if (메타정보.현_위치 >= 메타정보.입력_값.length) return 종료;
  else return 메타정보.입력_값[메타정보.다음_읽을_위치];
};
