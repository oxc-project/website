# Transformer

## Features

- [Lowering ESNext to ES2015.](./transformer/lowering)
- [Transforming TypeScript to JavaScript.](./transformer/typescript)
- [Transforming JSX to JavaScript, with built-in React Refresh.](./transformer/jsx)
- [Built-in support for popular plugins like styled-components.](./transformer/plugins)
- [Replacing global variables.](./transformer/global-variable-replacement)
- [TypeScript Isolated Declarations Emit without using the TypeScript compiler.](./transformer/isolated-declarations)

## Installation

### Node.js

- Use the node binding [oxc-transform][url-oxc-transform-npm].
- Try on [stackblitz](https://stackblitz.com/edit/oxc-transform).

### Rust

Use the umbrella crate [oxc][url-oxc-crate] with the `transformer` feature.

Rust usage example can be found [here](https://github.com/oxc-project/oxc/blob/main/crates/oxc_transformer/examples/transformer.rs).

## Integrations

- [`unplugin-oxc`](https://github.com/unplugin/unplugin-oxc)
- [`unplugin-isolated-decl`](https://github.com/unplugin/unplugin-isolated-decl)

<!-- Links -->

[url-oxc-crate]: https://docs.rs/oxc
[url-oxc-transform-npm]: https://npmx.dev/package/oxc-transform
