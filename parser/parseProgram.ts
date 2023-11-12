import { ParserMeta } from ".";
import { TOKEN } from "../token";

export const parseProgram = (parser: ParserMeta): Program => {
  const program = {
    statements: [],
  };
  while (parser.curToken !== TOKEN.EOF) {
    const statement = parseStatement();
    if (statement) {
      program.statements.push(statement);
    }

    nextToken();
  }
  return program;
};

export interface Program {
  statements: {
    tokenLiteral: string;
  };
}
