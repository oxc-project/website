---
title: "Migrate from Prettier | Oxfmt"
---

# Migrate from Prettier

This guide covers migrating from Prettier to Oxfmt.

## When to migrate from Prettier

Migrate to Oxfmt if you want to keep a Prettier-like workflow while getting faster formatting and built-in formatting features. Choose [Vite+](https://npmx.dev/package/vite-plus) instead if you want Oxfmt as part of a larger unified toolchain.

- Move to Oxfmt for dedicated formatting.
- Move to [Vite+](https://npmx.dev/package/vite-plus) for an integrated workflow.
- Stay on Prettier if exact plugin behavior is still required.

## Quick start

For simple setups, migrate with a single command:

::: code-group

```bash [npm]
$ npm add -D oxfmt@latest && npx oxfmt --migrate=prettier && npx oxfmt
```

```bash [pnpm]
$ pnpm add -D oxfmt@latest && pnpm oxfmt --migrate=prettier && pnpm oxfmt
```

```bash [yarn]
$ yarn add -D oxfmt@latest && yarn oxfmt --migrate=prettier && yarn oxfmt
```

```bash [bun]
$ bun add -D oxfmt@latest && bunx oxfmt --migrate=prettier && bunx oxfmt
```

:::

## Migrate with Skills

The [`migrate-oxfmt`](https://skills.sh/oxc-project/oxc/migrate-oxfmt) skill provides an interactive, agent-guided migration. Install it into your coding agent:

```bash
npx skills add https://github.com/oxc-project/oxc --skill migrate-oxfmt
```

Once installed, run `/migrate-oxfmt` to perform the migration.

## Before you migrate

Oxfmt is compatible with Prettier v3.9.9 for many configurations.

Key differences:

- Default `printWidth` is 100 (Prettier uses 80)
- Prettier plugins are not supported (though some popular plugins have been implemented natively)
- Some options are not supported (see [config reference](/docs/guide/usage/formatter/config-file-reference.html))

See [Unsupported features](/docs/guide/usage/formatter/unsupported-features) for details, and the [compatibility matrix](/compatibility) for file type support.

### Known divergences

Oxfmt may intentionally differ from Prettier's output where Prettier's behavior is clearly a bug or inconsistent across similar cases.
Each case is documented with its reason:

- [JavaScript / TypeScript](https://github.com/oxc-project/oxc/blob/main/crates/oxc_formatter/DIVERGENCES.md)
- [CSS / SCSS / Less](https://github.com/oxc-project/oxc/blob/main/crates/oxc_formatter_css/DIVERGENCES.md)
- [GraphQL](https://github.com/oxc-project/oxc/blob/main/crates/oxc_formatter_graphql/DIVERGENCES.md)
- [YAML](https://github.com/oxc-project/oxc/blob/main/crates/oxc_formatter_yaml/DIVERGENCES.md)
- [Markdown](https://github.com/oxc-project/oxc/blob/main/crates/oxc_formatter_markdown/DIVERGENCES.md)
- [Embedded formatting](https://github.com/oxc-project/oxc/blob/main/apps/oxfmt/DIVERGENCES.md)

## Step 1: Upgrade Prettier to v3.9.9 (optional)

Oxfmt's output is closest to Prettier v3.9.9. Upgrading first minimizes formatting differences.

## Step 2: Install Oxfmt

::: code-group

```bash [npm]
$ npm add -D oxfmt@latest
```

```bash [pnpm]
$ pnpm add -D oxfmt@latest
```

```bash [yarn]
$ yarn add -D oxfmt@latest
```

```bash [bun]
$ bun add -D oxfmt@latest
```

```bash [deno]
$ deno add -D npm:oxfmt@latest
```

:::

## Step 3: Migrate configuration

Oxfmt uses `.oxfmtrc.json`, `.oxfmtrc.jsonc`, `oxfmt.config.ts`, or `oxfmt.config.mts`. Basic example:

```jsonc [.oxfmtrc.jsonc]
{
  "$schema": "./node_modules/oxfmt/configuration_schema.json",
  "printWidth": 80,
}
```

Run `oxfmt --migrate prettier` to convert your Prettier config automatically.

It reads the Prettier config in the current directory and creates `.oxfmtrc.json`:

- Supported config formats:
  - `prettier` field in `package.json`, including shareable configs
  - `.prettierrc` (JSON only), `.prettierrc.json`
  - JS/TS configs (`.prettierrc.*`, `prettier.config.*`)
- YAML, JSON5 and TOML configs are not supported. Convert them to JSON or JS first.
- Only Prettier-compatible options are migrated. Others are skipped with a warning.
- `overrides` are migrated, and `overrides[].options.parser` becomes [`associations`](./config#associations).
- `.prettierignore` patterns are migrated to `ignorePatterns`.
- Options of `prettier-plugin-tailwindcss`, `prettier-plugin-svelte`, `prettier-plugin-astro` and `prettier-plugin-packagejson` are migrated to the built-in equivalents. Other plugins are skipped with a warning.
- `printWidth` is set to `80` if not specified, to keep Prettier's default.

Things to do manually:

- JS/TS configs are evaluated and migrated as static values. Port any logic (e.g. environment branches) to `oxfmt.config.ts`.
- Nested configs are not searched. Run `oxfmt --migrate prettier` in each directory that has a Prettier config.
- Review the warnings printed at the end.

### `prettierrc.js` example

Before:

```js [prettierrc.js]
module.exports = {
  singleQuote: true,
  jsxSingleQuote: true,
};
```

After (`oxfmt.config.ts`):

```ts [oxfmt.config.ts]
import { defineConfig } from "oxfmt";

export default defineConfig({
  singleQuote: true,
  jsxSingleQuote: true,
  printWidth: 80,
});
```

### `prettierrc.yaml` example

Before:

```yaml [prettierrc.yaml]
trailingComma: "es5"
tabWidth: 4
semi: false
singleQuote: true
```

After (`.oxfmtrc.jsonc`):

```jsonc [.oxfmtrc.jsonc]
{
  "$schema": "./node_modules/oxfmt/configuration_schema.json",
  "trailingComma": "es5",
  "tabWidth": 4,
  "semi": false,
  "singleQuote": true,
  "printWidth": 80,
}
```

## Step 4: Update scripts

### `package.json` scripts

```diff
{
  "scripts": {
-   "format": "prettier --write .",
+   "format": "oxfmt",
-   "format:check": "prettier --check ."
+   "format:check": "oxfmt --check"
  }
}
```

### CI workflows

```diff
  - name: Check formatting
-   run: yarn prettier --check .
+   run: yarn oxfmt --check
```

### Git hooks (husky, lint-staged)

In `package.json`:

```diff
"lint-staged": {
- "*": "prettier --write --no-error-on-unmatched-pattern"
+ "*": "oxfmt --no-error-on-unmatched-pattern"
}
```

## Step 5: Run formatter

```sh
npm run format
```

Uninstall Prettier if it is no longer needed.

## Optional steps

### Update editor integrations

See [Setup editors](./editors).

### Update documentation

Update references to Prettier in `CONTRIBUTING.md`, `AGENTS.md`, and `CLAUDE.md` if applicable.

### Update lint rules

Remove `eslint-plugin-prettier` if present. If needed, it can be replaced by a `oxfmt --check` job in your CI pipelines.

Note that if you intend to continue using ESLint, you _should_ keep or add [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier) to disable styling-related ESLint rules that might conflict with Oxfmt. `eslint-config-prettier` is different from `eslint-plugin-prettier`, as it has no new lint rules. It is only a config.

Also, consider migrating to [Oxlint](../linter.md).

### Update `.git-blame-ignore-revs`

Add the reformatting commit SHA to `.git-blame-ignore-revs` to hide it from `git blame`.

### Replace `.prettierignore` with `"ignorePatterns"`

If you no longer use Prettier, you can optionally move its contents from `.prettierignore` to `"ignorePatterns"` in your Oxfmt config. `oxfmt --migrate prettier` already does this, so you can delete `.prettierignore` afterward. Note that `.prettierignore` applies globally, while `ignorePatterns` is scoped to the config file it belongs to. In a [nested config](./config#create-a-config-file) setup, this may change which files are ignored. See [Ignore files](/docs/guide/usage/formatter/ignore-files) for more information.

### Update `// prettier-ignore` comments

Oxfmt supports `// prettier-ignore` comments, but also supports `// oxfmt-ignore` comments.

However, `// oxfmt-ignore` will only work for JS and TS files. See [Inline ignore comments](/docs/guide/usage/formatter/ignore-comments) for more information.
