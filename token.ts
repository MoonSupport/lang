export const TOKEN_TYPE = {
  ILLEGAL: "ILLEGAL",
  EOF: "EOF",

  IDENT: "IDENT",
  INT: "INT",

  ASSIGN: "=",
  PLUS: "+",
  MINUS: "-",
  BANG: "!",
  ASTERISK: "*",
  SLASH: "/",

  LT: "<",
  GT: ">",

  EQ: "==",
  NOT_EQ: "!=",

  COMMA: ",",
  SEMICOLON: ";",

  LPAREN: "(",
  RPAREN: ")",
  LBRACE: "{",
  RBRACE: "}",

  FUNCTION: "FUNCTION",
  LET: "LET",
  TRUE: "TRUE",
  FALSE: "FALSE",
  IF: "IF",
  ELSE: "ELSE",
  RETURN: "RETURN",
  CONST: "const",
} as const;

export type TokenType = typeof TOKEN_TYPE;
export type TokenTypeKey = keyof TokenType;
export type TokenTypeValue = TokenType[TokenTypeKey];

export const KEYWORDS: Record<string, TokenTypeValue> = {
  fn: TOKEN_TYPE.FUNCTION,
  let: TOKEN_TYPE.LET,
  const: TOKEN_TYPE.CONST,
  true: TOKEN_TYPE.TRUE,
  false: TOKEN_TYPE.FALSE,
  if: TOKEN_TYPE.IF,
  else: TOKEN_TYPE.ELSE,
  return: TOKEN_TYPE.RETURN,
};

export type TOKEN = {
  type: TokenTypeValue;
  literal: string;
};

export type Token = {
  type: TokenTypeValue;
  literal: string;
};
