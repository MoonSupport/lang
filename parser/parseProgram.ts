// import { ParserMeta } from ".";
import { StatementNode } from "../ast";
import { TOKEN_TYPE } from "../token";
import { State, nextToken } from "./nextToken";
// import { TOKEN_TYPE } from "../token";
import { parseStatement } from "./parseStatement";

interface MyProgram {
  statements: StatementNode[];
}

export const parseProgram = (state: State) => {
  const program: MyProgram = {
    statements: [],
  };

  let { parserState, lexerState } = nextToken(nextToken(state));
  while (parserState.curToken.type !== TOKEN_TYPE.EOF) {
    const { nextState, statementNode } = parseStatement({ parserState, lexerState });
    if (statementNode) {
      program.statements.push(statementNode);
    }

    // TODO: 원인 파악 필요
    const _nextToken = nextToken(nextState);
    parserState = _nextToken.parserState;
    lexerState = _nextToken.lexerState;
  }
  return program;
};

// export interface Program {
//   statements: {
//     tokenLiteral: string;
//   };
// }
