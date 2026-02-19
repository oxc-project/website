---
title: Configuration
description: Configure Oxlint using .oxlintrc.json or oxlint.config.ts.
---

# Configuration

Oxlint works out of the box, but most teams commit a configuration file (`.oxlintrc.json` or `oxlint.config.ts`) to keep linting consistent across local runs, editors, and CI.

This page focuses on project configuration: rules, categories, plugins, overrides, and shared settings.

## Create a config file

To generate a starter config in the current directory (JSON):

```sh
oxlint --init
```

Oxlint automatically looks for a `.oxlintrc.json` or `oxlint.config.ts` in the current working directory. You can also pass a config explicitly (note that this will disable nested config lookup):

```sh
oxlint -c ./oxlintrc.json
# or
oxlint --config ./oxlintrc.json
```

Notes:

- `.oxlintrc.json` supports comments (like jsonc).
- The configuration format aims to be compatible with ESLint v8's format (`eslintrc.json`).
- You can use either `.oxlintrc.json` or `oxlint.config.ts` in a directory, but not both.

A minimal configuration looks like this:

```json [.oxlintrc.json]
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "categories": {
    "correctness": "warn"
  },
  "rules": {
    "eslint/no-unused-vars": "error"
  }
}
```

### TypeScript config file (`oxlint.config.ts`)

Oxlint also supports a TypeScript configuration file named `oxlint.config.ts`.

```ts [oxlint.config.ts]
import { defineConfig } from "oxlint";

export default defineConfig({
  categories: {
    correctness: "warn",
  },
  rules: {
    "eslint/no-unused-vars": "error",
  },
});
```

Notes:

- The file must be named `oxlint.config.ts` (including when passed via `--config`).
- The default export must be an object and should be wrapped with `defineConfig` for typing.
- TypeScript configs require the Node-based `oxlint` package (JS runtime). If you're using a standalone binary, use `.oxlintrc.json` instead.
- TypeScript configs require a Node runtime that can execute TypeScript.

## Configuration file format

A configuration file is either a JSON object (`.oxlintrc.json`) or a TypeScript module that default-exports a config object (`oxlint.config.ts`). The most common top-level fields are:

- `rules`: Enable or disable rules, set severity, and configure rule options.
- `categories`: Enable groups of rules with similar intent.
- `plugins`: Enable built-in plugins that provide additional rules.
- `jsPlugins`: Configure JavaScript plugins (experimental).
- `overrides`: Apply different configuration to different file patterns.
- `extends`: Inherit configuration from other files.
- `ignorePatterns`: Ignore additional files from the config file.
- `env`: Enable predefined globals for common environments.
- `globals`: Declare custom globals as read-only or writable.
- `settings`: Plugin-wide configuration shared by multiple rules.

For a complete list of fields, see the [Config file reference](/docs/guide/usage/linter/config-file-reference.html).

## Configure rules

Rules are configured under `rules`.

A rule value is either:

- a severity (`"off"`, `"warn"`, `"error"`), or
- an array of `[severity, options]`

If a rule name is unique, you can configure it without a plugin prefix. For example, `no-console` is the same as `eslint/no-console`.

```json [.oxlintrc.json]
{
  "rules": {
    "no-alert": "error",
    "oxc/approx-constant": "warn",
    "no-plusplus": "off"
  }
}
```

### Severity values

Oxlint accepts ESLint-style severities:

- Allow rule: `"off"`, `0`, `"allow"`
- Warning on rule: `"warn"`, `1`
- Error on rule: `"error"`, `2`, `"deny"`

### Rule options

To configure rule options, use an array:

```json [.oxlintrc.json]
{
  "rules": {
    "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }]
  }
}
```

All available rules, and their configuration options, are listed in the [Rules reference](/docs/guide/usage/linter/rules).

### Override severity from the CLI

For quick experiments, you can adjust severity from the command line using:

- `-A` / `--allow`
- `-W` / `--warn`
- `-D` / `--deny`

Arguments are applied from left to right:

```sh
oxlint -D no-alert -W oxc/approx-constant -A no-plusplus
```

## Enable groups of rules with categories

Categories let you enable or disable sets of rules with similar intent. By default, Oxlint enables rules in the `correctness` category.

Configure categories using `categories`:

```json [.oxlintrc.json]
{
  "categories": {
    "correctness": "error",
    "suspicious": "warn",
    "pedantic": "off"
  }
}
```

Available categories include:

- `correctness`: Code that is definitely wrong or useless
- `suspicious`: Code that is likely to be wrong or useless
- `pedantic`: Extra strict rules that may have false positives
- `perf`: Rules that aim to improve runtime performance
- `style`: Idiomatic and consistent style rules
- `restriction`: Rules that ban specific patterns or features
- `nursery`: Rules under development that may change

You can also change categories from the CLI with the same `-A`, `-W`, and `-D` options:

