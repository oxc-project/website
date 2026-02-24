---
title: Oxlint
outline: deep
badges:
  - src: https://img.shields.io/npm/dw/oxlint
    alt: npm weekly downloads
---

<script setup>
import { data } from './rule-count.data.js';
const ruleCount = data;
// Subtract 1 and then round down to nearest 5 so we can say "More than 650 rules" when the number is 655, instead of saying "More than 655 rules" when that's incorrect.
// Inputs and outputs:
// 655 -> 650
// 654 -> 650
// 651 -> 650
// 656 -> 655
const ruleCountRounded = Math.floor((data - 1) / 5) * 5;
</script>

# Oxlint

<AppBadgeList />

Oxlint (`/oʊ-ɛks-lɪnt/`) is a high-performance linter for JavaScript and TypeScript built on the Oxc compiler stack.

## Built for scale

Oxlint is built for large repositories and CI environments. Its architecture removes structural bottlenecks that limit performance in ESLint.

Our [benchmarks](https://github.com/oxc-project/bench-linter) show Oxlint is 50 to 100 times faster than ESLint.

## Correctness-focused defaults

Oxlint is useful out of the box. By default, it prioritizes high-signal correctness checks. These checks surface code that is incorrect, unsafe, or useless, so teams can adopt Oxlint without excessive noise.

Additional rules can be enabled incrementally as requirements evolve.

## A large and growing rule set

Oxlint includes [more than {{ ruleCountRounded }} rules](/docs/guide/usage/linter/rules.md), with coverage across the plugins most teams already use, including:

- ESLint core rules
- TypeScript rules
- Popular plugins such as React, Jest, Unicorn, and jsx-a11y
- Custom JS plugins compatible with the ESLint plugin ecosystem

This breadth makes migration straightforward without sacrificing rule coverage.

## Type-aware linting

Oxlint leverages the native Go port of the TypeScript compiler ([tsgo](https://github.com/microsoft/typescript-go) aka TypeScript 7), providing full TypeScript compatibility and the same type system behavior you expect from TypeScript itself.

This enables mission critical checks that require types, such as detecting floating promises.

In contrast, [Biome’s approach](https://biomejs.dev/blog/biome-v2) is to implement its own type inference instead of relying on the TypeScript compiler, and they note coverage is still improving.

See: [Type-aware linting](/docs/guide/usage/linter/type-aware)

## Multi-file analysis

Oxlint supports multi-file analysis as a first-class capability.

When enabled, Oxlint builds a project-wide module graph and shares parsing and resolution across rules. This improves checks that depend on cross-file imports and helps avoid the performance cliff often seen with rules like [`import/no-cycle`](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-cycle.md) in ESLint.

See: [Multi-file analysis](/docs/guide/usage/linter/multi-file-analysis.md)

## AI-friendly diagnostics

Oxlint diagnostics are designed to be both human-readable and machine-actionable.

In addition to clear messages, diagnostics include structured information such as precise spans and contextual data. This helps AI to understand issues and apply fixes reliably.

## Reliability as a priority

Oxlint is built for workflows where failures are not acceptable.

Crashes are treated as top priority bugs.
Performance regressions are treated as bugs.

Stability and throughput are always prioritized, especially for CI and large monorepos.

## Getting started

The recommended setup is to install Oxlint as a dev dependency and add scripts.

```sh
pnpm add -D oxlint
```

Add scripts to `package.json`:

```json [package.json]
{
  "scripts": {
    "lint": "oxlint",
    "lint:fix": "oxlint --fix"
  }
}
```

Next steps:

- [Quickstart](/docs/guide/usage/linter/quickstart)
- [Configuration](/docs/guide/usage/linter/config)
- [Setup editors](/docs/guide/usage/linter/editors)
- [Setup CI](/docs/guide/usage/linter/ci)

## Adoption paths

::: tip
If you're migrating from ESLint, see [the "Migrate from ESLint" page](/docs/guide/usage/linter/migrate-from-eslint) for detailed guidance.
:::

Choose the approach that fits your repository:

- **Replace ESLint (recommended for most projects).** Use Oxlint as your primary linter.
  - Use tooling such as [`@oxlint/migrate`](https://github.com/oxc-project/oxlint-migrate) to migrate your existing ESLint config.
- **Migrate incrementally (recommended for large repos).** Run Oxlint first, then run ESLint with overlapping rules disabled. This keeps CI fast while you migrate.
  - Use [`eslint-plugin-oxlint`](https://npmx.dev/package/eslint-plugin-oxlint) to disable overlapping ESLint rules while running both.
  - You can - and should - also use [`@oxlint/migrate`](https://github.com/oxc-project/oxlint-migrate) for this approach as well.

## What Oxlint supports

Oxlint supports:

- JavaScript and TypeScript (`.js`, `.mjs`, `.cjs`, `.ts`, `.mts`, `.cts`)
- JSX and TSX (`.jsx`, `.tsx`)
- Framework files (`.vue`, `.svelte`, `.astro`) by linting only their `<script>` blocks

## Features

- [Native plugins](/docs/guide/usage/linter/plugins) for broad rule coverage with {{ ruleCount }} built-in rules, without a large JavaScript dependency tree.
- [Automatic fixes](/docs/guide/usage/linter/automatic-fixes) to apply safe changes quickly.
- [Ignore files](/docs/guide/usage/linter/ignore-files) to control which paths are linted.
- [Inline ignore comments](/docs/guide/usage/linter/ignore-comments) for ignoring rules within a file.
- [Multi-file analysis](/docs/guide/usage/linter/multi-file-analysis) for rules that require project-wide context such as import analysis like [no-cycle](/docs/guide/usage/linter/rules/import/no-cycle.html).
- [Type-aware linting](/docs/guide/usage/linter/type-aware) for rules that require TypeScript type information.
- [JS plugins](/docs/guide/usage/linter/js-plugins) (**experimental**) for compatibility with existing ESLint plugins.

## Projects using Oxlint

Oxlint is used in production by popular projects such as:

- [preactjs/preact](https://github.com/preactjs/preact)
- [date-fns/date-fns](https://github.com/date-fns/date-fns)
- [outline/outline](https://github.com/outline/outline)
- [PostHog/posthog](https://github.com/PostHog/posthog)
- [actualbudget/actual](https://github.com/actualbudget/actual)

## Migration

- [Migrate from ESLint](/docs/guide/usage/linter/migrate-from-eslint)
<!-- - [Migrate from Biome](/docs/guide/usage/linter/migrate-from-biome) -->

## References

- [Rules reference](/docs/guide/usage/linter/rules)
- [CLI reference](/docs/guide/usage/linter/cli)
- [Config file reference](/docs/guide/usage/linter/config-file-reference)
- [Versioning policy](/docs/guide/usage/linter/versioning)
