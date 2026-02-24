---
title: Quickstart
description: Install Oxlint and learn the common workflows.
---

# Quickstart

This page shows the recommended setup for Oxlint and the most common workflows, with copy-paste commands.

## Install

Install `oxlint` as a dev dependency:

::: code-group

```sh [npm]
$ npm add -D oxlint
```

```sh [pnpm]
$ pnpm add -D oxlint
```

```sh [yarn]
$ yarn add -D oxlint
```

```sh [bun]
$ bun add -D oxlint
```

:::

Add lint commands to `package.json`:

```json [package.json]
{
  "scripts": {
    "lint": "oxlint",
    "lint:fix": "oxlint --fix"
  }
}
```

Run it:

::: code-group

```sh [npm]
npm run lint
```

```sh [pnpm]
pnpm run lint
```

```sh [yarn]
yarn run lint
```

```sh [bun]
bun run lint
```

:::

Apply fixes:

::: code-group

```sh [npm]
npm run lint:fix
```

```sh [pnpm]
pnpm run lint:fix
```

```sh [yarn]
yarn run lint:fix
```

```sh [bun]
bun run lint:fix
```

:::

## Usage

For the complete list of options, see the [CLI reference](/docs/guide/usage/linter/cli.html).

```sh
oxlint [OPTIONS] [PATH]...
```

If `PATH` is omitted, Oxlint lints the current working directory.

## Common workflows

### Pre-commit with [lint-staged](https://github.com/lint-staged/lint-staged)

::: code-group

```json [npm]
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx,mjs,cjs}": "npm run lint"
  }
}
```

```json [pnpm]
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx,mjs,cjs}": "pnpm run lint"
  }
}
```

```json [yarn]
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx,mjs,cjs}": "yarn run lint"
  }
}
```

```json [bun]
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx,mjs,cjs}": "bun run lint"
  }
}
```

:::

### Create a config file

Initialize the `.oxlintrc.json` config with default values:

```sh
oxlint --init
```

Then customize `.oxlintrc.json` as needed. See [Configuration](/docs/guide/usage/linter/config).

Alternatively, Oxlint supports a TypeScript config file named `oxlint.config.ts`. See [Configuration](/docs/guide/usage/linter/config#typescript-config) for details.

Then run Oxlint:

```sh
oxlint
```

::: tip
If you are migrating from ESLint, see [the "Migrate from ESLint" page](/docs/guide/usage/linter/migrate-from-eslint) for detailed guidance on migrating.
:::

### Fix problems

Apply safe fixes:

```sh
oxlint --fix
```

Apply suggestions (may change program behavior):

```sh
oxlint --fix-suggestions
```

Apply dangerous fixes and suggestions:

```sh
oxlint --fix-dangerously
```

See [Automatic fixes](/docs/guide/usage/linter/automatic-fixes) for guidance on when to use each mode.

### Ignore files

Use an explicit ignore file:

```sh
oxlint --ignore-path .oxlintignore
```

Add ignore patterns from the command line:

```sh
oxlint --ignore-pattern "dist/**" --ignore-pattern "*.min.js"
```

Disable ignore handling:

```sh
oxlint --no-ignore
```

See [Ignore files](/docs/guide/usage/linter/ignore-files).

### Fail CI reliably

Only report errors:

```sh
oxlint --quiet
```

Fail if any warnings are found:

```sh
oxlint --deny-warnings
```

Fail if warnings exceed a threshold:

```sh
oxlint --max-warnings 0
```

See [CI setup](/docs/guide/usage/linter/ci).

### Use machine-readable output

Select an output format:

```sh
oxlint -f json
```

Available formats include: `default`, `json`, `unix`, `checkstyle`, `github`, `gitlab`, `junit`, `stylish`.

### Inspect the effective configuration

Print the configuration that would be used for a file:

```sh
oxlint --print-config path/to/file.ts
```

### List available rules

List registered rules, including those enabled by your current oxlint config:

```sh
oxlint --rules
```

The full list is in the [Rules reference](/docs/guide/usage/linter/rules).

## Next steps

- Configure rules, plugins, and ignores: [Configuration](/docs/guide/usage/linter/config)
- [Setup editors](/docs/guide/usage/linter/editors)
- [Setup CI](/docs/guide/usage/linter/ci)
- Learn advanced features: [Multi-file analysis](/docs/guide/usage/linter/multi-file-analysis), [Type-aware linting](/docs/guide/usage/linter/type-aware), [JS plugins](/docs/guide/usage/linter/js-plugins)
- Migrate: [From ESLint](/docs/guide/usage/linter/migrate-from-eslint) <!-- , [From Biome](/docs/guide/usage/linter/migrate-from-biome) -->
- [CLI reference](/docs/guide/usage/linter/cli)
