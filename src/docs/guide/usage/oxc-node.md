---
title: TypeScript Runner
description: Run TypeScript and JSX directly in Node.js with Oxc.
outline: deep
---

# TypeScript Runner

[`oxc-node`](https://github.com/oxc-project/oxc-node) is Oxc's TypeScript runner. It runs TypeScript and JSX without a separate build step while preserving the standard Node.js command-line workflow.

The runner provides:

- The `oxnode` command for running scripts and starting a REPL.
- A Node.js register hook for use with `node --import`.
- Synchronous and asynchronous transformation APIs.
- ESM and CommonJS support.
- Source maps for stack traces.
- `tsconfig.json` integration.

## CLI

Install [`@oxc-node/cli`](https://npmx.dev/package/@oxc-node/cli) as a development dependency:

::: code-group

```sh [npm]
$ npm add -D @oxc-node/cli
```

```sh [pnpm]
$ pnpm add -D @oxc-node/cli
```

```sh [yarn]
$ yarn add -D @oxc-node/cli
```

```sh [bun]
$ bun add -D @oxc-node/cli
```

:::

::: tip
A project-local installation keeps the runner version consistent across your team. You can instead install `@oxc-node/cli` globally if you want to invoke `oxnode` outside a project or package script.
:::

Run a TypeScript entry point:

```sh
oxnode ./src/index.ts
```

Arguments are passed through to Node.js, so Node.js features such as watch mode remain available:

```sh
oxnode --watch ./src/index.ts
```

Running `oxnode` without a script starts the Node.js REPL. Use `oxnode --node-help` to display Node.js command-line help.

For a repeatable project command, add a script to `package.json`:

```json [package.json]
{
  "scripts": {
    "dev": "oxnode ./src/index.ts"
  }
}
```

## Node.js register hook

Install [`@oxc-node/core`](https://npmx.dev/package/@oxc-node/core) when you want to keep using the `node` command directly:

::: code-group

```sh [npm]
$ npm add -D @oxc-node/core
```

```sh [pnpm]
$ pnpm add -D @oxc-node/core
```

```sh [yarn]
$ yarn add -D @oxc-node/core
```

```sh [bun]
$ bun add -D @oxc-node/core
```

:::

Register Oxc before loading the entry point:

```sh
node --import @oxc-node/core/register ./src/index.ts
```

Because this uses Node.js's register hook, it composes with other Node.js commands and flags. For example, run TypeScript tests with the built-in test runner:

```sh
node --import @oxc-node/core/register --test ./test.ts
```

## Programmatic transformation

The core package exposes a synchronous `transform` function:

```ts
import { transform } from "@oxc-node/core";

const output = transform("example.ts", "const answer: number = 42;");

console.log(output.source());
console.log(output.sourceMap());
```

Create an `OxcTransformer` when you want to reuse a working directory or transform asynchronously:

```ts
import { OxcTransformer } from "@oxc-node/core";

const transformer = new OxcTransformer(process.cwd());
const output = await transformer.transformAsync("example.ts", "const answer: number = 42;");

console.log(output.source());
```

The filename determines how the source is parsed. `source()` returns the generated JavaScript, and `sourceMap()` returns a JSON source map or `null`.

## Supported files

The register hook transforms the following extensions:

```
.js .jsx .ts .tsx .mjs .mts .cjs .cts .es6 .es
```

Module format is inferred from the file extension, the nearest `package.json`, and `tsconfig.json`. Files in `node_modules` are not transformed by default. Set `OXC_TRANSFORM_ALL=1` to transform them as well.

## TypeScript configuration

The runner reads `tsconfig.json` from the current working directory. Set `OXC_TSCONFIG_PATH` or `TS_NODE_PROJECT` to use a different file:

```sh
OXC_TSCONFIG_PATH=./config/tsconfig.dev.json oxnode ./src/index.ts
```

The transformer uses relevant compiler options for module format, JSX, decorators, class fields, and rewriting relative import extensions. TypeScript types are stripped during transformation; the runner does not type-check your program.

## Links

- [`oxc-node` repository](https://github.com/oxc-project/oxc-node)
- [`@oxc-node/cli`](https://npmx.dev/package/@oxc-node/cli)
- [`@oxc-node/core`](https://npmx.dev/package/@oxc-node/core)
