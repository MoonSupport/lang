export const isLetter = (ch: string): boolean => {
  return ("a" <= ch && ch <= "z") || ("A" <= ch && ch <= "Z") || ch == "_";
};
