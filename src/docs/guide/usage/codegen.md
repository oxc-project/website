---
title: Code Generator
description: Print JavaScript, JSX, TypeScript, and TSX from ESTree and TS-ESTree ASTs with oxc-codegen.
outline: deep
---

# Code Generator

`oxc-codegen` is a fast, synchronous code generator for [ESTree](https://github.com/estree/estree) and [TS-ESTree](https://typescript-eslint.io/packages/typescript-estree/) ASTs.

It is a faithful port of Oxc's Rust [`oxc_codegen`](https://github.com/oxc-project/oxc/tree/main/crates/oxc_codegen) crate in pretty-printing mode. With the default options, both printers produce byte-identical output: tab indentation, double quotes, and comments omitted.

## Installation

Install [`oxc-codegen`][url-oxc-codegen-npm] alongside the parser that produces your AST. To use it with [`oxc-parser`](./parser):

```sh
pnpm add oxc-codegen oxc-parser
```

`oxc-codegen` is ESM-only and requires Node.js `^20.19.0` or `>=22.12.0`.

## Usage

```js
import { parseSync } from "oxc-parser";
import { printSync } from "oxc-codegen";

const { program } = parseSync("input.js", "const answer=6*7");
const { code } = printSync(program);

console.log(code);
// const answer = 6 * 7;
```

The printer supports JavaScript, JSX, TypeScript, and TSX ASTs. You can also print a manually constructed AST.

## API

### `printSync(node, options?)`

Prints a complete `Program` or a single statement, returning an object with the generated `code` and a `map`.

`map` is `null` unless source maps are enabled. When enabled, it is a standard Source Map v3 object.

### Options

| Option                | Type      | Default | Description                                                 |
| :-------------------- | :-------- | :------ | :---------------------------------------------------------- |
| `indent`              | `string`  | `"\t"`  | Non-empty string of spaces and/or tabs for one indent level |
| `startingIndentLevel` | `number`  | `0`     | Starting indent level, from `0` to `1000`                   |
| `jsx`                 | `boolean` | `false` | Enable TSX-safe printing for ambiguous TypeScript syntax    |
| `ts`                  | `boolean` | `false` | Select the printer that supports TypeScript nodes           |
| `sourcemap`           | `boolean` | `false` | Return a Source Map v3 object in `map`                      |
| `sourceFilename`      | `string`  | `""`    | Original source filename recorded in the source map         |
| `sourceText`          | `string`  | —       | Original source text, required when `sourcemap` is `true`   |

For a TypeScript or TSX AST, pass the matching options:

```js
const { code } = printSync(program, {
  ts: true,
  jsx: true,
});
```

### Source maps

Enable source maps with `sourcemap: true` and provide the original source text. The AST must retain valid Oxc `start` and `end` offsets for mappings to be generated.

```js
const sourceText = "const answer=6*7";
const { program } = parseSync("input.js", sourceText);
const { code, map } = printSync(program, {
  sourcemap: true,
  sourceFilename: "input.js",
  sourceText,
});
```

Manually constructed ASTs without offsets can still be printed, but their source map has an empty `mappings` string.

## Current limitations

- Comments are not printed.
- Only pretty-printing is supported; there is no compact or minified output mode.

For compact production output, use the [Minifier](./minifier).

<!-- Links -->

[url-oxc-codegen-npm]: https://npmx.dev/package/oxc-codegen
