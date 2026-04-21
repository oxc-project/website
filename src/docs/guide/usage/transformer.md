# Transformer

## Features

- [Lowering ESNext to ES2015.](./transformer/lowering)
- [Transforming TypeScript to JavaScript.](./transformer/typescript)
- [Transforming JSX to JavaScript, with built-in React Refresh.](./transformer/jsx)
- [Built-in support for popular plugins like styled-components.](./transformer/plugins)
- [Replacing global variables.](./transformer/global-variable-replacement)
- [TypeScript Isolated Declarations Emit without using the TypeScript compiler.](./transformer/isolated-declarations)

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
- Try on [stackblitz](https://stackblitz.com/edit/oxc-transform).

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
