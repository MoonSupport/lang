import { readChar } from "../lexer";
import { LexerState } from "./types";

export const skipWhitespace = (메타정보: LexerState): LexerState => {
  let _메타정보 = 메타정보;
  while ([" ", "\t", "\n", "\r"].includes(_메타정보.현재_문자)) {
    _메타정보 = readChar(_메타정보);
  }
  return _메타정보;
};
