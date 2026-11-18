---
title: Oxlint Type-Aware Preview
outline: deep
authors:
  - boshen
  - auvred
  - camchenry
  - cameron
---

<AppBlogPostHeader />

<Alert type="info">

**This post announces the technical preview of type-aware linting.** See the [current setup guide](/docs/guide/usage/linter/type-aware#installation) for how to use `tsrs` instead of `tsgolint`.

</Alert>

<br>

We're thrilled to announce type-aware linting in `oxlint`!

The long-awaited `no-floating-promises` and related rules are here.

This preview release aims to engage with the community for collaboration and
discussion by documenting our decision process and technical details.

## Quick Start

If `oxlint` is already configured, install `oxlint-tsgolint` and run `oxlint` with the `--type-aware` flag:

```bash
pnpm add -D oxlint-tsgolint@latest
pnpm dlx oxlint --type-aware
```

If `oxlint` is not configured but you want to see `no-floating-promises` in action:

```bash
pnpm add -D oxlint-tsgolint@latest
pnpm dlx oxlint@latest --type-aware -A all -D typescript/no-floating-promises
```

We expect to see, for example:

```js
 × typescript-eslint(no-floating-promises): Promises must be awaited, end with a call to .catch, end with a call to .then with a rejection handler or be explicitly marked as ignored with the `void` operator.
   ╭─[packages/rolldown/src/api/watch/watcher.ts:30:7]
29 │       await this.close();
30 │       originClose();
   ·       ──────────────
31 │     };
   ╰────
```

Please visit our [usage guide](https://oxc.rs/docs/guide/usage/linter.html) for more configuration options.

## Performance

Our testing shows that repositories which previously took a minute to run with `typescript-eslint` now complete in less than 10 seconds.

This is achieved by leveraging [`typescript-go`](https://github.com/microsoft/typescript-go),
the [10x faster TypeScript](https://devblogs.microsoft.com/typescript/typescript-native-port) written in Go.

Using projects from [oxc-ecosystem-ci](https://github.com/oxc-project/oxc-ecosystem-ci):

| Project  | Files | Time |
| -------- | ----- | ---- |
| napi-rs  | 144   | 1.0s |
| preact   | 245   | 2.7s |
| rolldown | 314   | 1.5s |
| bluesky  | 1152  | 7.0s |

## Type-Aware Linting

Please refer to
[Rust-Based JavaScript Linters: Fast, But No Typed Linting Right Now](https://www.joshuakgoldberg.com/blog/rust-based-javascript-linters-fast-but-no-typed-linting-right-now)
to understand the current status of type-aware linting in the ecosystem.

## Technical Details

The core of this new functionality is [oxc-project/tsgolint](https://github.com/oxc-project/tsgolint).

The `tsgolint` project was initially prototyped as [typescript-eslint/tsgolint](https://github.com/typescript-eslint/tsgolint).
However, the `typescript-eslint` team decided not to allocate development resources to this prototype, as they plan to continue their work on `typescript-eslint` for typed linting with ESLint.

[@boshen](https://github.com/Boshen) reached out to [@auvred](https://github.com/auvred) for a forked, scoped-down version adapted for oxlint.
This version would only contain type-aware rules without the sophisticated configuration resolution a full linter would require.

[@auvred](https://github.com/auvred) generously offered to continue its development under the Oxc organization.

### Architecture

`oxlint` (written in Rust) and `tsgolint` (written in Go) are compiled into their own binaries.

`oxlint` serves as the "frontend" for `tsgolint`, handling the CLI, path traversal, ignore logic, and diagnostic printing.

`tsgolint` acts as the backend for `oxlint`, accepting paths and configuration as input and outputting structured diagnostics.

This creates a simple pipeline:

```
oxlint CLI (returns paths + rules + configuration)
  -> tsgolint (returns diagnostics)
  -> oxlint CLI (prints diagnostics)
```

### `tsgolint`

`tsgolint` does not communicate with typescript-go via public APIs.

Instead, it compiles `typescript-go` by [shimming](https://github.com/oxc-project/tsgolint/tree/main/shim) its internal APIs to make them public.

All type-aware rules are written directly against these shimmed APIs.

While this isn't the recommended approach for accessing internals, it works!

## Decision Process

### Write our own type checker

Previous abandoned attempts to implement a type-checker included:

- My own attempt at [writing type inference](https://gist.github.com/Boshen/d189de0fe0720a30c5182cb666e3e9a5)
- [Integrate](https://github.com/oxc-project/oxc/pull/413) [ezno type checker](https://github.com/kaleidawave/ezno) by [@kaleidawave](https://github.com/kaleidawave)
- [stc](https://github.com/dudykr/stc) by [@kdy1](https://github.com/kdy1)
- There are also many attempts in the community that did not go far.

Additionally, there's the work-in-progress [Biome 2.0](https://biomejs.dev/blog/biome-v2/) with its own type-inference implementation.

We determined that writing our own type-inferencer or type-checker was not feasible due to
the challenge of keeping up with a fast-moving target like TypeScript.

### Communication with TypeScript Compiler

Prior to `typescript-go`, projects added plugin interfaces to TypeScript's public API by either mapping its AST to `estree` or directly traversing the TypeScript AST. Examples include:

- [typescript-eslint](https://typescript-eslint.io/getting-started/typed-linting)
- [tsslint](https://github.com/johnsoncodehk/tsslint)
- [tsl](https://github.com/ArnaudBarre/tsl)

We also explored [inter-process communication with oxlint](https://github.com/oxc-project/oxc/discussions/2855) but abandoned the idea.

With `typescript-go`, the TypeScript team is [leaning towards](https://github.com/microsoft/typescript-go/discussions/455)
encoding the TypeScript AST and decoding it on the JavaScript side through inter-process communication.

While these approaches work, they still incur:

- Performance issues of varying degrees that don't suit oxlint's performance characteristics.
- The cost of maintaining an AST mapping from TypeScript's AST.

## Considerations

While `tsgolint` solves the performance issue, there are other technical challenges that need to be addressed.

### Requirement for a Different TypeScript Version

We plan to release snapshots of `typescript-go` versions and align their version numbers with TypeScript.
You will then be able to install `oxlint-typescript` with the correct TypeScript version.

The downside of this approach is that you may need to upgrade TypeScript if `oxlint-tsgolint` requires changes.

### Maintenance cost of `tsgolint`

Shimming TypeScript's internal APIs carries some risk. However, the TypeScript AST and its visitor are actually quite stable.
We accept this risk and will fix breaking changes when upgrading `typescript-go`.

Our `typescript-go` version is synced every day.

## Performance Issues

`tsgolint` currently does not perform well on large monorepos with hundreds of projects or lots of project references.

It may hang with a deadlock or cause OOM (out-of-memory) if a bug is encountered.

We are actively addressing these issues, profiling and submitting improvements to `typescript-go`, benefiting all `typescript-go` users.

Our core team member [@camc314](https://github.com/camc314) has already submitted [many PRs](https://github.com/microsoft/typescript-go/pulls?q=is%3Apr+author%3Acamc314+) that made several code paths significantly faster.

## v1.0 Release

For `tsgolint` v1.0, we will address:

- performance issue for large monorepos
- be able to configure individual rules
- correctness of each individual rules
- IDE support
- overall stability

## Acknowledgements

We'd like to extend our gratitude to:

- The TypeScript team for creating `typescript-go`.
- The `typescript-eslint` team for their heartwarming support.
- [@auvred](https://github.com/auvred) for creating `tsgolint`.
- [@camchenry](https://github.com/camchenry) for the `oxlint` + `tsgolint` integration.
- [@camc314](https://github.com/camc314) for work on performance issues.

## Join the Community

We'd love to hear your feedback on `oxlint` and type-aware linting and are excited to see how it helps improve your development workflow.

Connect with us:

- **Discord**: Join our [community server](https://discord.gg/9uXCAwqQZW) for real-time discussions
- **GitHub**: Share feedback on [GitHub Discussions](https://github.com/oxc-project/oxc/discussions)
- **Issues**: Report `oxlint` bugs to [oxc](https://github.com/oxc-project/oxc/issues) and type-aware linting bugs to [tsgolint](https://github.com/oxc-project/tsgolint/issues).

## Next steps

Install `oxlint`:

```bash
pnpm add -D oxlint@latest oxlint-tsgolint@latest
pnpm dlx oxlint --init # generate .oxlintrc.json
```

or follow the [installation guide](https://oxc.rs/docs/guide/usage/linter).

Use the `--type-aware` CLI flag.

```bash
pnpm dlx oxlint --type-aware
```

And play around with any of the type-aware rules in `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "rules": {
    "typescript/await-thenable": "error",
    "typescript/no-array-delete": "error",
    "typescript/no-base-to-string": "error",
    "typescript/no-confusing-void-expression": "error",
    "typescript/no-duplicate-type-constituents": "error",
    "typescript/no-floating-promises": "error",
    "typescript/no-for-in-array": "error",
    "typescript/no-implied-eval": "error",
    "typescript/no-meaningless-void-operator": "error",
    "typescript/no-misused-promises": "error",
    "typescript/no-misused-spread": "error",
    "typescript/no-mixed-enums": "error",
    "typescript/no-redundant-type-constituents": "error",
    "typescript/no-unnecessary-boolean-literal-compare": "error",
    "typescript/no-unnecessary-template-expression": "error",
    "typescript/no-unnecessary-type-arguments": "error",
    "typescript/no-unnecessary-type-assertion": "error",
    "typescript/no-unsafe-argument": "error",
    "typescript/no-unsafe-assignment": "error",
    "typescript/no-unsafe-call": "error",
    "typescript/no-unsafe-enum-comparison": "error",
    "typescript/no-unsafe-member-access": "error",
    "typescript/no-unsafe-return": "error",
    "typescript/no-unsafe-type-assertion": "error",
    "typescript/no-unsafe-unary-minus": "error",
    "typescript/non-nullable-type-assertion-style": "error",
    "typescript/only-throw-error": "error",
    "typescript/prefer-promise-reject-errors": "error",
    "typescript/prefer-reduce-type-parameter": "error",
    "typescript/prefer-return-this-type": "error",
    "typescript/promise-function-async": "error",
    "typescript/related-getter-setter-pairs": "error",
    "typescript/require-array-sort-compare": "error",
    "typescript/require-await": "error",
    "typescript/restrict-plus-operands": "error",
    "typescript/restrict-template-expressions": "error",
    "typescript/return-await": "error",
    "typescript/switch-exhaustiveness-check": "error",
    "typescript/unbound-method": "error",
    "typescript/use-unknown-in-catch-callback-variable": "error"
  }
}
```
