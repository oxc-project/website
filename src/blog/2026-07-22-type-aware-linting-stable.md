---
title: "Type-Aware Linting Stable"
outline: deep
authors:
  - cameron
---

<AppBlogPostHeader />

Today we're releasing [tsgolint](https://github.com/oxc-project/tsgolint) v7, the type-aware linting engine behind Oxlint.

This release tracks [TypeScript v7.0.2](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/) and brings tsgolint to 59 of typescript-eslint's 61 type-aware rules. Since our [alpha release](/blog/2025-12-08-type-aware-alpha), we have added 16 rules, per-rule timings, improved configuration, and another round of performance work.

## Getting started

Install the latest Oxlint and tsgolint, then enable type-aware linting:

```sh
pnpm add -D oxlint oxlint-tsgolint@7
pnpm oxlint --type-aware
```

To report TypeScript compiler errors alongside lint diagnostics, add `--type-check`:

```sh
pnpm oxlint --type-aware --type-check
```

Linting and type-checking then share the same TypeScript program, avoiding the duplicate setup and analysis required by a separate type-check command.

## Versioning

tsgolint is built directly on [TypeScript v7](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/), hence its compatibility is tied to a specific TypeScript release. The new versioning scheme for tsgolint reflects that:

```text
v7.0.2000
^^^^^^^^  TypeScript version
        ^ tsgolint patch version
```

In other words, `v7.0.2000` is tsgolint patch `0` for TypeScript `v7.0.2`. If we need to ship another tsgolint fix while staying on that TypeScript version, the next release will be `v7.0.2001`. When we update TypeScript, the TypeScript portion changes and the tsgolint patch resets.

## 16 new rules since alpha

The alpha shipped with 43 type-aware rules. v7.0.2000 ships 59 of 61, adding:

- [`consistent-return`](/docs/guide/usage/linter/rules/typescript/consistent-return)
- [`consistent-type-exports`](/docs/guide/usage/linter/rules/typescript/consistent-type-exports)
- [`dot-notation`](/docs/guide/usage/linter/rules/typescript/dot-notation)
- [`no-unnecessary-condition`](/docs/guide/usage/linter/rules/typescript/no-unnecessary-condition)
- [`no-unnecessary-qualifier`](/docs/guide/usage/linter/rules/typescript/no-unnecessary-qualifier)
- [`no-unnecessary-type-conversion`](/docs/guide/usage/linter/rules/typescript/no-unnecessary-type-conversion)
- [`no-unnecessary-type-parameters`](/docs/guide/usage/linter/rules/typescript/no-unnecessary-type-parameters)
- [`no-useless-default-assignment`](/docs/guide/usage/linter/rules/typescript/no-useless-default-assignment)
- [`prefer-find`](/docs/guide/usage/linter/rules/typescript/prefer-find)
- [`prefer-nullish-coalescing`](/docs/guide/usage/linter/rules/typescript/prefer-nullish-coalescing)
- [`prefer-optional-chain`](/docs/guide/usage/linter/rules/typescript/prefer-optional-chain)
- [`prefer-readonly`](/docs/guide/usage/linter/rules/typescript/prefer-readonly)
- [`prefer-readonly-parameter-types`](/docs/guide/usage/linter/rules/typescript/prefer-readonly-parameter-types)
- [`prefer-regexp-exec`](/docs/guide/usage/linter/rules/typescript/prefer-regexp-exec)
- [`prefer-string-starts-ends-with`](/docs/guide/usage/linter/rules/typescript/prefer-string-starts-ends-with)
- [`strict-void-return`](/docs/guide/usage/linter/rules/typescript/strict-void-return)

## Configuration as code

Type-aware linting no longer needs to be wired into every package script or CI command. You can enable it alongside the rest of your lint configuration:

::: code-group

```ts [oxlint.config.ts]
import { defineConfig } from "oxlint";

export default defineConfig({
  options: {
    typeAware: true,
    typeCheck: true,
  },
});
```

```json [.oxlintrc.json]
{
  "options": {
    "typeAware": true,
    "typeCheck": true
  }
}
```

:::

`typeAware` enables rules that require type information. The `typeCheck` option additionally reports TypeScript compiler diagnostics; omit it if you only want type-aware linting. Both options are root-only, and CLI flags take precedence.

See the [type-aware linting guide](/docs/guide/usage/linter/type-aware) for configuration and migration details.

## See where lint time goes

