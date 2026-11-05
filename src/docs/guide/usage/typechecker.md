---
title: Type Checker
description: Check TypeScript types with tsrs, a Rust port of the TypeScript compiler.
outline: deep
---

# Type Checker

::: info Experimental
`tsrs` is experimental. It aims for full TypeScript compatibility, but some differences remain. See the [compatibility status](https://github.com/oxc-project/tsrs/blob/main/docs/COMPATIBILITY.md) for supported features and known gaps.
:::

[`tsrs`](https://github.com/oxc-project/tsrs) is a Rust port of the TypeScript compiler and language server, incubated as part of Oxc. Cloudflare, VoidZero, and Max Schwenk are developing it in collaboration with the TypeScript team.

The goal is faster type checking and lower memory use while preserving upstream TypeScript behavior. Rust also enables WebAssembly support for running the compiler in browsers and other environments.

## Quickstart

Install [`tsrs`](https://npmx.dev/package/tsrs) as a development dependency:

::: code-group

```sh [npm]
$ npm add -D tsrs
```

```sh [pnpm]
$ pnpm add -D tsrs
```

```sh [yarn]
$ yarn add -D tsrs
```

```sh [bun]
$ bun add -D tsrs
```

:::

Run it from your project directory to check types without emitting JavaScript:

```sh
npx tsrs --noEmit
```

## Links

- [`tsrs` repository](https://github.com/oxc-project/tsrs)
- [CLI usage](https://github.com/oxc-project/tsrs/blob/main/docs/USAGE.md)
- [Browser playground](https://tsrs-playground.void.app)
- [Introducing tsrs: A port of TypeScript to Rust](https://blog.cloudflare.com/typescript-rust-port/)
