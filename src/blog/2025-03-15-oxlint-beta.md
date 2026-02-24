---
title: Oxlint Beta
outline: deep
authors:
  - boshen
  - camchenry
---

<AppBlogPostHeader />

<Alert type="info">

**This post announces the beta release of Oxlint.** Oxlint has since reached v1.0 stable! See the [Oxlint v1.0 Stable announcement](/blog/2025-06-10-oxlint-stable) for the latest features and improvements.

</Alert>

We are thrilled to announce that Oxlint is now in beta release, after more than a year of development by the community!

This milestone represents a significant step forward in feature completeness, performance, and stability.

## How to use

At this stage, Oxlint can be used to fully replace ESLint in small to medium projects.

For larger projects, our advice is to turn off ESLint rules via [eslint-plugin-oxlint](https://npmx.dev/package/eslint-plugin-oxlint),
and run Oxlint before ESLint in your local or CI setup for a quicker feedback loop.

To test Oxlint in your codebase, you can use the package manager of your choice at the root of your codebase:

::: code-group

```sh [npm]
$ npx oxlint@latest
```

```sh [pnpm]
$ pnpm dlx oxlint@latest
```

```sh [yarn]
$ yarn dlx oxlint@latest
```

```sh [bun]
$ bunx oxlint@latest
```

```sh [deno]
$ deno run npm:oxlint@latest
```

:::

For more detailed instructions on how to use Oxlint and integrate it with your project or editor, check out the [installation guide](/docs/guide/usage/linter).

## Highlight of new features since general availability

- Significant performance improvements, up to twice as fast compared to the previous release
- Includes over 500 rules built-in, with no extra installation required
- Many rules from the `typescript`, `unicorn`, `react`, `react-perf`, `nextjs`, `import`, `jsdoc`, `jsx-a11y`, `node`, `promise`, `jest`, `vitest` plugins are now complete.
- Support for configuration via [`.oxlintrc.json` files](/docs/guide/usage/linter/nested-config.html#configuration-file-format), including [nested configuration files](/docs/guide/usage/linter/nested-config.html), using `extends` to share configuration between files, applying `overrides` to specific files, and more.
- Supports linting `<script>` content in `.astro`, `.svelte` and `.vue` files with no additional configuration needed.
- Allows applying [automatic fixes](/docs/guide/usage/linter/automatic-fixes.html) and suggestions to files.

## More rules, more performance

We have focused on making Oxlint more feature complete, supporting many of the most commonly used ESLint rules and plugins, but we have also made Oxlint much faster as well.

The first [generally available (GA) release of Oxlint](./2023-12-12-announcing-oxlint.md) had 205 rules in total, with 70 of those being enabled by default. This beta release now includes 502 rules in total, with 99 of those being enabled by default (a 41% increase in the number of rules enabled by default).

| Rule type       | Rule count (GA) | Rule count (beta) | Increase       |
| --------------- | --------------- | ----------------- | -------------- |
| Default rules   | 70              | 99                | +29 rules      |
| Correctness     | 88              | 173               | +88 rules      |
| Performance     | 0               | 9                 | +9 rules       |
| Restrictions    | 15              | 64                | +49 rules      |
| Pedantic        | 43              | 79                | +36 rules      |
| Style           | 38              | 137               | +99 rules      |
| Suspicious      | 7               | 28                | +21 rules      |
| **Total rules** | 205             | **502**           | **+297 rules** |

Despite adding many new rules that are enabled by default, Oxlint is now much faster than it ever has been. Here are some [benchmarks](https://gist.github.com/camchenry/cb09f6fae14ec1e3df1f72938b7350c8) on some popular repositories:

| Repository          | File count | Lint time (GA) | Lint time (beta) | Speedup   |
| ------------------- | ---------- | -------------- | ---------------- | --------- |
| `elastic/kibana`    | 68,591     | 6.02s          | **3.11s**        | **1.94x** |
| `microsoft/vscode`  | 5,703      | 1.697s         | **0.792s**       | **2.14x** |
| `vitest-dev/vitest` | 1,732      | 105ms          | **50ms**         | **2.1x**  |
| `vuejs/core`        | 1,063      | 217ms          | **89ms**         | **2.44x** |

## Roadmap

One of the most commonly requested features for Oxlint is support for existing custom ESLint plugins. We have been busy working on the prerequisites for this feature, and to enable fast linter plugins written in JavaScript. We hope to have this feature available for the next major release, and more information to share about it in the near future.

We also are planning to continue improving the IDE/editor integrations, with improved support for VSCode, Zed, `coc.nvim`, and IntelliJ plugins.

## Acknowledgements

Oxlint beta would not have been possible without the over 200 contributors to the project.

Special thanks goes to:

- [@cam314](https://github.com/camc314), [@mysteryven](https://github.com/mysteryven), and [@shulaoda](https://github.com/shulaoda) for implementing many sophisticated lint rules, testing, and constantly improving everything.
- [@Sysix](https://github.com/Sysix) for maintaining `eslint-plugin-oxlint`.
- [@DonIsaac](https://github.com/DonIsaac) for improving configuration, documentation and website, and for representing Oxc at [SquiggleConf 2024](https://2024.squiggleconf.com).
- [@leaysgur](https://github.com/leaysgur) for the RegExp parser and JSDoc plugin.
- [@u9g](https://github.com/u9g) and [@rzvxa](https://github.com/rzvxa) for implementing control flow graph analysis.
- [@branchseer](https://github.com/branchseer) for implementing the multi-file analysis runtime.
- [@camchenry](https://github.com/camchenry) for implementing nested configuration support.
