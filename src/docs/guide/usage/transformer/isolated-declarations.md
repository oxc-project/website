# Isolated Declarations Emit

Oxc transformer supports emitting TypeScript declarations without using the TypeScript compiler for projects with [isolated declarations](https://www.typescriptlang.org/tsconfig/#isolatedDeclarations) enabled.

## Example

**Input**:

```ts
export function foo(a: number, b: string): number {
  return a + Number(b);
}

export enum Bar {
  a,
  b,
}
```

**Output**:

```ts
export declare function foo(a: number, b: string): number;
export declare enum Bar {
  a = 0,
  b = 1,
}
```

## Usage

```ts
import { isolatedDeclaration } from "oxc-transform";

const result = await isolatedDeclaration("lib.ts", sourceCode, {
  sourcemap: false,
  stripInternal: false,
});

console.log(result.code); // the .d.ts content
console.log(result.map); // the source map (if sourcemap is enabled)
console.log(result.errors); // parse and transformation errors
```

A synchronous `isolatedDeclarationSync` variant is also available with the same signature.
