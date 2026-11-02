---
title: "JS Plugins | Oxlint"
outline: deep
---

# JS Plugins

Oxlint supports plugins written in JS - either custom-written, or from npm.

Oxlint's plugin API is compatible with ESLint v9+, so most existing ESLint plugins should work out of the box with Oxlint.

Almost the entirety of ESLint's plugin API is now implemented (see [below](#api-support)), so most existing ESLint plugins should work out of the box.

:::info
JS plugins are currently in alpha, and remain under active development.

All APIs should behave identically to ESLint. If you find any differences in behavior,
that's a bug - please [report it](https://github.com/oxc-project/oxc/issues/new?template=linter_bug_report.yaml).
:::

## Using JS plugins

1. Add a path to the plugin to the `.oxlintrc.json` config file, under `jsPlugins`.
2. Add rules from the plugin, under `rules`.

The path can be any valid import specifier e.g. `./plugin.js`, `eslint-plugin-foo`, or `@foo/eslint-plugin`.
Paths are resolved relative to the config file itself.

::: code-group

```jsonc [.oxlintrc.json]
{
  "jsPlugins": ["./path/to/my-plugin.js", "eslint-plugin-whatever", "@foobar/eslint-plugin"],
  "rules": {
    "my-plugin/rule1": "error",
    "my-plugin/rule2": "warn",
    "whatever/rule1": "error",
    "whatever/rule2": "warn",
    "@foobar/rule1": "error",
  },
  // ... other config ...
}
```

```ts [oxlint.config.ts]
import { defineConfig } from "oxlint";

export default defineConfig({
  jsPlugins: ["./path/to/my-plugin.js", "eslint-plugin-whatever", "@foobar/eslint-plugin"],
  rules: {
    "my-plugin/rule1": "error",
    "my-plugin/rule2": "warn",
    "whatever/rule1": "error",
    "whatever/rule2": "warn",
    "@foobar/rule1": "error",
  },
  // ... other config ...
});
```

:::

### Plugin aliases

You can also define a different name (alias) for a plugin. This is useful if:

- The default plugin name clashes with name of a native Oxlint plugin (e.g. jsdoc, react, etc.).
- The default plugin name is very long.
- You want to use a plugin that Oxlint supports natively, but a specific rule you need is not yet implemented in Oxlint's native version.

::: code-group

```jsonc [.oxlintrc.json]
{
  "jsPlugins": [
    // `jsdoc` is a reserved name, as Oxlint supports it natively
    {
      "name": "jsdoc-js",
      "specifier": "eslint-plugin-jsdoc",
    },
    // Shorten name
    {
      "name": "short",
      "specifier": "eslint-plugin-with-name-so-very-very-long",
    },
    // List plugins you don't want to alias as just specifiers
    "eslint-plugin-whatever",
  ],
  "rules": {
    "jsdoc-js/check-alignment": "error",
    "short/rule1": "error",
    "whatever/rule2": "error",
  },
}
```

```ts [oxlint.config.ts]
import { defineConfig } from "oxlint";

export default defineConfig({
  jsPlugins: [
    // `jsdoc` is a reserved name, as Oxlint supports it natively
    {
      name: "jsdoc-js",
      specifier: "eslint-plugin-jsdoc",
    },
    // Shorten name
    {
      name: "short",
      specifier: "eslint-plugin-with-name-so-very-very-long",
    },
    // List plugins you don't want to alias as just specifiers
    "eslint-plugin-whatever",
  ],
  rules: {
    "jsdoc-js/check-alignment": "error",
    "short/rule1": "error",
    "whatever/rule2": "error",
  },
});
```

:::

See the [Writing JS Plugins](./writing-js-plugins) page for information on writing your own JS plugins and custom rules for Oxlint.

## Known-supported ESLint plugins

We run conformance tests on a number of popular ESLint plugins to ensure they work with Oxlint. These include:

- `eslint-plugin-cypress` ([conformance test results](https://github.com/oxc-project/oxc/blob/main/apps/oxlint/conformance/snapshots/cypress.md))
- `@e18e/eslint-plugin` ([conformance test results](https://github.com/oxc-project/oxc/blob/main/apps/oxlint/conformance/snapshots/e18e.md))
- `eslint-plugin-mocha` ([conformance test results](https://github.com/oxc-project/oxc/blob/main/apps/oxlint/conformance/snapshots/mocha.md))
- `eslint-plugin-playwright` ([conformance test results](https://github.com/oxc-project/oxc/blob/main/apps/oxlint/conformance/snapshots/playwright.md))
- `eslint-plugin-react-hooks` ([conformance test results](https://github.com/oxc-project/oxc/blob/main/apps/oxlint/conformance/snapshots/react-hooks.md)): Note that some of these rules are already supported natively in Oxlint, and so those should generally be used instead
- `eslint-plugin-regexp` ([conformance test results](https://github.com/oxc-project/oxc/blob/main/apps/oxlint/conformance/snapshots/regexp.md))
- `eslint-plugin-sonarjs` ([conformance test results](https://github.com/oxc-project/oxc/blob/main/apps/oxlint/conformance/snapshots/sonarjs.md))
- `eslint-plugin-storybook` ([conformance test results](https://github.com/oxc-project/oxc/blob/main/apps/oxlint/conformance/snapshots/storybook.md))
- `@stylistic/eslint-plugin` ([conformance test results](https://github.com/oxc-project/oxc/blob/main/apps/oxlint/conformance/snapshots/stylistic.md))
- `eslint-plugin-testing-library` ([conformance test results](https://github.com/oxc-project/oxc/blob/main/apps/oxlint/conformance/snapshots/testing_library.md))

Note that the above list is not exhaustive, and _many_ other ESLint plugins will work with Oxlint as well. These are just some popular plugins that we have explicitly tested.

You can see more info about plugins that are known to work with Oxlint in the [GitHub Discussion](https://github.com/oxc-project/oxc/discussions/20245).

## API Support

Oxlint supports almost all of ESLint's API surface:

- AST traversal.
- AST exploration (`node.parent`, `context.sourceCode.getAncestors`).
- Fixes.
- Rule options.
- Selectors ([ESLint docs](https://eslint.org/docs/latest/extend/selectors)).
- `SourceCode` APIs (e.g. `context.sourceCode.getText(node)`).
- `SourceCode` tokens APIs (e.g. `context.sourceCode.getTokens(node)`).
- Scope analysis.
- Control flow analysis (code paths).
- Inline disable directives. (`// oxlint-disable`)
- Language server (IDE) support + suggestions (in-editor diagnostics and quick-fixes)

Not supported yet:

- Custom file formats and parsers (e.g. Svelte, Vue, Angular).
- Lint rules that rely on TypeScript type-awareness.

ESLint APIs that were removed in ESLint v9 or earlier will not be implemented in most cases. If an ESLint plugin is unmaintained and was never updated to upgrade their API usage for ESLint v9, you may need to modify the plugin yourself or find an alternative.

We will be implementing the remaining features over the next few months, aiming to support 100% of ESLint's
plugin API surface.
