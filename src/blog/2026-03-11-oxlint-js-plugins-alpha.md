---
title: Oxlint JS Plugins Alpha
outline: deep
authors:
  - overlookmotel
  - cameron
---

<AppBlogPostHeader />

<br>

**JavaScript plugins for Oxlint have reached alpha - and we expect 80% of ESLint users can now switch to Oxlint and have it "just work".**

Oxlint already has over 650 popular lint rules implemented in Rust, running at native speed. JS plugins fill in the gaps - an ESLint-compatible plugin API, letting you run existing ESLint plugins and write your own custom rules, all within Oxlint. Native performance for most rules, full flexibility for the rest.

Since the [first technical preview](./2025-10-09-oxlint-js-plugins) last year, we've filled out almost the entire ESLint plugin API, added TypeScript plugin support, auto-fixes, IDE integration, and [major performance gains](#performance).

This means many teams can replace ESLint with Oxlint, without rewriting their lint rules.

This alpha release marks the point where we feel JS plugins are ready for adoption in real world projects.

Most projects should find that Oxlint can now act as a drop-in replacement for ESLint, with straightforward migration, and large reduction in linting time.

### Features

- Run most existing ESLint plugins without modification.
- Write your own custom lint rules in JavaScript or TypeScript.
- Get auto-fixes and suggestions from JS plugin rules.
- See JS plugin diagnostics live in your IDE via the language server.

### How reliable is it?

Oxlint JS plugins support is tested against the full test suite of ESLint itself, and also against a wide selection of ESLint plugins, including:

