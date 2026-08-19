# React Compiler

Oxc has experimental support for the [React Compiler](https://react.dev/learn/react-compiler), which automatically memoizes React components and hooks.

::: warning
This feature is experimental and under active development. Options and behaviour may change.
:::

Under the hood, Oxc integrates the [Rust port of the React Compiler](https://github.com/facebook/react/pull/36173) rather than the Babel-based `babel-plugin-react-compiler`. Oxc [vendors and maintains the compiler in-tree](https://github.com/oxc-project/oxc/tree/main/crates/oxc_react_compiler), allowing it to operate directly on Oxc's AST.

## General Usage

Install the dedicated React transform package:

```sh
pnpm add -D oxc-transform-react
```

```js
import { transform } from "oxc-transform-react";

// React Compiler is enabled by default with a React 19 target.
const result = await transform("App.jsx", sourceCode);

// Or configure it explicitly.
const configuredResult = await transform("App.jsx", sourceCode, {
  reactCompiler: {
    // React runtime version target. `'17'` and `'18'` require the
    // `react-compiler-runtime` package; `'19'` ships the runtime in `react`.
    target: "19", // '17' | '18' | '19'
  },
});
```

Pass `reactCompiler: false` to disable the React Compiler. Omitting the option enables it with the default configuration.

Files whose filename contains `node_modules` are skipped by default. Providing a `reactCompiler.sources` allowlist replaces that default filter, so dependencies can be opted in explicitly.

## When the React Compiler won't work

The React Compiler [requires the original source](https://react.dev/learn/react-compiler/installation): it must see JSX before any other transform. Plugins that rewrite JSX first break this. Examples:

- [`@emotion/babel-plugin`](https://emotion.sh/docs/@emotion/babel-plugin) and other `css` prop / JSX pragma transforms.
- [`@babel/plugin-transform-react-constant-elements`](https://babeljs.io/docs/babel-plugin-transform-react-constant-elements) and `-inline-elements`, which hoist or inline JSX.

This is why Oxc runs the React Compiler before its own JSX transform.

Code that breaks the [Rules of React](https://react.dev/reference/rules) is also skipped rather than optimized — for example interior mutability, or libraries built on observable mutation such as MobX's `observer()`.

To find that code, Oxlint has experimental [React Compiler-powered rules](/blog/2026-08-18-react-compiler-support#oxlint) that run the same analysis in lint-only mode and report specific categories of violations.
