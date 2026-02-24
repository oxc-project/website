# Minifier

::: tip
`oxc-minify` is currently in alpha and may still have bugs.
We recommend thoroughly testing its output before deploying to production environments.
:::

## Features

- [Eliminate dead code.](./minifier/dead-code-elimination)
- [Transforms syntaxes to make the output shorter and repetitive.](./minifier/syntax-normalization)
- [Mangle variable names.](./minifier/mangling)
- [Remove whitespace and comments.](./minifier/whitespace-stripping)

## Assumptions

To allow better optimizations, Oxc minifier makes some assumptions about your code. See [Assumptions document](https://github.com/oxc-project/oxc/blob/main/crates/oxc_minifier/docs/ASSUMPTIONS.md) for more information.

## FAQ

See [FAQ](./minifier/faq) for common questions.

## Installation

### With Rolldown

If you are using [Rolldown][url-rolldown], `oxc-minify` will be used for minification by default. No extra installation is required.

### Node.js

- Use the node binding [oxc-minify][url-oxc-minify-npm].
- Try on [stackblitz](https://stackblitz.com/edit/oxc-minify).

### Rust

Use the umbrella crate [oxc][url-oxc-crate] with the `minifier` feature.

Rust usage example can be found [here](https://github.com/oxc-project/oxc/blob/main/crates/oxc_minifier/examples/minifier.rs).

## Integrations

- [`unplugin-oxc`](https://github.com/unplugin/unplugin-oxc)

<!-- Links -->

[url-oxc-crate]: https://docs.rs/oxc
[url-oxc-minify-npm]: https://npmx.dev/package/oxc-minify
[url-rolldown]: https://rolldown.rs
