---
title: "Ignore files | Oxfmt"
---

# Ignore files

Oxfmt provides several ways to exclude files from formatting.

Some ignore mechanisms apply globally, while others are scoped to the config file they belong to:

| Mechanism                           | Scope                 |
| ----------------------------------- | --------------------- |
| CLI paths with `!` prefix           | Global                |
| `.prettierignore` / `--ignore-path` | Global                |
| `ignorePatterns` in config          | Scoped to that config |

When using [nested config](./config#create-a-config-file), `ignorePatterns` only applies to files that are resolved by that particular config file. Global mechanisms always apply regardless of which config file is in effect.

## `ignorePatterns`

The recommended way to ignore files. Add to your Oxfmt config:

::: code-group

```json [.oxfmtrc.json]
{
  "ignorePatterns": ["dist/**", "*.min.js"]
}
```

```ts [oxfmt.config.ts]
import { defineConfig } from "oxfmt";

export default defineConfig({
  ignorePatterns: ["dist/**", "*.min.js"],
});
```

:::

- Uses `.gitignore` syntax
- Paths are resolved relative to the directory containing the Oxfmt config file
- Formatter-specific and independent of Git

Files matching `ignorePatterns` **cannot be formatted**, even if explicitly specified.

## `.gitignore`

Oxfmt respects `.gitignore` files in the current directory tree.

- Global gitignore and parent `.gitignore` files are not read
- A `.git` directory is not required

Files ignored by `.gitignore` **can still be formatted** if explicitly specified.

## VCS directories and `node_modules`

Ignored by default: `.git`, `.svn`, `.jj`, `node_modules`

Use `--with-node-modules` to include `node_modules`.

## Lock files

`package-lock.json`, `pnpm-lock.yaml`, etc. are always ignored.

## `.prettierignore`

Supported for Prettier compatibility. Uses `.gitignore` syntax.

Files in `.prettierignore` cannot be formatted, even when explicitly specified.

For new projects, prefer `ignorePatterns`.
