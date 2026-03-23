---
title: Ignores
description: Control which files Oxlint lints.
---

# Ignore files

Large repositories contain files that should not be linted, such as build output, vendored code, snapshots, or generated artifacts. Oxlint provides a predictable ignore model that works well in monorepos and CI.

> [!TIP]
> It is strongly recommended to use `"ignorePatterns"` in your Oxlint config file (`.oxlintrc.json` or `oxlint.config.ts`) for ignoring files rather than a separate ignore file. This ensures that every developer will have the same ignores across all tools and commands running Oxlint, especially IDE/editor integrations. It also keeps your configuration centralized to one file.

## Default ignores

Oxlint automatically ignores:

- `.git` directories
- Minified files containing `.min.`, `-min.`, or `_min.` in the file name
- Files matched by `.gitignore` (global gitignore files are not respected)

Hidden files are not automatically ignored.

## `ignorePatterns`

The recommended approach is to define ignores in your config file using `ignorePatterns`. This keeps ignores close to the configuration they belong to and works naturally with nested configs.

Patterns are resolved relative to the configuration file.

::: code-group

```json [.oxlintrc.json]
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "ignorePatterns": ["dist/**", "coverage/**", "vendor/**", "test/snapshots/**"]
}
```

```ts [oxlint.config.ts]
import { defineConfig } from "oxlint";

export default defineConfig({
  ignorePatterns: ["dist/**", "coverage/**", "vendor/**", "test/snapshots/**"],
});
```

:::

In monorepos, nested configs can ignore package specific output without affecting the rest of the repository.

## `.eslintignore`

Oxlint also supports `.eslintignore` for compatibility with existing ESLint setups. Existing `.eslintignore` files can remain in place during migration. The syntax is compatible with `.gitignore`, including comments and negation patterns.

New projects should prefer `"ignorePatterns"` in their config file, and we strongly recommend moving over to `"ignorePatterns"` soon after migrating, if not during migration.

## Ignore from the command line

CLI flags are useful for one-off changes in CI or local debugging.

Use a custom ignore file:

```bash
oxlint --ignore-path path/to/ignorefile
```

Add additional ignore patterns:

```bash
oxlint --ignore-pattern 'dist/**' --ignore-pattern 'coverage/**'
```

Quote patterns to avoid shell glob expansion.

## Unignoring files

Ignore files support negation patterns, which allow a directory to be ignored while keeping specific files.

To ignore everything under `build/` except one file, ignore the contents rather than the directory itself:

::: code-group

```json [.oxlintrc.json]
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "ignorePatterns": ["build/**/*", "!build/keep.js"]
}
```

```ts [oxlint.config.ts]
import { defineConfig } from "oxlint";

export default defineConfig({
  ignorePatterns: ["build/**/*", "!build/keep.js"],
});
```

:::

This keeps traversal possible while still ignoring almost everything.

## Disable ignoring

To disable all ignore behavior, including ignore files and CLI ignore options, use `--no-ignore`:

```bash
oxlint --no-ignore
```
