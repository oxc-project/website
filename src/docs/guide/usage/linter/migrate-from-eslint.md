# Migrate from ESLint

This guide is for existing JavaScript and TypeScript projects that currently use ESLint and want to migrate to Oxlint.

## Overview

Oxlint and ESLint share similar configuration concepts, but they differ in supported rules and config formats.

Oxlint already supports more than 650 rules from ESLint core and various popular plugins. We intend to support nearly all existing ESLint core rules, and this work is ongoing.

When migrating, expect the following:

- Most ESLint core rules and popular plugin rules are supported
- Some rules may not yet be available
- ESLint configuration files must be converted to Oxlint’s config format
- Oxlint is designed for incremental adoption; a full migration is not required upfront
- Oxlint's JS Plugins allow usage of ESLint plugins that are not implemented natively by Oxlint

## Migrate with Skills

You can migrate interactively using the [`migrate-oxlint`](https://skills.sh/oxc-project/oxc/migrate-oxlint) skill:

```bash
npx skills add https://github.com/oxc-project/oxc --skill migrate-oxlint
```

Once installed, run `/migrate-oxlint` and the agent will walk you through the full migration.

## Migrating from an ESLint flat config

If your project uses an ESLint v9/v10 flat config (e.g. `eslint.config.js` or `eslint.config.mjs`), you can migrate automatically using [`@oxlint/migrate`](https://npmx.dev/package/@oxlint/migrate).

### Run the migration tool

From the project root:

```bash
npx @oxlint/migrate <optional-eslint-flat-config-path>
```

This command:

- Reads your ESLint flat config file
- Converts supported rules to an Oxlint config
- Preserves rule severities and options
- Preserves file and path-specific overrides to allow different rulesets for different parts of a repo
- Converts `globals` (e.g. `...globals.browser`) to equivalent `env` and `globals` values
- Preserves root `ignore` patterns for ignoring specific paths/files

The generated `.oxlintrc.json` config can be edited manually after migration.

`.eslintignore` files will be respected by Oxlint and can be left in place during migration, but we recommend moving the contents to the `"ignorePatterns"` field in `.oxlintrc.json` after migrating. Files/paths ignored via a repo's `.gitignore` file will also be respected by Oxlint automatically.

See the list of [available options](https://github.com/oxc-project/oxlint-migrate?tab=readme-ov-file#options) for more details.

### Type-Aware TypeScript rules

If your ESLint setup uses `typescript-eslint` with type-aware rules, you can pass the `--type-aware` flag:

```bash
npx @oxlint/migrate --type-aware
```

This ensures the generated Oxlint config includes type-aware rules.

Note that type-aware linting requires [oxlint-tsgolint](https://github.com/oxc-project/tsgolint), and is based on the TypeScript native rewrite (aka TypeScript 7), but should be possible to adopt in most TypeScript projects without too much upgrade work.

For further information on Oxlint's type-aware support, see [the Type-Aware Linting page](/docs/guide/usage/linter/type-aware).

### JavaScript plugins

If your ESLint config uses plugins that are not supported natively by Oxlint, you can retain them using JavaScript plugins. `@oxlint/migrate` will migrate these plugins for you by default.

This allows you to continue using those rules via Oxlint alongside the native rules/plugins. The JS Plugins functionality does not support all ESLint plugins, but Oxlint's JavaScript plugin system covers a vast majority of the ESLint v9 API and is actively being improved. Most ESLint plugins covering JavaScript/TypeScript code should work in Oxlint without problems.

If you do not want to migrate your ESLint plugins to use as JS Plugins, you can pass `--js-plugins=false`.

For more information on JavaScript Plugins, see [the JS Plugins page](/docs/guide/usage/linter/js-plugins).

#### Local custom ESLint plugins

If you use local custom ESLint plugins from within your own repo (e.g. `import pluginMyCompany from './eslint-plugin-my-company/lib/index.js'`), these will not be migrated automatically by `@oxlint/migrate` right now.

However, they can be added manually to the Oxlint config file after running the migration script:

::: code-group

```json [.oxlintrc.json]
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "jsPlugins": ["./eslint-plugin-company/lib/index.js"]
}
```

```ts [oxlint.config.ts]
import { defineConfig } from "oxlint";

export default defineConfig({
  jsPlugins: ["./eslint-plugin-company/lib/index.js"],
});
```

:::

## Running Oxlint and ESLint together

If not all required rules are available in Oxlint, you can run Oxlint and ESLint side by side.

A common setup is:

1. Enable Oxlint for all supported rules
2. Keep ESLint for unsupported rules
3. Disable overlapping rules in ESLint

Because Oxlint is significantly faster than ESLint, it is recommended to run Oxlint first to catch errors early, then fall back to ESLint only if needed.

For example:

```bash
oxlint && eslint
```

### Disabling overlapping rules in ESLint

You can use [`eslint-plugin-oxlint`](https://npmx.dev/package/eslint-plugin-oxlint) to disable ESLint rules that are already handled by Oxlint:

```bash
npm install --save-dev eslint-plugin-oxlint
```

This reduces duplicate diagnostics, can help cut down your linting time considerably, and allows ESLint to focus only on rules that Oxlint does not yet support.

Long-term - once remaining important rules have been added in Oxlint - we strongly recommend moving fully to Oxlint to simplify your setup and reduce the number of dependencies for your project.

## Migrating from legacy ESLint (v8.x) configs

If your project uses ESLint v8.x with legacy config files (such as `.eslintrc.js` or `.eslintrc.json`), they cannot be migrated automatically by `@oxlint/migrate`.

In some cases, you can [migrate them automatically to an ESLint flat config with `@eslint/migrate-config`](https://npmx.dev/package/@eslint/migrate-config) first, and _then_ to Oxlint using `@oxlint/migrate`.

The "legacy" ESLint v8.x configuration file shape maps closely to Oxlint’s config format, so for simple setups most rules and options can be translated directly.

## Rule/plugin support

You may have specific rules that you rely on in ESLint that are not yet ported to Oxlint.

Almost all rules from our supported plugins will be ported - and a majority already have been. For those that will not be ported, some rules are deprecated in the original plugins, or have alternatives implemented already.

You can check the [meta issue](https://github.com/oxc-project/oxc/issues/481) for rule/plugin implementation status to see if the rules you rely on are planned for implementation, or if they have already been implemented by other, equivalent rules.

For plugins that are not implemented natively in Oxlint, it is recommended to use [JS Plugins](/docs/guide/usage/linter/js-plugins).