```sh
oxlint -D correctness -D suspicious
```

## Configure plugins

Plugins extend the set of available rules.

Oxlint supports many popular plugins natively in Rust. This provides broad rule coverage without a large JavaScript dependency tree. See [Native Plugins](/docs/guide/usage/linter/plugins).

Configure plugins using `plugins`. Setting `plugins` overwrites the default plugin set, so the array should include everything you want enabled:

```json [.oxlintrc.json]
{
  "plugins": ["unicorn", "typescript", "oxc"]
}
```

To disable all default plugins:

```json [.oxlintrc.json]
{
  "plugins": []
}
```

For plugin details and CLI flags such as `--import-plugin`, see [Native Plugins](/docs/guide/usage/linter/plugins).

## Configure JS plugins (experimental)

Oxlint also supports JavaScript plugins via `jsPlugins`. This is intended for compatibility with existing ESLint plugins and advanced integrations.

Notes:

- JS plugins are experimental and not subject to semver.

JS plugins can be declared as strings, or as objects with an alias:

```json [.oxlintrc.json]
{
  "jsPlugins": [
    "eslint-plugin-playwright",
    { "name": "my-eslint-react", "specifier": "eslint-plugin-react" }
  ]
}
```

Some plugin names are reserved because they are implemented natively in Rust (for example `react`, `unicorn`, `typescript`, `oxc`, `import`, `jest`, `vitest`, `jsx-a11y`, `nextjs`). If you need the JavaScript version of a reserved plugin, give it a custom `name` to avoid conflicts.

For details, see [JS plugins](/docs/guide/usage/linter/js-plugins).

## Apply configuration by file pattern

Use `overrides` to apply different configuration to different files, such as tests, scripts, or TypeScript-only paths.

`overrides` is an array of objects. Each override can include:

- `files`: glob patterns
- `rules`: rule configuration (same shape as top-level `rules`)
- `env`: environment configuration (same shape as top-level `env`)
- `globals`: globals configuration (same shape as top-level `globals`)
- `plugins`: optionally change what plugins are enabled for this override
- `jsPlugins`: JS plugins for this override (experimental)

Example:

```json [.oxlintrc.json]
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "rules": {
    "no-console": "error"
  },
  "overrides": [
    {
      "files": ["scripts/*.js"],
      "rules": {
        "no-console": "off"
      }
    },
    {
      "files": ["**/*.{ts,tsx}"],
      "plugins": ["typescript"],
      "rules": {
        "typescript/no-explicit-any": "error"
      }
    },
    {
      "files": ["**/test/**"],
      "plugins": ["jest"],
      "env": {
        "jest": true
      },
      "rules": {
        "jest/no-disabled-tests": "off"
      }
    }
  ]
}
```

## Extend shared configs

Use `extends` to inherit from other configuration files.

Paths in `extends` are resolved relative to the configuration file that declares `extends`. Configs are merged from first to last, with later entries overriding earlier ones.

```json [.oxlintrc.json]
{
  "extends": ["./configs/base.json", "./configs/frontend.json"]
}
```

```ts [oxlint.config.ts]
import baseConfig from "./configs/base.ts";
import frontendConfig from "./configs/frontend.ts";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [baseConfig, frontendConfig],
});
```

## Configure environments and globals

Use `env` to enable predefined globals for common environments such as browser or node.

Use `globals` to declare project-specific globals, mark them writable or readonly, or disable a global that would otherwise be present.

```json [.oxlintrc.json]
{
  "env": {
    "es6": true
  },
  "globals": {
    "MY_GLOBAL": "readonly",
    "Promise": "off"
  }
}
```

`globals` accepts:

- `"readonly"` or `"readable"` or `false`
- `"writable"` or `"writeable"` or `true`
- `"off"` to disable a global

## Plugin settings

Use `settings` for plugin-wide configuration shared by multiple rules.

Example (monorepo + React + jsx-a11y):

```json [.oxlintrc.json]
{
  "settings": {
    "next": {
      "rootDir": "apps/dashboard/"
    },
    "react": {
      "linkComponents": [{ "name": "Link", "linkAttribute": "to" }]
    },
    "jsx-a11y": {
      "components": {
        "Link": "a",
        "Button": "button"
      }
    }
  }
}
```

## Next steps

- [Ignore files](/docs/guide/usage/linter/ignore-files): Ignore files and patterns, `.gitignore` and `.eslintignore` workflows, and symlink behavior.
- [Inline ignore comments](/docs/guide/usage/linter/ignore-comments): Inline suppressions and scoped exceptions.
- [Nested configs](/docs/guide/usage/linter/nested-config): Monorepos and per-package configuration.
- [Config file reference](/docs/guide/usage/linter/config-file-reference.html): Full schema and field documentation.
- [CLI reference](/docs/guide/usage/linter/cli.html): Complete list of flags and output formats.