Thanks to [Cam McHenry](https://github.com/oxc-project/tsgolint/pull/960), Oxlint can now [report timings for every enabled rule](/docs/guide/usage/linter/type-aware#rule-timings), including type-aware rules:

```sh
pnpm oxlint --type-aware --debug timings
```

The slowest rules are listed first:

```text
Rule timings:
Rule                                                         Time (ms)  Relative  Calls  Source
----------------------------------------------------------  ----------  --------  -----  ----------
typescript/unbound-method                                      108.620     46.5%  12450  type-aware
typescript/no-floating-promises                                 65.606     28.1%   7327  type-aware
eslint/no-unused-vars                                            2.187      0.9%    372  native
typescript/no-duplicate-type-constituents                        1.505      0.6%    870  type-aware
typescript/no-meaningless-void-operator                          1.445      0.6%    383  type-aware
vitest/no-standalone-expect                                      0.978      0.4%    372  native
vitest/expect-expect                                             0.951      0.4%   4682  native
typescript/no-implied-eval                                       0.401      0.2%  13809  type-aware
oxc/no-map-spread                                                0.383      0.2%  12545  native
react/no-did-update-set-state                                    0.382      0.2%  12545  native
eslint/no-misleading-character-class                             0.380      0.2%  13524  native
typescript/no-redundant-type-constituents                        0.371      0.2%    870  type-aware
unicorn/no-single-promise-in-promise-methods                     0.362      0.2%  12545  native
eslint/no-useless-backreference                                  0.360      0.2%  13524  native
typescript/no-useless-default-assignment                         0.258      0.1%   3110  type-aware
eslint/no-console                                                0.256      0.1%  12484  native
eslint/no-caller                                                 0.253      0.1%  11603  native
...
```

The report shows each rule's total time, relative share, call count, and whether it ran natively in Oxlint or through the type-aware engine. This makes expensive rules and configuration changes much easier to investigate, with no overhead when timings are not enabled. See our [profiling thread on X](https://x.com/Cameron_C2/status/2056713117611049465) for examples of how timings helped us identify and speed up expensive rules.

## Faster again

In our [latest benchmark run](https://github.com/oxc-project/tsgolint/pull/1102), tsgolint was 12 to 18 times faster than ESLint with typescript-eslint across four large TypeScript codebases:

| Repository                                                      | ESLint + typescript-eslint | tsgolint | Speedup |
| --------------------------------------------------------------- | -------------------------- | -------- | ------- |
| [microsoft/vscode](https://github.com/microsoft/vscode)         | 83.2s                      | 6.96s    | 12x     |
| [microsoft/typescript](https://github.com/microsoft/typescript) | 27.2s                      | 1.94s    | 14x     |
| [typeorm/typeorm](https://github.com/typeorm/typeorm)           | 13.2s                      | 0.75s    | 18x     |
| [vuejs/core](https://github.com/vuejs/core)                     | 12.3s                      | 0.95s    | 13x     |

These results were measured on an Apple M4 Pro with 12 cores. Both linters used the same TypeScript 7-compatible project configurations; see the [benchmark suite](https://github.com/oxc-project/tsgolint/tree/main/benchmarks) for the full methodology and results.

Since the alpha, we have made tsconfig discovery concurrent, cached filesystem reads, batched semantic diagnostics, and reused per-file rule state. We have also added targeted fast paths that avoid expensive type-checker queries when syntax already gives us the answer. For example, [`no-unnecessary-qualifier` now skips symbol resolution outside namespaces](https://github.com/oxc-project/tsgolint/pull/1032), making the rule 35 times faster on VS Code, while [`consistent-return` defers type resolution until it is needed](https://github.com/oxc-project/tsgolint/pull/1031), making the rule 8.6 times faster on the same codebase. A similar fast path made [`no-unnecessary-type-arguments` 3.7 times faster](https://github.com/oxc-project/tsgolint/pull/1064) when run by itself on VS Code.

Thank you to [Connor Shea](https://github.com/connorshea) and [Cam McHenry](https://github.com/camchenry) for their extensive profiling and optimization work.

## A smaller download

We now [strip debug information from release binaries](https://github.com/oxc-project/tsgolint/pull/1049). On Darwin ARM64, this reduced the installed binary by 26.6%, from 29.7 MB to 21.8 MB, and the compressed npm download by 44.9%, from 13.1 MB to 7.2 MB, without affecting lint results or runtime performance.

## Thank you

Thank you to the TypeScript team, especially [Jake Bailey](https://github.com/jakebailey), for building the native TypeScript compiler and collaborating closely with us on performance, compatibility, and fixes that improve both projects. Thank you as well to the typescript-eslint team, whose rules make this work possible, and especially to [@auvred](https://github.com/auvred), who created tsgolint.

Please try the release and [tell us what you find](https://github.com/oxc-project/tsgolint/issues).
