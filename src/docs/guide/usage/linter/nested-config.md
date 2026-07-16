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

`options.typeAware` and `options.typeCheck` are root-config-only. If either is set in a nested config file, Oxlint reports an error.

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
