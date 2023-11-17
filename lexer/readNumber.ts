import { readChar } from "../lexer";
import { isDigit } from "./isDigit";
import { LexerState } from "./types";

export const readNumber = (메타정보: LexerState) => {
  let _메타정보 = 메타정보;
  while (isDigit(_메타정보.현재_문자)) {
    _메타정보 = readChar(_메타정보);
  }
  return {
    메타정보: _메타정보,
    literal: _메타정보.입력_값.substring(메타정보.현_위치, _메타정보.현_위치),
  };
};
