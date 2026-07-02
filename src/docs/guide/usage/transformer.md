# Transformer

A high-performance transformer that rewrites unsupported syntax into forms supported by target runtimes.

## Features

The features below run in a fixed order, regardless of the order of the options:

1. **[React Compiler](./transformer/react-compiler)** — runs first, on the original source.
2. **[TypeScript](./transformer/typescript)** — type stripping.
3. **[Decorators](./transformer/typescript#decorators)**.
4. **[Plugins](./transformer/plugins)** — e.g. styled-components.
5. **[React Refresh](./transformer/jsx#react-refresh)** — component instrumentation, runs just before the JSX transform.
6. **[JSX](./transformer/jsx)** — JSX to JavaScript.
7. **[Lowering](./transformer/lowering)** — ES2026 down to ES2015.
8. **[Inject](./transformer/global-variable-replacement#inject)** — global variable injection.
9. **[Define](./transformer/global-variable-replacement#define)** — global variable replacement.

Oxc also supports [TypeScript Isolated Declarations emit](./transformer/isolated-declarations) without using the TypeScript compiler.

## General Options

The `transform` function accepts a filename, source code, and an options object:

```js
import { transform } from "oxc-transform";

const result = await transform("lib.ts", sourceCode, {
  // Force the source language. Inferred from filename by default.
  lang: "tsx", // "js" | "jsx" | "ts" | "tsx" | "dts"

  // Treat the source as script, module, or CommonJS. Inferred by default.
  sourceType: "module", // "script" | "module" | "commonjs" | "unambiguous"

  // The current working directory. Used to resolve relative paths.
  cwd: "/path/to/project",

  // Enable source map generation.
  sourcemap: true,

  // Configure runtime helper strategy.
  helpers: {
    mode: "Runtime", // "Runtime" (import from @oxc-project/runtime) or "External" (use global babelHelpers)
  },

  // See sub-pages for more options:
  // typescript, jsx, target, assumptions, define, inject, decorator, plugins
});
```

The `transform` function is async. A synchronous `transformSync` variant is also available with the same signature.

## Installation

### Node.js

- Use the node binding [oxc-transform][url-oxc-transform-npm].
- Try on [stackblitz](https://stackblitz.com/fork/github/oxc-project/oxc/tree/main/stackblitz-templates/oxc-transform).

### Rust

Use the umbrella crate [oxc][url-oxc-crate] with the `transformer` feature.

Rust usage example can be found [here](https://github.com/oxc-project/oxc/blob/main/crates/oxc_transformer/examples/transformer.rs).

## Integrations

- [`unplugin-oxc`](https://npmx.dev/package/unplugin-oxc)
- [`unplugin-isolated-decl`](https://npmx.dev/package/unplugin-isolated-decl)
- [`oxc-webpack-loader`](https://npmx.dev/package/oxc-webpack-loader)

<!-- Links -->

[url-oxc-crate]: https://docs.rs/oxc
[url-oxc-transform-npm]: https://npmx.dev/package/oxc-transform
