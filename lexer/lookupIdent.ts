import { TOKEN, KEYWORDS } from "../token";

export const lookupIdent = (ident: string) => {
  if (KEYWORDS[ident]) {
    return KEYWORDS[ident];
  }
  return TOKEN.IDENT;
};
