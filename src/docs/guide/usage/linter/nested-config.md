---
title: "Nested configuration files | Oxlint"
description: Use multiple configuration files to apply different Oxlint settings to different parts of a repository.
---

# Nested configuration files

Oxlint can use multiple configuration files in the same repository. It automatically detects configuration files named `.oxlintrc.json`, `.oxlintrc.jsonc`, `oxlint.config.ts`, or `oxlint.config.mts` and applies them based on where files live in the directory tree.

This is useful in monorepos where packages need their own settings, while still keeping a shared baseline.

If you only need to exclude files or folders, use [Ignores](./ignore-files) instead.

## How it works

For each file being linted, Oxlint uses the nearest config file (e.g. `.oxlintrc.json` or `oxlint.config.ts`) relative to that file.

Given the following structure:

```
my-project/
├── .oxlintrc.json
├── src/
│   ├── index.js
├── package1/
│   ├── oxlint.config.ts
│   └── index.js
└── package2/
    ├── .oxlintrc.json
    └── index.js
```

Configuration resolution works as follows:

- `src/index.js` uses `my-project/.oxlintrc.json`
- `package1/index.js` uses `my-project/package1/oxlint.config.ts`
- `package2/index.js` uses `my-project/package2/.oxlintrc.json`

## What to expect

Configuration files are not automatically merged. A config in a child directory does not affect the parent config.

Command line options override configuration files, regardless of whether they come from a parent or child directory.

Passing an explicit config file location using `-c` or `--config` disables nested config lookup, and Oxlint will only use that single configuration file.

You can also disable nested configs with the `--disable-nested-config` flag.

## Linter options in nested configs

Most `options` are resolved per file, from the config that governs it, falling back to the root config when the nested config leaves them unset:

- `options.typeAware` — type-aware linting is enabled only for the files the config governs. This lets a single package in a monorepo opt into type-aware rules without slowing down the rest of the repository.
- `options.reportUnusedDisableDirectives`
- `options.respectEslintDisableDirectives`

CLI flags and editor settings still take precedence over every config, and apply to every file. `oxlint --type-aware` runs type-aware linting on the whole repository, including the packages whose config does not set `options.typeAware`.

Two options cannot be scoped to a directory:

- `options.denyWarnings` and `options.maxWarnings` decide the exit code of the whole run. They are only supported in the root config. Setting either in a nested config prints a warning and ignores that option; the rest of the config still applies.
- `options.typeCheck` is reported per run by `tsgolint`, not per directory. Setting it in a nested config enables type checking for the whole run, and prints a warning saying so. It belongs in the root config.

### Type-aware linting for a single package

```
my-project/
├── .oxlintrc.json
├── package1/
│   ├── .oxlintrc.json
│   └── index.ts
└── package2/
    └── index.ts
```

::: code-group

```json [my-project/.oxlintrc.json]
{
  "rules": {
    "no-debugger": "error"
  }
}
```

```json [my-project/package1/.oxlintrc.json]
{
  "extends": ["../.oxlintrc.json"],
  "plugins": [],
  "options": {
    "typeAware": true
  },
  "rules": {
    "typescript/no-floating-promises": "error"
  }
}
```

:::

`package1/index.ts` is linted with type-aware rules, `package2/index.ts` is not.

## Monorepo pattern: share a base config with extends

In a monorepo, you often want one shared baseline at the root, and small package specific adjustments.

You do this by keeping a root config file (either `.oxlintrc.json` or `oxlint.config.ts`), then having package configs extend it.

::: code-group

```json [my-project/.oxlintrc.json]
{
  "rules": {
    "no-debugger": "error"
  }
}
```

```ts [my-project/oxlint.config.ts]
import { defineConfig } from "oxlint";

export default defineConfig({
  rules: {
    "no-debugger": "error",
  },
});
```

:::

::: code-group

```json [my-project/package1/.oxlintrc.json]
{
  "extends": ["../.oxlintrc.json"],
  "rules": {
    "no-console": "off"
  }
}
```

```ts [my-project/package1/oxlint.config.ts]
import baseConfig from "../oxlint.config.ts";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [baseConfig],
  rules: {
    "no-console": "off",
  },
});
```

:::

This keeps the shared baseline in one place and makes package configs small and focused.

## Extending configuration files

A config can reuse settings from other configs using `extends`.

In `.oxlintrc.json`, `extends` is an array of file paths, resolved relative to the config file that declares them. Extended files can have any name. They do not need to be named `.oxlintrc.json`, as long as they are valid JSON configuration files. Package imports are not supported in the `.oxlintrc.json` format.

In `oxlint.config.ts`, import the config objects you want to extend and pass them to `extends` (file paths are not supported). The imported files can have any name; only the entry config that Oxlint loads must be auto-discoverable (`oxlint.config.ts` or `oxlint.config.mts`) or passed via `--config`. Use a TypeScript config when extending config objects imported from a shared package.

Example:

::: code-group

```json [oxlint-typescript.json]
{
  "plugins": ["typescript"],
  "rules": {
    "typescript/no-explicit-any": "error"
  }
}
```

```ts [oxlint-typescript.config.ts]
import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["typescript"],
  rules: {
    "typescript/no-explicit-any": "error",
  },
});
```

:::

::: code-group

```json [.oxlintrc.json]
{
  "extends": ["oxlint-typescript.json"],
  "rules": {
    "no-unused-vars": "warn"
  }
}
```

```ts [oxlint.config.ts]
import typescriptConfig from "./oxlint-typescript.config.ts";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [typescriptConfig],
  rules: {
    "no-unused-vars": "warn",
  },
});
```

:::

Shared packages work the same way in `oxlint.config.ts`:

```ts [oxlint.config.ts]
import sharedConfig from "@example-org/oxlint-config";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [sharedConfig],
});
```

Only some properties can be extended. The supported properties are:

- `rules`
- `plugins`
- `overrides`

### How `plugins` merges

Each config in an `extends` chain contributes its `plugins` list, and the result is the union of all contributions. A config that does not declare `plugins` contributes the default plugins instead.

This means extending a config with a narrower `plugins` list than the defaults is not enough on its own: if the extending config omits `plugins`, the defaults are added back on top of the extended list.

To inherit exactly the plugins of the extended config, declare an empty array:

::: code-group

```json [.oxlintrc.json]
{
  "extends": ["./base.json"],
  "plugins": []
}
```

```ts [oxlint.config.ts]
import baseConfig from "./base.config.ts";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [baseConfig],
  plugins: [],
});
```

:::

The empty array is an empty contribution, so the result is exactly the plugins declared by `base.json`. Declaring a non-empty list works the same way: the union of that list and the extended lists, with the defaults only appearing if some config in the chain omits `plugins`.

This is the same mechanism as [disabling the default plugins](./plugins) with `"plugins": []` in a standalone config: an explicit array replaces the config's default contribution.
