---
title: Oxlint v1.0 Stable
outline: deep
authors:
  - boshen
  - cameron
canonical: https://voidzero.dev/posts/announcing-oxlint-1-stable
---

<AppBlogPostHeader />

<br>

:::info

This blog post was [originally published on the VoidZero website](https://voidzero.dev/posts/announcing-oxlint-1-stable).

:::

<br>

TL;DR: The first stable version Oxlint has been released! With a [50~100x](#benchmark) performance improvement over ESLint, support for over 500 ESLint rules, and [usage in major companies](#real-world-impact) like Shopify, Airbnb, and Mercedes-Benz, you should give it a try. [Get started now](#quick-start).

---

Oxlint is a Rust-powered linter for JavaScript and TypeScript, designed to be fast and easy to adopt. Since its initial announcement in December 2023, Oxlint has undergone significant improvements and is now releasing its first stable version, 1.0.
In addition to the stable release, we also want to announce that Oxlint has a dedicated full-time maintainer, [Cameron](https://github.com/camc314), and a growing core team working on maintaining and improving the linter.

## Real-World Impact

We are extremely proud of the performance of Oxlint and its impact on real, large-scale codebases, which has led to reduced CI costs.

We are thankful for our [5,200 early adopters](https://github.com/oxc-project/oxc/network/dependents) and for companies and projects such as:

- **Shopify**, where the front-end platform team uses Oxlint in the Shopify admin console.
- **Airbnb**, where they use multi-file analysis [oxc/no-barrel-file](https://oxc.rs/docs/guide/usage/linter/rules/oxc/no-barrel-file.html) and [import/no-cycle](https://oxc.rs/docs/guide/usage/linter/rules/import/no-cycle.html) on their 126,000+ files, which completes in 7s on CI. ESLint's implementation of these rules times out.
- [**Mercedes-Benz**](https://www.mercedes-benz.io/blog/2025-05-16-how-can-modern-tooling-save-mercedes-benz-io-engineering-time), where they observed a 71% decrease in lint time when switching from ESLint to Oxlint, with some project seeing up to a 97% speedup.
- Large Open Source projects, from runtimes like [Bun](https://github.com/oven-sh/bun/blob/main/oxlint.json) to frameworks like [Preact](https://github.com/preactjs/preact/blob/main/oxlint.json).

On the largest repository we found, Oxlint reported:

```
Finished in 22.5s on 264925 files with 101 rules using 10 threads.
```

Based on real-world cases posted on [X](https://x.com/boshen_c/status/1928264877115597053) and [Bluesky](https://bsky.app/profile/boshen.github.io/post/3lqe47xi47c2e),
Oxlint runs at approximately 10,000 files per second, depending on the total number of threads used.

## Quick Start

Oxlint is perfect for developers who want to start linting their code without spending hours configuring tools. With zero setup required, you can start catching issues immediately:

**Run it, no config required.**

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

While no setup or configuration is needed, Oxlint is configurable via an `.oxlintrc.json` file, which is useful for larger projects or projects that require more customization.
This configuration format is based on ESLint v8’s flat config, making migration easy and familiar.
Each source file is linted with the nearest applicable configuration, and you can use overrides to target specific glob patterns.
You can also extend shared configs to keep teams consistent.

For projects already using ESLint, [oxlint-migrate](https://github.com/oxc-project/oxlint-migrate) can be used to migrate an existing ESLint flat-config file to Oxlint.
Additionally, [eslint-plugin-oxlint](https://npmx.dev/package/eslint-plugin-oxlint) can disable overlapping ESLint rules while both linters are used together.
It is recommended to run `oxlint && eslint` to benefit from Oxlint's faster feedback cycle.

For more detailed instructions on how to use Oxlint and integrate it with your project or editor, check out the [installation guide](https://oxc.rs/docs/guide/usage/linter).

## Versioning

Unlike libraries that ship runtime code, a linter only changes the diagnostics it returns. Oxlint adheres to semantic versioning:

- Patch releases: Bug fixes only.
- Minor releases: Expand rule coverage and diagnostics, without requiring configuration changes.
- Major releases: CLI or configuration changes, that may require migration.
  Note that minor releases can still break your CI if newly added rules uncover previously hidden issues. Learn more in our [Versioning guide](https://oxc.rs/docs/guide/usage/linter/versioning).

## Highlights

### Comprehensive Rule Coverage

Oxlint includes over 500 rules from various sources:

- Complete ESLint rule set, including TypeScript-specific rules from `typescript-eslint` (excluding type checked rules).
- Popular plugin rules from `eslint-plugin-unicorn`, `eslint-plugin-jsdoc`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-jest`, and `eslint-plugin-import`
- Unique Oxlint rules like [bad comparison sequence](https://oxc.rs/docs/guide/usage/linter/rules/oxc/bad-comparison-sequence), [const comparisons](https://oxc.rs/docs/guide/usage/linter/rules/oxc/const-comparisons), and [only used in recursion](https://oxc.rs/docs/guide/usage/linter/rules/oxc/only-used-in-recursion)

### Flexible Configuration

Configure Oxlint through `.oxlintrc.json` files with support for:

- Nested configurations that apply to specific directories
- Override patterns for targeting specific file types or locations
- Shared configuration extending for team consistency

### Editor Integration

First-class editor support with extensions for:

- [VS Code](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode)
- [IntelliJ IDEA and WebStorm](https://plugins.jetbrains.com/plugin/27061-oxc)
- [Zed Editor](https://zed.dev/extensions?query=oxc)
- Language server protocol support for other editors

### Helpful Diagnostics

Oxlint is built to deliver clear, actionable error messages - not just describing the issue, but visualizing it and suggesting how to fix it.

![CLI Demo](https://github.com/oxc-project/oxc/assets/1430279/094a3b24-0433-42ae-aad2-48a7dec2b985)
_Oxlint running in the terminal with detailed error reporting_

## Benchmark

Our [benchmark](https://github.com/oxc-project/bench-javascript-linter) reveals that Oxlint is around 50~100 times faster than ESLint with the same setup.

| Tool                   | Time     |
| ---------------------- | -------- |
| oxlint (multi thread)  | 615.3 ms |
| oxlint (single thread) | 1.840 s  |
| eslint                 | 33.481 s |

## Roadmap

Oxlint 1.0 is just the beginning! While it is stable, we still have important features and improvements planned for future releases:

**Custom Rules** – JavaScript plugin support is coming soon, enabling teams to write custom rules that integrate seamlessly with Oxlint's architecture.

**Performance Optimizations** – Continued improvements to parsing and analysis speed.

**Fine-grained (per-glob) configuration** - ESLint v9 configuration

## Acknowledgements

Oxlint 1.0 represents the collective effort of [over 200 contributors](https://github.com/oxc-project/oxc/graphs/contributors) who have shaped this project. We're grateful for every bug report, feature request, and code contribution.

Special recognition goes to:

- [@branchseer](https://github.com/branchseer) for implementing the multi-file analysis runtime.
- [@camc314](https://github.com/camc314), [@mysteryven](https://github.com/mysteryven), and [@shulaoda](https://github.com/shulaoda) for implementing many sophisticated lint rules, testing, and constantly improving everything.
- [@camchenry](https://github.com/camchenry) for implementing nested configuration support.
- [@DonIsaac](https://github.com/DonIsaac) for improving configuration, documentation and website, and for representing Oxc at [SquiggleConf 2024](https://2024.squiggleconf.com).
- [@leaysgur](https://github.com/leaysgur) for the RegExp parser and JSDoc plugin.
- [@Sysix](https://github.com/Sysix) for maintaining `eslint-plugin-oxlint` and significant contributions to the language server and VSCode extension.
- [@u9g](https://github.com/u9g) and [@rzvxa](https://github.com/rzvxa) for implementing control flow graph analysis.

## Join the Community

We'd love to hear your feedback on Oxlint and are excited to see how it helps improve your development workflow. Connect with us:

- **Discord**: Join our [community server](https://discord.gg/9uXCAwqQZW) for real-time discussions
- **GitHub**: Share feedback on [GitHub Discussions](https://github.com/oxc-project/oxc/discussions)
- **Issues**: Report bugs or request features on our [issue tracker](https://github.com/oxc-project/oxc/issues)

Your feedback drives Oxlint's evolution.

## Give It a Try

To get started, follow the [installation guide](https://oxc.rs/docs/guide/usage/linter), or learn more about the [Oxc project](https://oxc.rs/docs/guide/introduction).
