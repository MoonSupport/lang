import { TOKEN_TYPE, KEYWORDS } from "../token";

export const lookupIdent = (ident: string) => {
  if (KEYWORDS[ident]) {
    return KEYWORDS[ident];
  }
  return TOKEN_TYPE.IDENT;
};
