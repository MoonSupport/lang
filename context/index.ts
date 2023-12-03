// type Primitives = number | boolean | string | undefined | null | symbol | bigint;

type ContextType = "Global" | "Fn";

export interface Context {
  type: ContextType;
  memories: Map<String, Object>;
  outer: Context | null;
}

export const createContext = (type: ContextType = "Global"): Context => {
  const memoriesInScope = new Map<String, Object>();
  return { memories: memoriesInScope, outer: null, type };
};

export const createSubContext = (outer: Context, type: ContextType = "Fn") => {
  const context = createContext();
  context.outer = outer;
  return context;
};
