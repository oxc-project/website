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

Oxfmt is compatible with Prettier v3.8 for many configurations.

Key differences:

- Default `printWidth` is 100 (Prettier uses 80)
- Prettier plugins are not supported (though some popular plugins have been implemented natively)
- Some options are not supported (see [config reference](/docs/guide/usage/formatter/config-file-reference.html))

See [Unsupported features](/docs/guide/usage/formatter/unsupported-features) for details, and the [compatibility matrix](/compatibility) for file type support.

## Step 1: Upgrade Prettier to v3.8 (optional)

Oxfmt's output is closest to Prettier v3.8. Upgrading first minimizes formatting differences.

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

Oxfmt uses `.oxfmtrc.json`, `.oxfmtrc.jsonc`, or `oxfmt.config.ts`. Basic example:

```jsonc [.oxfmtrc.jsonc]
{
  "$schema": "./node_modules/oxfmt/configuration_schema.json",
  "printWidth": 80,
}
```

Run `oxfmt --migrate prettier` to convert your Prettier config automatically.

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

If you no longer use Prettier, you can optionally move its contents from `.prettierignore` to `"ignorePatterns"` in your Oxfmt config. Note that `.prettierignore` applies globally, while `ignorePatterns` is scoped to the config file it belongs to. In a [nested config](./config#create-a-config-file) setup, this may change which files are ignored. See [Ignore files](/docs/guide/usage/formatter/ignore-files) for more information.

### Update `// prettier-ignore` comments

Oxfmt supports `// prettier-ignore` comments, but also supports `// oxfmt-ignore` comments.

However, `// oxfmt-ignore` will only work for JS and TS files. See [Inline ignore comments](/docs/guide/usage/formatter/ignore-comments) for more information.
