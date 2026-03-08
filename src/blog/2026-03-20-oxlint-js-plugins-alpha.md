---
title: Oxlint JS Plugins Alpha
outline: deep
authors:
  - overlookmotel
  - cameron
---

<AppBlogPostHeader />

<br>

**We're excited to announce the alpha release of JavaScript plugins for Oxlint!**

For a long time, users have asked for a way to customize the behavior of Oxlint.

Last year, we released the first technical preview of our solution - support for Oxlint plugins written in Javascript, _and_ compatible with ESLint's plugin API.

However, that initial preview was incomplete. Many APIs were not implemented yet.

Since then, we've been working hard on filling out the whole API surface, ramping up performance, and thoroughly testing the implementation with popular ESLint plugins. At this point, we feel it's ready to try out in real world projects.

We expect 80% of users will find they are now able to switch from ESLint to Oxlint and it should "just work".

Oxlint supports over 600 popular rules re-implemented in Rust, which run at native speed. JS plugins aim to "fill in the gaps" where Oxlint does not yet support all the rules users need. The combination of raw native performance for the majority of lint rules, and the flexibility of JS plugins for the rest, aims to make Oxlint "the best of both worlds".

Many projects have seen significant performance improvements switching from ESLint to Oxlint. See [performance](#performance) section below.

### What you can do

Oxlint now supports:

- Running most existing ESLint plugins without modification.
- Writing your own custom lint rules in Javascript or TypeScript.

Since the first technical preview, we have:

- Implemented almost the entirety of ESLint's plugin API.
- Added support for plugins written in TypeScript.
- Linked JS plugins into the language server, for immediate feedback in your IDE.
- Greatly improved performance.

### How reliable is it?

Oxlint JS plugins support is tested against the full test suite of ESLint itself, and also against a wide selection of ESLint plugins, including:

- ESLint built-in rules: 33,000 tests, 100% pass.
- [React hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks) (including React Compiler rules): 5,000 tests, 100% pass.
- [ESLint Stylistic](https://eslint.style/): 18,000 tests, 99.99% pass.
- [Testing Library](https://www.npmjs.com/package/eslint-plugin-testing-library): 17,000 tests, 100% pass.
- [SonarJS](https://www.npmjs.com/package/eslint-plugin-sonarjs): 4,000 tests, 99.6% pass (excluding type-aware rules).
- [e18e](https://www.npmjs.com/package/@e18e/eslint-plugin): 500 tests, 100% pass (excluding type-aware rules).

Just because a plugin isn't included in the list above, doesn't mean it doesn't work. Most likely we just haven't tested it yet. ESLint's own tests cover the entire API surface, so a 100% pass rate gives us confidence that we've covered corner cases, as well as the happy path. Please try it out and let us know!

### What it can't do (yet)

- Limited support for front-end frameworks' custom file formats (e.g. Svelte, Vue, Angular) - coming later this year.
- No custom type-aware rules (TypeScript ESLint's rules are supported via [type-aware linting](../docs/guide/usage/linter/type-aware)).
- Some users have found the experience on Windows sub-par. Out of memory errors are a known issue, specifically on Windows. We're working on it. In the meantime, if you hit this problem, we recommend running Oxlint in WSL, if that's an option.

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

If migrating from ESLint, the simplest route is via the `@oxlint/migrate` tool.

```sh
npx @oxlint/migrate eslint.config.js
```

See the [migration guide](../docs/guide/usage/linter/migrate-from-eslint) for more details.

Or manually create a config file:

```json [.oxlintrc.json]
{
  "jsPlugins": ["eslint-plugin-react-hooks"],
  "rules": {
    "react-hooks/error-boundaries": "error"
  }
}
```

Lint your project:

```sh
pnpm run lint
```

## ESLint rules

Oxlint already natively implements most of ESLint's built-in rules, rewritten in Rust, but there are gaps in support.

For this purpose, we provide [oxlint-plugin-eslint](https://www.npmjs.com/package/oxlint-plugin-eslint), which contains all ESLint's built-in rules packaged as an Oxlint JS plugin.

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

Oxlint also implements a subset of rules from plugins like [eslint-plugin-jsdoc](https://www.npmjs.com/package/eslint-plugin-jsdoc) natively, but there are gaps. To use a rule from `eslint-plugin-jsdoc` package directly, this is the recommended pattern:

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

When migrating from ESLint, `@oxlint/migrate` will automatically set up any such rules in your config to run as JS plugins.

## Performance

Since the first technical preview, we have "Rustified" large chunks of the code powering JS plugins, which has delivered significant performance gains. In particular, plugins which rely on tokens APIs (e.g. ESLint Stylistic) are up to 5 times faster than before.

As a benchmark, we migrated Node.js's repo from ESLint to Oxlint. Node.js is a large project utilizing many custom lint rules, as well as several heavy ESLint plugins.

| Linter | Time                 | Speed-up |
| ------ | -------------------- | -------- |
| ESLint | 1 minute, 43 seconds |          |
| Oxlint | 21 seconds           | 4.8x     |

<div>
<details>
<summary>Details</summary>

:::info

- Benchmark repo: https://github.com/overlookmotel/node
- Benchmarked on Mac Mini M4, 48GB RAM

- ESLint benchmark:

```sh
git checkout bench-eslint
hyperfine -i --warmup 1 --runs 5 "node --run eslint"
```

- Oxlint benchmark:

```sh
git checkout bench-oxlint
hyperfine -i --warmup 1 --runs 5 "node --run oxlint"
```

:::

</details>
</div>

Projects which currently use TypeScript-ESLint will likely see **much larger** performance gains. Gains of up to 100x have been reported.

TODO: Examples of perf gains

However, this is just the beginning!

While Oxlint with JS plugins is already significantly faster than ESLint, we still have many optimizations in the pipeline.

The basis of Oxlint's performance in running JS plugins is our "secret weapon" - a new, highly optimized, low-level API for communicating between Rust and JS, which we call "raw transfer". This technique completely destroys the traditional language barrier, reducing the cost of moving data between the "two worlds" of JS and Rust almost to zero.

This barrier has always been the fundamental problem for native tooling supporting JS plugins. The native code may well run at the speed of light, but the cost of sending data back and forth to JS is so high that it can offset much of that gain. We believe that we have finally solved this problem.

The first iteration of "raw transfer" is already at work under the hood of Oxlint. But we've only just begun leveraging what it can do. As we continue this work, we expect to achieve a leap in performance which will astonish many who say that it's impossible to make Javascript run fast. We believe we can achieve the seemingly impossible - bring JS plugins up to _almost_ the same level of performance as Rust.

If you're interested in the nerdy details, core team member [@overlookmotel](https://github.com/overlookmotel) gave [a talk at ViteConf 2025](https://www.youtube.com/watch?v=ofQV3xiBgT8) on the subject.

In short: Oxlint is already the fastest JS/TS linter in existence. It's going to get a lot faster.

### Perf tip 1: Use a formatter

We strongly recommend moving from using the linter for code formatting, to using a dedicated formatter, if you can.

A dedicated formatter written in a native language will be an order of magnitude faster than linter plugins like ESLint Stylistic.

Obviously, we would recommend [Oxfmt](../docs/guide/usage/formatter)! Oxlint and Oxfmt make a very strong team.

### Perf tip 2: Choose plugins wisely

Contrary to what many believe, it is perfectly possible to write extremely performant Javascript code. Oxlint is not fast just because it's written in Rust, it's also carefully designed with performance in mind.

The code of JS plugins you select to use in your project is not under Oxlint's control, and to get good performance out of Oxlint overall requires the JS code you ask Oxlint to run to perform well too.

If a plugin uses inefficient algorithms or, for example, performs a lot of filesystem operations, it'll likely be slow in ESLint, and it will be slow in Oxlint too. What Oxlint _can_ do is provide a lightning-fast parser and performant APIs for plugins to interface with, but it can't magically make slow JS code faster.

We will in future provide a utility to diagnose which plugins/rules are the performance bottlenecks in your project, if you find linting is not as fast as you'd like.

## Creating custom plugins

TODO

## Thanks to

Bringing JS plugins up to this milestone has been the work of many hands. In particular, we'd like to thank:

- [@Sysix](https://github.com/Sysix) for tireless work on the language server integration.
- [@lilnasy](https://github.com/lilnasy) for building out many of the APIs.

## Join the Community

We'd love to hear your feedback on `oxlint` and JS plugins and are excited to see how it helps improve your development workflow.

Connect with us:

- **Discord**: Join our [community server](https://discord.gg/9uXCAwqQZW) for real-time discussions
- **GitHub**: Share feedback on [GitHub Discussions](https://github.com/oxc-project/oxc/discussions)
- **Issues**: Report `oxlint` bugs to [oxc](https://github.com/oxc-project/oxc/issues).
