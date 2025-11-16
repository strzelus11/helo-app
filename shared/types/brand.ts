export type Brand<T, B> = T & { readonly __brand: B };
export type Id<B extends string> = Brand<string, B>;
