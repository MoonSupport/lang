type Primitives = number | boolean | string | undefined | null | symbol | bigint;

export interface Context {
  memories: Map<String, Primitives>;
  outer: Context | null;
}

export const createContext = (): Context => {
  const memoriesInScope = new Map<String, Primitives>();
  return { memories: memoriesInScope, outer: null };
};
