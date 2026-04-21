---
title: Configuration
description: Configure Oxfmt using a .oxfmtrc.json file.
---

# Configuration

Oxfmt works out of the box, but most teams commit a configuration file to keep formatting consistent across local runs, editors, and CI.

This page focuses on project configuration: formatting options, ignore patterns, and experimental features.

## Create a config file

To generate a starter config in the current directory:

```sh
oxfmt --init
```

Oxfmt automatically looks for the following files starting from the directory of the file being formatted and walking up the tree:

- `.oxfmtrc.json`
- `.oxfmtrc.jsonc`
- `oxfmt.config.ts`

The nearest config file to each formatted file wins. This means you can place different config files at different levels of your project tree.
For example, a root config for the whole repo and a more specific one inside a subdirectory:

```
my-repo/
├── oxfmt.config.ts         # default for the whole repo
├── src/
│   └── app.ts              # uses root config
└── packages/
    └── fancy-app/
        ├── .oxfmtrc.json   # overrides for this package
        └── index.ts        # uses packages/fancy-app/.oxfmtrc.json
```

If you don't need nested config, pass `--disable-nested-config` to only look upward from the current working directory. This is faster because Oxfmt can resolve the config once instead of per file.

You can also pass a config explicitly with `-c`, which also disables nested config lookup. This accepts any supported format (`.json`, `.jsonc`, `.ts`, `.mts`, `.cts`, `.js`, `.mjs`, `.cjs`):

```sh
oxfmt -c path/to/yourconfig.json
```

A minimal JSON configuration looks like this:

```json [.oxfmtrc.json]
{
  "$schema": "./node_modules/oxfmt/configuration_schema.json",
  "printWidth": 80
}
```

JavaScript / TypeScript config files use a default export. `defineConfig` is optional but gives you type checking and editor autocomplete:

```ts [oxfmt.config.ts]
import { defineConfig } from "oxfmt";

export default defineConfig({
  printWidth: 80,
});
```

## Configuration file format

A configuration file is a JSON object. The most common top-level fields are:

- `printWidth`: Line width limit (default: 100)
- `tabWidth`: Spaces per indentation level (default: 2)
- `useTabs`: Use tabs instead of spaces (default: false)
- `semi`: Add semicolons (default: true)
- `singleQuote`: Use single quotes (default: false)
- `trailingComma`: Trailing commas in multi-line structures (default: "all")
- `ignorePatterns`: Glob patterns to exclude from formatting
- `sortImports`: Configure import sorting (disabled by default)
- `sortTailwindcss`: Configure Tailwind class sorting (disabled by default)
- `sortPackageJson`: Configure package.json sorting (enabled by default)

For a complete list of fields, see the [Config file reference](./config-file-reference).

## JSON schema

Add a `$schema` field for editor validation and autocomplete:

```json [.oxfmtrc.json]
{
  "$schema": "./node_modules/oxfmt/configuration_schema.json"
}
```

## `.editorconfig`

Oxfmt reads these `.editorconfig` properties:

- `end_of_line` → `endOfLine`
- `indent_style` → `useTabs`
- `indent_size` → `tabWidth`
- `max_line_length` → `printWidth`
- `insert_final_newline` → `insertFinalNewline`

Both root section and glob-based overrides are supported.

```
[*]
indent_size = 4

[*.{js,ts}]
indent_size = 2
```

Oxfmt uses only the nearest `.editorconfig` from the current directory:

- `root = true` is not respected
- Nested `.editorconfig` files are not merged

## Overrides

Use the `overrides` field to apply different formatting options to specific files:

::: code-group

```json [.oxfmtrc.json]
{
  "printWidth": 100,
  "overrides": [
    {
      "files": ["*.test.js", "*.spec.ts"],
      "options": {
        "printWidth": 120
      }
    },
    {
      "files": ["*.md", "*.html"],
      "excludeFiles": ["*.min.js"],
      "options": {
        "tabWidth": 4
      }
    }
  ]
}
```

```ts [oxfmt.config.ts]
import { defineConfig } from "oxfmt";

export default defineConfig({
  printWidth: 100,
  overrides: [
    {
      files: ["*.test.js", "*.spec.ts"],
      options: {
        printWidth: 120,
      },
    },
    {
      files: ["*.md", "*.html"],
      excludeFiles: ["*.min.js"],
      options: {
        tabWidth: 4,
      },
    },
  ],
});
```

:::

Each override entry has:

- `files` (required): Glob patterns to match files
- `excludeFiles` (optional): Glob patterns to exclude from this override
- `options`: Formatting options to apply

Glob patterns are resolved relative to the directory containing the Oxfmt config file.

## Precedence

Options are applied in order (lowest to highest priority):

1. Defaults
2. Config file root options
3. Config file `overrides` options
4. fallback to options supported by `.editorconfig` for unset fields

## Oxfmt-specific options

### `insertFinalNewline`

Controls whether a final newline is added to formatted files. Defaults to `true`.

This is a [frequently requested Prettier feature](https://github.com/prettier/prettier/issues/6360), as some environments (e.g., Salesforce) strip trailing newlines.

### `printWidth`

Oxfmt defaults to `printWidth: 100` (Prettier uses 80). Reasons:

- TypeScript code is longer due to type annotations
- Import statements often have many specifiers
- Modern screens are wider
- Fewer line breaks mean fewer LLM tokens

To match Prettier's default:

::: code-group

```json [.oxfmtrc.json]
{
  "printWidth": 80
}
```

```ts [oxfmt.config.ts]
import { defineConfig } from "oxfmt";

export default defineConfig({
  printWidth: 80,
});
```

:::

## Next steps

- [Ignore files](./ignore-files): Ignore files and patterns, `.gitignore` and `.prettierignore` workflows.
- [Inline ignore comments](./ignore-comments): Inline suppressions for specific code.
- [Config file reference](./config-file-reference): Full schema and field documentation.
- [CLI reference](./cli): Complete list of flags.
