---
title: Code Generator
description: Print JavaScript, JSX, TypeScript, and TSX from ESTree-compatible ASTs with oxc-codegen.
outline: deep
---

# Code Generator

`oxc-codegen` is a fast JavaScript code generator from an [ESTree](https://github.com/estree/estree)-compatible AST.

It is a faithful port of Oxc's Rust [`oxc_codegen`](https://github.com/oxc-project/oxc/tree/main/crates/oxc_codegen) crate in pretty-printing mode. With the default options, both printers produce byte-identical output: tab indentation, double quotes, and comments omitted.

## Installation

Install [`oxc-codegen`][url-oxc-codegen-npm] alongside the ESTree-compatible parser that produces your AST. To use it with [`oxc-parser`](./parser):

```sh
pnpm add oxc-codegen oxc-parser
```

## Usage

```js
import { parseSync } from "oxc-parser";
import { printSync } from "oxc-codegen";

const { program } = parseSync("foo.js", "let x = 1");
console.log(printSync(program));
```

The printer supports JavaScript, JSX, TypeScript, and TSX ASTs.

## API

### `printSync(node, options?)`

Returns the printed source code as a string. `node` must be a complete AST (`Program`) or a statement node.

### Options

| Option                | Type                 | Default | Description                                       |
| :-------------------- | :------------------- | :------ | :------------------------------------------------ |
| `indent`              | `string`             | `"\t"`  | Indentation; accepts spaces and tabs only         |
| `startingIndentLevel` | `number`             | `0`     | Indentation level at which to start               |
| `jsx`                 | `boolean`            | `false` | TSX mode; lone type parameters print as `<T,>`    |
| `ts`                  | `boolean`            | `false` | Whether the AST may contain TypeScript syntax     |
| `sourceMap`           | `SourceMapGenerator` | —       | Emits source mappings into the supplied generator |

For a TypeScript or TSX AST, pass the matching options:

```js
const code = printSync(program, {
  ts: true,
  jsx: true,
});
```

## Current limitations

- Comments are not printed.
- Only pretty-printing is supported; there is no compact or minified output mode.

For compact production output, use the [Minifier](./minifier).

<!-- Links -->

[url-oxc-codegen-npm]: https://npmx.dev/package/oxc-codegen
