import { Node } from "../ast";
import { TOKEN_TYPE } from "../token";
import { State, nextToken } from "./nextToken";
import { parseStatement } from "./parseStatement";

interface MyProgram {
  statements: Node[];
}

export const parseProgram = (state: State) => {
  const program: MyProgram = {
    statements: [],
  };

  let { parserState, lexerState } = nextToken(nextToken(state));
  while (parserState.curToken.type !== TOKEN_TYPE.EOF) {
    const { nextState, statement } = parseStatement({ parserState, lexerState });
    if (statement) {
      program.statements.push(statement);
    }

    // TODO: 원인 파악 필요
    const _nextToken = nextState ? nextToken(nextState) : nextState;
    parserState = _nextToken.parserState;
    lexerState = _nextToken.lexerState;
  }
  return program;
};
