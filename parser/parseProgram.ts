import { ParserMeta } from ".";
import { Statement } from "../ast";
import { TOKEN_TYPE } from "../token";
import { parseStatement } from "./parseStatement";

interface MyProgram {
  statements: Statement[];
}

export const parseProgram = (parser: ParserMeta): Program => {
  const program: MyProgram = {
    statements: [],
  };
  while (parser.curToken.type !== TOKEN_TYPE.EOF) {
    const statement = parseStatement(parser.curToken);
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
