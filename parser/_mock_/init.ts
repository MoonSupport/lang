import { LexerState } from "../../lexer";
import * as parser from "..";
import { TOKEN, TOKEN_TYPE } from "../../token";
import { ParserState } from "../types";
export const initializeState = (code: string): parser.State => {
  const lexerState: LexerState = {
    입력_값: code,
    현_위치: 0,
    다음_읽을_위치: 1,
    현재_문자: code[0],
  };

  const noopToken: TOKEN = {
    type: TOKEN_TYPE.EOF,
    literal: TOKEN_TYPE.EOF,
  };
  const parserState: ParserState = {
    curToken: noopToken,
    peekToken: noopToken,
  };
  return { lexerState, parserState };
};
