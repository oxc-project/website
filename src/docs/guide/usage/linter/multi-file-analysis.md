---
title: "Multi-file analysis | Oxlint"
description: Project-wide linting for import cycles and cross-file issues
---

# Multi-file analysis

Multi-file analysis allows rules to use project-wide information, such as the module dependency graph, instead of analyzing each file in isolation.

## Performance and architecture

ESLint evaluates rules per file and does not provide a built-in project graph. Plugins such as
[`eslint-plugin-import`](https://npmx.dev/package/eslint-plugin-import) must rebuild module resolution and the module graph outside of ESLint’s core. Projects report the original `import/no-cycle` rule taking tens of seconds, or - on larger repositories - over a minute.

Oxlint implements multi-file analysis in the core engine. It lints files and builds the module graph in parallel, shares parsing and resolution across rules, and typically completes comparable `import/no-cycle` checks in a few seconds.

## Enable the `import` plugin

To use multi-file analysis, you must enable the `import` plugin and configure at
least one `import/*` rule. For an example, see the config file in the next section.

## Detect cycles with `import/no-cycle`

Enable
[`import/no-cycle`](/docs/guide/usage/linter/rules/import/no-cycle.html)
to detect circular dependencies.

Import cycles:

- obscure dependency direction
- make refactors harder
- can cause imported values to be `undefined` due to evaluation order

::: code-group

```json [.oxlintrc.json]
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["import"],
  "rules": {
    "import/no-cycle": ["error", { "maxDepth": 3 }]
  }
}
```

```ts [oxlint.config.ts]
import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["import"],
  rules: {
    "import/no-cycle": ["error", { maxDepth: 3 }],
  },
});
```

:::

## TypeScript path aliases

When running `import/*` rules, Oxlint automatically discovers `tsconfig.json`
to resolve TypeScript path aliases such as `compilerOptions.paths`.