| Plugin                                                                                                  |  Tests | Pass rate |
| ------------------------------------------------------------------------------------------------------- | -----: | --------: |
| ESLint built-in rules                                                                                   | 33,006 |      100% |
| [React hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks) (including React Compiler rules) |  5,007 |      100% |
| [ESLint Stylistic](https://eslint.style/)                                                               | 18,310 |    99.99% |
| [Testing Library](https://www.npmjs.com/package/eslint-plugin-testing-library)                          | 17,016 |      100% |
| [SonarJS](https://www.npmjs.com/package/eslint-plugin-sonarjs)                                          |  3,951 |   99.6%\* |
| [e18e](https://www.npmjs.com/package/@e18e/eslint-plugin)                                               |    474 |    100%\* |

<small>\* excluding type-aware rules</small>

If a plugin isn't in the list above, it will very likely still work - it just isn't included in [our conformance test suite](https://github.com/oxc-project/oxc/tree/13606c3ab16cc273a6fad7e2de964ffa0ad0a241/apps/oxlint/conformance) yet.

ESLint's own tests cover the entire API surface, so a 100% pass rate gives us confidence that we've covered corner cases, as well as the happy path. Please try it out and let us know!

Oxlint is already used in production by many companies and projects, including [Midjourney](https://x.com/_chenglou/status/2026408795857981610), [Preact](https://github.com/preactjs/preact), [Posthog](https://github.com/PostHog/posthog), [Outline](https://github.com/outline/outline), and [Actual](https://github.com/actualbudget/actual).

### What it can't do (yet)

- Limited support for front-end frameworks' custom file formats (e.g. Svelte, Vue, Angular) - coming later this year.
- No custom type-aware rules (TypeScript-ESLint's rules are already built into Oxlint via [type-aware linting](../docs/guide/usage/linter/type-aware)).
- Some users have found the experience on Windows sub-par. Out of memory errors are [a known issue](https://github.com/oxc-project/oxc/issues/19395), specifically on Windows. We're working on it. In the meantime, if you hit this problem, we recommend running Oxlint in WSL, if that's an option.

You can follow our progress towards filling these gaps on the [tracking issue](https://github.com/oxc-project/oxc/issues/19918).

## Getting Started

Install `oxlint` as a dev dependency:

```sh
pnpm add -D oxlint
```

Add a script to `package.json`:

```json [package.json]
{
  "scripts": {
    "lint": "oxlint"
  }
}
```

Create a config file (or use [our migration tool](#migrating-from-eslint)):

```json [.oxlintrc.json]
{
  "jsPlugins": ["eslint-plugin-testing-library"],
  "rules": {
    "testing-library/no-render-in-lifecycle": "error"
  }
}
```

Lint your project:

```sh
pnpm run lint
```

### Migrating from ESLint

Most projects should find that migrating from ESLint is straightforward.

The simplest route is via the `@oxlint/migrate` tool.

```sh
npx @oxlint/migrate eslint.config.js
```

Or ask your coding agent to do it for you with the [`migrate-oxlint` skill](https://skills.sh/oxc-project/oxc/migrate-oxlint).

See the [migration guide](../docs/guide/usage/linter/migrate-from-eslint) for more details.

## ESLint rules

Oxlint already natively implements most of ESLint's built-in rules, rewritten in Rust, but not all rules are implemented yet.

To bridge this gap, we provide [oxlint-plugin-eslint](https://www.npmjs.com/package/oxlint-plugin-eslint), which contains all ESLint's built-in rules packaged as an Oxlint JS plugin.

This unlocks rules like `no-restricted-syntax` which are not yet implemented natively in Oxlint.

```jsonc [.oxlintrc.json]
{
  "jsPlugins": ["oxlint-plugin-eslint"],
  "rules": {
    // Note: "eslint-js" not "eslint"
    "eslint-js/no-restricted-syntax": [
      "error",
      {
        "selector": "ThrowStatement > CallExpression[callee.name=/Error$/]",
        "message": "Use `new` keyword when throwing an `Error`.",
      },
    ],
  },
}
```

Oxlint also implements a subset of rules from plugins like [eslint-plugin-jsdoc](https://www.npmjs.com/package/eslint-plugin-jsdoc) natively. For rules which aren't implemented in Oxlint itself, you can use the `eslint-plugin-jsdoc` package directly. This is the recommended pattern:

```jsonc [.oxlintrc.json]
{
  "jsPlugins": [
    // Set up an alias for the plugin "jsdoc-js"
    { "name": "jsdoc-js", "specifier": "eslint-plugin-jsdoc" },
  ],
  "rules": {
    // Use the alias to refer to rules from the plugin
    "jsdoc-js/check-examples": "error",
    "jsdoc-js/require-description": "error",
    // Use plain "jsdoc" for rules which Oxlint implements natively
    "jsdoc/require-property-name": "error",
    "jsdoc/require-property-description": "error",
  },
}
```

## Performance

Since the first technical preview, we have "Rustified" large chunks of the code powering JS plugins, which has delivered significant performance gains. In particular, plugins which rely on tokens APIs (e.g. ESLint Stylistic) are up to 5 times faster than before.

As a benchmark, we migrated Node.js's repo from ESLint to Oxlint. Node.js is a large project utilizing many custom lint rules, as well as several heavy ESLint plugins (98 JS lint rules in total).

| Linter | Time                 | Speed-up |
| ------ | -------------------- | -------- |
| ESLint | 1 minute, 43 seconds |          |
| Oxlint | 21 seconds           | 4.8x     |

<div>
<details>
<summary>Details</summary>

:::info

- [Benchmark repo](https://github.com/overlookmotel/node)
- 6298 files linted
- 104 built-in Oxlint rules (Rust)
- 75 rules from JS plugins (JS)
- 23 custom rules (JS)
- Benchmarked on Mac Mini M4, 48GB RAM, Node.js 24.14.0

- ESLint benchmark:

```sh
git checkout bench-eslint
npm ci
hyperfine -i --warmup 1 --runs 5 "node --run eslint"
```

- Oxlint benchmark:

```sh
git checkout bench-oxlint
npm ci
hyperfine -i --warmup 1 --runs 5 "node --run oxlint"
```

:::

</details>
</div>

Projects which currently use TypeScript-ESLint or `eslint-plugin-import` will likely see **much larger** performance gains. [One user in our Discord](https://discord.com/channels/1079625926024900739/1080712072012238858/threads/1478161352097796206) reported a 16x speed-up linting their company's 2 million line codebase when switching from ESLint to Oxlint, with heavy usage of JS plugins. Projects which use JS plugins more sparingly have reported speed gains of up to 100x.

### Future perf improvements

This is just the beginning!

While Oxlint with JS plugins is already significantly faster than ESLint, we have many more optimizations in the pipeline.

The key to Oxlint's JS plugin performance is a new, highly optimized, low-level mechanism for communicating between Rust and JS, which we call "raw transfer".

The Rust/JS boundary has always been the fundamental problem for native tooling supporting JS plugins. Native code is fast, but the cost of sending data back and forth between Rust and JS can be so high that it offsets that gain, resulting in mediocre performance overall.

Raw transfer reduces the cost of moving data between Rust and JS almost to zero, finally enabling native code and JS plugins to work effectively in tandem.

The first iteration of raw transfer is already at work under the hood of Oxlint, but we've only just begun leveraging what it can do. As we continue this work, we expect to see a further step-change in performance, bringing JS plugins close to native Rust performance.

If you're interested in the details, Oxc core team member [@overlookmotel](https://github.com/overlookmotel) gave [a talk at ViteConf 2025](https://www.youtube.com/watch?v=ofQV3xiBgT8) on this subject.

In short: Oxlint is already the fastest JS/TS linter in existence. It's going to get a lot faster.

### Perf tip 1: Use a formatter

We strongly recommend moving from using the linter for code formatting, to using [Oxfmt](../docs/guide/usage/formatter) (or your preferred formatter), if you can.

Oxfmt is 30x faster than Prettier, and will also dramatically reduce linting time vs linter plugins like ESLint Stylistic.

Oxlint and Oxfmt make a very strong team!

### Perf tip 2: Choose plugins wisely

Contrary to what many believe, it is perfectly possible to write extremely performant JavaScript code. Oxlint is not fast just because it's written in Rust - it's also carefully designed with performance in mind.

The code of JS plugins themselves is not under Oxlint's control. To get good performance out of Oxlint overall requires the JS plugins you select to perform well too.

If a plugin uses inefficient algorithms or performs a lot of filesystem operations, it'll be slow in ESLint, and slow in Oxlint too. What Oxlint _can_ do is provide a lightning-fast parser and performant APIs for plugins to interface with, but it can't magically make slow JS code faster.

We will in future provide a utility to diagnose which plugins/rules are the performance bottlenecks in your project, if you find that linting is not as fast as you'd like.

## Creating custom plugins

If your project has specific needs, it's simple to create a custom JS plugin for Oxlint.

Please see the [JS plugin guide](../docs/guide/usage/linter/js-plugins).

# FAQ

**Can Oxlint run ESLint plugins?**
Yes. Most plugins work without modification.

**Is Oxlint faster than ESLint?**
Yes. Benchmarks typically show 4x–100x speedups.

**Can I migrate gradually?**
Yes. You can run Oxlint alongside ESLint.

## Thanks to

Bringing JS plugins up to this milestone has been the work of many hands. In particular, we'd like to thank:

- [@Sysix](https://github.com/Sysix) for tireless work on the language server integration.
- [@lilnasy](https://github.com/lilnasy) for building out many of the APIs.

## Join the community

We'd love to hear your feedback on Oxlint JS plugins, and are excited to see how it helps improve your development workflow.

Connect with us:

- **Discord**: Join our [community server](https://discord.gg/9uXCAwqQZW) for real-time discussions
- **GitHub**: Share feedback on [GitHub Discussions](https://github.com/oxc-project/oxc/discussions)
- **Issues**: Report `oxlint` bugs to [oxc](https://github.com/oxc-project/oxc/issues).
