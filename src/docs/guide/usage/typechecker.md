---
title: Type Checker
description: Use tsrs to type-check and build TypeScript projects, power your editor, and run type-aware linting with Oxlint.
outline: deep
---

# Type Checker

::: info TypeScript compatibility
`tsrs` currently targets TypeScript 7.1 beta. See the [compatibility status](https://github.com/oxc-project/tsrs/blob/main/docs/COMPATIBILITY.md) for supported features and known gaps.
:::

[`tsrs`](https://github.com/oxc-project/tsrs) is a Rust port of the TypeScript compiler and language server, incubated as part of Oxc. Cloudflare, VoidZero, and Max Schwenk are developing it in collaboration with the TypeScript team.

The goal is faster type checking and lower memory use while preserving upstream TypeScript behavior. Rust also enables WebAssembly support for running the compiler in browsers and other environments.

## Quickstart

Install [`tsrs`](https://npmx.dev/package/tsrs) and use it as you would `tsc`.

::: code-group

```sh [npm]
npm add -D tsrs
npm exec tsrs
```

```sh [pnpm]
pnpm add -D tsrs
pnpm exec tsrs
```

```sh [yarn]
yarn add -D tsrs
yarn exec tsrs
```

```sh [bun]
bun add -D tsrs
bun run tsrs
```

:::

## Lint and type-check with Oxlint

Oxlint 1.92.0 and later automatically use `tsrs` for type-aware linting when it is installed. Add `--type-check` to report TypeScript compiler diagnostics for the files Oxlint lints. The two checks share one TypeScript analysis. See the [type-aware linting guide](./linter/type-aware) for configuration details.

```sh
pnpm add -D oxlint tsrs
pnpm exec oxlint --type-aware --type-check
```

Use a standalone `tsrs --noEmit` check when CI needs diagnostics for every file in the TypeScript project, including files that Oxlint skips. [Type checking in the lint run](https://github.com/oxc-project/tsrs/blob/main/tools/tsgolint/README.md#type-checking-in-the-lint-run)

In our type-aware linting benchmarks, Oxlint with `tsrs` ran up to 5× as fast as with `tsgolint` v7.0.2007 and used around 70% less memory. See the [benchmarks in the announcement](/blog/2026-11-17-faster-type-aware-linting-with-tsrs#performance).

## Fast mode

The standalone compiler defaults to the checker settings of the TypeScript release it ports. Pass `--fast` to enable adaptive checker counts, additional caches, and memory optimizations. The preset keeps compiler options such as `strict` and `skipLibCheck` as configured.

```sh
pnpm exec tsrs --noEmit --fast
```

Fast mode can change diagnostics for programs sensitive to checking order or type-instantiation limits. Try the same command with `--fast false` when investigating a difference. The Oxlint backend enables fast mode by default and accepts `TSRS_FAST=0` to disable it. See the [performance options](https://github.com/oxc-project/tsrs/blob/main/docs/USAGE.md#performance-options) and [benchmark results](https://github.com/oxc-project/tsrs/blob/main/bench/RESULTS.md).

## Use tsrs in your editor

`tsrs` includes a language server for diagnostics, completions, and navigation. On macOS and Linux, install the [TypeScript Native Preview extension](https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.native-preview) for VS Code and point it at the SDK from your project dependency in `.vscode/settings.json`.

```json
{
  "js/ts.experimental.useTsgo": true,
  "js/ts.tsdk.path": "./node_modules/tsrs/tsdk"
}
```

For Windows and other editors, see the [language server setup guide](https://github.com/oxc-project/tsrs/blob/main/docs/LSP.md#editor-setup).

## Troubleshoot compatibility

- If your config uses legacy options such as `baseUrl`, check which options TypeScript 7 removed and how to migrate them. See the [TypeScript migration guide](https://github.com/microsoft/TypeScript/issues/62508#issuecomment-3348649259).
- Use an existing config or create `tsconfig.json` by hand. `tsrs --init` is currently unsupported. See [differences from upstream TypeScript](https://github.com/oxc-project/tsrs/blob/main/docs/DEFAULTS.md).
- If the launcher cannot find the native binary, check that your install includes optional dependencies. See the [compatibility table](https://github.com/oxc-project/tsrs/blob/main/docs/COMPATIBILITY.md) for supported platforms.
- When comparing diagnostics, use TypeScript 7.1 beta at the upstream commit shown by `pnpm exec tsrs --version`. If the results differ, include the version, command, and a minimal reproduction in your [bug report](https://github.com/oxc-project/tsrs/issues).

## Links

- [`tsrs` repository](https://github.com/oxc-project/tsrs)
- [CLI usage](https://github.com/oxc-project/tsrs/blob/main/docs/USAGE.md)
- [Node.js API](https://github.com/oxc-project/tsrs/blob/main/docs/NODE_API.md)
- [WebAssembly for Node.js and browsers](https://github.com/oxc-project/tsrs/blob/main/npm/tsrs-wasm/README.md)
- [Browser playground](https://tsrs-playground.void.app)
- [Introducing tsrs: A port of TypeScript to Rust](https://blog.cloudflare.com/typescript-rust-port/)
