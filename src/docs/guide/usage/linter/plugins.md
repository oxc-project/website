---
title: Built-in Plugins
description: Enable built in plugin rule sets and extend Oxlint with ESLint compatible JavaScript plugins.
---

# Built-in Plugins

Oxlint includes built-in implementations of many popular ESLint plugin rule sets. Most rules in the `recommended` configs are already implemented, so you can get useful results without extra setup.

Oxlint also supports plugins written in JavaScript with an ESLint-compatible API. See [JS Plugins](./js-plugins.md).

## What a plugin means in Oxlint

A plugin is a named group of rules. Enabling a plugin makes its rules available, and category flags control which rules are enabled and at what severity.

If you are migrating from ESLint, plugins map to the ecosystems you already know, such as import, react, jsx-a11y, jest, unicorn, and more.

## Enable a plugin

It is **strongly recommended** to use a config file to enable plugins, as it makes it considerably easier to manage and share with other developers on a project.

### Enable in a config file

You can also enable plugins in `.oxlintrc.json` using the `plugins` field:

```json [.oxlintrc.json]
{
  "plugins": ["import"]
}
```

Setting `plugins` **overwrites the default plugin set**. The list should include every plugin you want enabled.

### Enable with the CLI

You can also enable a plugin using a `--<plugin-name>-plugin` CLI flag.

Example, enable the import plugin:

```bash
oxlint --import-plugin
```

Once enabled, category flags determine what is turned on.

Example, enable import plugin rules in the correctness category as errors and suspicious as warnings:

```bash
oxlint --import-plugin -D correctness -W suspicious
```

Correctness rules are enabled by default.

Tip: run `oxlint --help` to see the full list of plugin flags.

## Disable default plugins

### Disable default plugins in a config file

To disable all default plugins in a config file, set `plugins` to an empty array:

```json [.oxlintrc.json]
{
  "plugins": []
}
```

This disables all default plugins and uses only the base rule set.

### Disable default plugins with the CLI

Several plugins are enabled by default. You can disable a default plugin with `--disable-<plugin-name>-plugin`.

Example, disable unicorn:

```bash
oxlint --disable-unicorn-plugin
```

Only default plugins support being disabled. Non-default plugins can simply be omitted.

## Supported plugins

This table lists the built-in plugins and where they come from.

| Plugin name  | Default | Source                                                                                                                                                  |
| ------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `eslint`     | Yes     | ESLint core rules                                                                                                                                       |
| `typescript` | Yes     | TypeScript rules from typescript-eslint (aka `@typescript-eslint/plugin`). Type-aware rules are available using [the type-aware mode](./type-aware.md). |
| `unicorn`    | Yes     | eslint-plugin-unicorn                                                                                                                                   |
| `react`      | No      | eslint-plugin-react and eslint-plugin-react-hooks                                                                                                       |
| `react-perf` | No      | eslint-plugin-react-perf                                                                                                                                |
| `nextjs`     | No      | @next/eslint-plugin-next                                                                                                                                |
| `oxc`        | Yes     | Oxc-specific rules and selected rules ported from deepscan                                                                                              |
| `import`     | No      | eslint-plugin-import (also equivalent to eslint-plugin-import-x)                                                                                        |
| `jsdoc`      | No      | eslint-plugin-jsdoc                                                                                                                                     |
| `jsx-a11y`   | No      | eslint-plugin-jsx-a11y                                                                                                                                  |
| `node`       | No      | eslint-plugin-n                                                                                                                                         |
| `promise`    | No      | eslint-plugin-promise                                                                                                                                   |
| `jest`       | No      | eslint-plugin-jest                                                                                                                                      |
| `vitest`     | No      | @vitest/eslint-plugin aka eslint-plugin-vitest                                                                                                          |
| `vue`        | No      | eslint-plugin-vue rules that work with script tags                                                                                                      |

For the current status of rule coverage, see the linter [product plan issue](https://github.com/oxc-project/oxc/issues/481).

## Adding new plugins

Oxlint focuses on supporting the ecosystem through built-in plugins and ESLint-compatible JavaScript plugins. [Contributions that add rules](/docs/contribute/linter/adding-rules) to existing built-in plugins are encouraged.

If you think a rule set should be implemented as a built-in plugin, please [open a GitHub discussion](https://github.com/oxc-project/oxc/discussions/new?category=feature-request) first.
