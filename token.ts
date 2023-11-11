export const TOKEN = {
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

export const KEYWORDS: Record<string, (typeof TOKEN)[keyof typeof TOKEN]> = {
  fn: TOKEN.FUNCTION,
  let: TOKEN.LET,
  const: TOKEN.CONST,
  true: TOKEN.TRUE,
  false: TOKEN.FALSE,
  if: TOKEN.IF,
  else: TOKEN.ELSE,
  return: TOKEN.RETURN,
};

export type TOKEN_STRUCT = {
  type: string;
  literal: typeof TOKEN;
};
