type Primitives = number | boolean | string | undefined | null | symbol | bigint;

export interface Context {
  memories: Map<String, Primitives>;
  outer: Context;
}
