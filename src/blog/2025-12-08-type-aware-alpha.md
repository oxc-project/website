---
title: Type-Aware Linting Alpha
outline: deep
authors:
  - cameron
  - camchenry
---

<AppBlogPostHeader />

<Alert type="info">

**This post announces the alpha release of type-aware linting.** Type-aware linting has since reached stable! See the [Type-Aware Linting Stable announcement](/blog/2026-07-22-type-aware-linting-stable) for the latest features and improvements.

</Alert>

<br>

We're excited to announce the alpha release of type-aware linting in Oxlint!

## Overview

Following our [technical preview in August](/blog/2025-08-17-oxlint-type-aware), we're excited to announce that type-aware linting has reached alpha status. This milestone brings significant improvements in stability, configurability, and rule coverage.

Type-aware linting enables powerful rules like `no-floating-promises`, `no-misused-promises`, and `await-thenable` that catch bugs by utilizing TypeScript's type system. With 43 type-aware rules now available, you can catch entire categories of runtime errors before they happen.

**In this post:**

- [Quick Start](#quick-start) - Get started with type-aware linting in minutes
- [Performance](#performance) - See how much faster type-aware linting is compared to ESLint
- [What's new since the technical preview](#what-s-new-since-the-technical-preview) - New features and improvements
- [Technical details](#technical-details) - How type-aware linting works under the hood
- [What's next](#what-s-next) - Upcoming improvements for the beta release

## Quick Start

Install `oxlint` and `oxlint-tsgolint`, then run with the `--type-aware` flag:

::: code-group

```sh [npm]
npm add -D oxlint oxlint-tsgolint@latest
npx oxlint --type-aware
```

```sh [pnpm]
pnpm add -D oxlint oxlint-tsgolint@latest
pnpm oxlint --type-aware
```

```sh [yarn]
yarn add -D oxlint oxlint-tsgolint@latest
yarn oxlint --type-aware
```

```sh [bun]
bun add -D oxlint oxlint-tsgolint@latest
bunx oxlint --type-aware
```

:::

To try a specific type-aware rule without other configuration (`oxlint-tsgolint` must be installed globally or locally already):

::: code-group

```sh [npm]
npx oxlint --type-aware -A all -D typescript/no-floating-promises
```

```sh [pnpm]
pnpx oxlint --type-aware -A all -D typescript/no-floating-promises
```

```sh [yarn]
yarn oxlint --type-aware -A all -D typescript/no-floating-promises
```

```sh [bun]
bunx oxlint --type-aware -A all -D typescript/no-floating-promises
```

:::

For more configuration options, see our [usage guide](/docs/guide/usage/linter/type-aware).

## Performance

| Project         | Oxlint + Type Aware | ESLint + typescript-eslint | Improvement |
| --------------- | ------------------- | -------------------------- | ----------- |
| vuejs/core      | 2.531 s             | 20.800 s                   | 8.22x       |
| outline/outline | 4.448 s             | 55.070 s                   | 12.38x      |

Benchmarks were performed on a MacBook Pro M2 Max 12 Cores (8 performance and 4 efficiency).

Our performance testing shows that `oxlint` with type-aware linting is around 10 times faster than `eslint` with `typescript-eslint`. Take a look at our [performance benchmarks](https://github.com/oxc-project/bench-linter) for more details.

Oxlint can also be used to typecheck your codebase while linting. This avoids a duplicate work, as much of the type information is already computed during type-aware linting.

:::warning Known Issues
While `tsgolint` is ready for testing in production codebases, you may encounter issues with running out of memory when working with very large codebases. We are working on optimizing the memory usage for the next milestone. We would love if you tried `tsgolint` and reported any out-of-memory issues to us in the [`tsgolint` repository](https://github.com/oxc-project/tsgolint) and included some details about your project to help us improve memory usage.
:::

## What's new since the technical preview?

### Support for type-checking while linting

`tsgolint` now supports emitting type checking errors from TypeScript while linting. Since type-aware rules already require checking all of the types within a file, we are able to use this existing type information rather than discarding it. This means that in some cases, it is possible to skip doing a separate type-check command altogether (e.g., `tsc --noEmit`), reducing total time spent doing linting and type-checking in CI.

This is an experimental feature, but you can enable it by adding the `--type-check` and `--type-aware` flag to the `oxlint` command:

```
$ oxlint --type-aware --type-check

  × typescript(TS2322): Type 'number' is not assignable to type 'string'.
   ╭─[index.ts:1:7]
 1 │ const message: string = 1
   ·       ───────
   ╰────
```

### Rule configuration support in `oxlint`

Type-aware rules that run in `tsgolint` can be configured in `oxlint` just like any other lint rule. For example, you can configure the `no-floating-promises` rule to allow certain safe calls or ignore `void`:

```json
{
  "rules": {
    "typescript/no-floating-promises": [
      "error",
      {
        "ignoreVoid": true,
        "allowForKnownSafePromises": [
          { "from": "file", "name": "SafePromise" },
          { "from": "lib", "name": "PromiseLike" }
        ]
      }
    ]
  }
}
```

The configuration options are aligned with what `typescript-eslint` supports and documentation can be found in the configuration section for each rule (like [`no-floating-promises`](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-floating-promises.html#configuration)).

### Inline disable comment support in `oxlint`

Rules that run in `tsgolint` can now be disabled similar to any other `oxlint` rule by placing a comment in the file or on a line:

```ts
/* oxlint-disable typescript/no-floating-promises */

// oxlint-disable-next-line typescript/no-floating-promises
[1, 2, 3].map(async (x) => x + 1);
```

### More supported rules

We've continued to make progress on porting popular rules from `typescript-eslint` which you can now use via `oxlint`. `tsgolint`, combined with `oxlint`, currently supports 43 type-aware rules.

Since the initial preview, support for the following rules has also been added:

- [`no-deprecated`](/docs/guide/usage/linter/rules/typescript/no-deprecated) (one of the most commonly requested rules)
- [`prefer-includes`](/docs/guide/usage/linter/rules/typescript/prefer-includes)
- [`strict-boolean-expressions`](/docs/guide/usage/linter/rules/typescript/strict-boolean-expressions)

### TypeScript program diagnostics are now reported

Previously, if TypeScript failed to create and parse a program, these errors were not reported which led to confusion around why linting was not working. Now, we report any issues with creating a program as a diagnostic, including configuration issues in `tsconfig.json` files.

For example, if a `tsconfig.json` file contains `baseUrl`, that will be reported as an error, since `baseUrl` has been removed from TypeScript in v7.0:

```
$ oxlint --type-aware

  × typescript(tsconfig-error): Invalid tsconfig
   ╭─[tsconfig.json:4:3]
 3 │     "compilerOptions": {
 4 │         "baseUrl": ".",
   ·         ─────────
 5 │         "experimentalDecorators": true,
   ╰────
  help: Option 'baseUrl' has been removed. Please remove it from your configuration.
        See https://github.com/oxc-project/tsgolint/issues/351 for more information.
```

### Automatic fixes for type-aware rules

Type-aware rules now support automatic fixes via the `--fix` flag. When you run `oxlint --type-aware --fix`, fixable diagnostics from `tsgolint` are applied just like regular `oxlint` fixes. This brings full parity with non-type-aware rules for the fix workflow.

## Technical details

### Architecture

Type-aware linting in Oxlint uses a unique two-binary architecture:

```
oxlint CLI (Rust)
  ├─ Handles file traversal, ignore logic, and diagnostics
  ├─ Runs non-type-aware rules and custom JS plugins
  ├─ Passes paths and configuration to tsgolint
  └─ Formats and displays results

tsgolint (Go)
  ├─ Uses typescript-go directly for type checking
  ├─ Executes type-aware rules
  └─ Returns structured diagnostics
```

This design keeps Oxlint's core fast while leveraging TypeScript's type system through typescript-go. The frontend-backend separation means `oxlint` controls the user experience while `tsgolint` handles the heavy lifting of type analysis.

### TypeScript compatibility

`tsgolint` is based on [typescript-go](https://github.com/microsoft/typescript-go), Microsoft's Go-based rewrite that will become TypeScript v7.0. For more details on TypeScript 7's progress, see the [official TypeScript blog post](https://devblogs.microsoft.com/typescript/progress-on-typescript-7-december-2025/). This means that you might encounter some features which are no longer supported.

**Important compatibility notes:**

- Only TypeScript 7.0+ features are supported
- Pre-7.0 syntax and deprecated features are not supported
- Legacy `tsconfig.json` options like `baseUrl` have been removed in TypeScript 7.0

If you're using deprecated features from TypeScript 6.0 or earlier, you'll need to migrate your codebase first. See the [TypeScript migration guide](https://github.com/microsoft/TypeScript/issues/62508#issuecomment-3348649259) for help updating deprecated tsconfig options.

### Implementation details

`tsgolint` doesn't use typescript-go's public APIs. Instead, it compiles typescript-go by [shimming](https://github.com/oxc-project/tsgolint/tree/main/shim) internal APIs to make them accessible. We actively track typescript-go updates and fix breaking changes as needed.

Our typescript-go fork is synced regularly using renovatebot, ensuring we stay current with the latest improvements and fixes. Once TypeScript 7.0 is officially released, we will track stable releases rather than the tip of the main branch.

## What's next

We're actively working on the following improvements for the beta release:

- **More supported rules** - Currently we support 43 out of the 59 type-aware rules from `typescript-eslint`. As we head towards a beta release, we plan to continue expanding rule coverage.
- **Performance and memory usage improvements** - We're going to continue to optimize performance, especially for very large monorepos.

## Acknowledgements

We'd like to extend our gratitude to:

- The TypeScript team for creating `typescript-go`.
- The `typescript-eslint` team for their heartwarming support.
- [@auvred](https://github.com/auvred) for creating `tsgolint`.
- [@camchenry](https://github.com/camchenry) for continued performance work, as well as implementing rule option support.

## Try it out

Ready to get started? Head to the [Quick Start](#quick-start) section above to install and run type-aware linting.

We'd love to hear your feedback on type-aware linting and are excited to see how it helps improve your development workflow.

Connect with us:

- **Discord**: Join our [community server](https://discord.gg/9uXCAwqQZW) for real-time discussions
- **GitHub**: Share feedback on [GitHub Discussions](https://github.com/oxc-project/oxc/discussions)
- **Issues**: Report `oxlint` bugs to [oxc](https://github.com/oxc-project/oxc/issues) and type-aware linting bugs to [tsgolint](https://github.com/oxc-project/tsgolint/issues).
