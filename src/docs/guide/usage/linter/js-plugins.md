---
outline: deep
---

# JS Plugins

Oxlint supports plugins written in JS - either custom-written, or from NPM.

Oxlint's plugin API is compatible with ESLint v9+, so most existing ESLint plugins should work out of the box with Oxlint.

We are working towards implementing _all_ of ESLint's plugin APIs, and Oxlint will soon be able to run
_any_ ESLint plugin.

:::warning
JS plugins are currently in technical preview, and remain under heavy development.
Almost all of ESLint's plugin API is implemented (see [below](#api-support)).

All APIs should behave identically to ESLint. If you find any differences in behavior,
that's a bug - please [report it](https://github.com/oxc-project/oxc/issues/new?template=linter_bug_report.yaml).
:::

## Using JS plugins

1. Add a path to the plugin to the `.oxlintrc.json` config file, under `jsPlugins`.
2. Add rules from the plugin, under `rules`.

The path can be any valid import specifier e.g. `./plugin.js`, `eslint-plugin-foo`, or `@foo/eslint-plugin`.
Paths are resolved relative to the config file itself.

```json
// .oxlintrc.json
{
  "jsPlugins": ["./path/to/my-plugin.js", "eslint-plugin-whatever", "@foobar/eslint-plugin"],
  "rules": {
    "my-plugin/rule1": "error",
    "my-plugin/rule2": "warn",
    "whatever/rule1": "error",
    "whatever/rule2": "warn",
    "@foobar/rule1": "error"
  }
  // ... other config ...
}
```

### Plugin aliases

You can also define a different name (alias) for a plugin. This is useful if:

- The default plugin name clashes with name of a native Oxlint plugin (e.g. jsdoc, react, etc.).
- The default plugin name is very long.
- You want to use a plugin that Oxlint supports natively, but a specific rule you need is not yet implemented in Oxlint's native version.

```json
{
  "jsPlugins": [
    // `jsdoc` is a reserved name, as Oxlint supports it natively
    {
      "name": "jsdoc-js",
      "specifier": "eslint-plugin-jsdoc"
    },
    // Shorten name
    {
      "name": "short",
      "specifier": "eslint-plugin-with-name-so-very-very-long"
    },
    // List plugins you don't want to alias as just specifiers
    "eslint-plugin-whatever"
  ],
  "rules": {
    "jsdoc-js/check-alignment": "error",
    "short/rule1": "error",
    "whatever/rule2": "error"
  }
}
```

## Writing JS plugins

### ESLint-compatible API

Oxlint provides a plugin API identical to ESLint's. See ESLint's docs on
[creating a plugin](https://eslint.org/docs/latest/extend/plugins) and
[custom rules](https://eslint.org/docs/latest/extend/custom-rules).

A simple plugin which flags files containing more than 5 class declarations:

```js
// plugin.js
const rule = {
  create(context) {
    let classCount = 0;

    return {
      ClassDeclaration(node) {
        classCount++;
        if (classCount === 6) {
          context.report({ message: "Too many classes", node });
        }
      },
    };
  },
};

const plugin = {
  meta: {
    name: "best-plugin-ever",
  },
  rules: {
    "max-classes": rule,
  },
};

export default plugin;
```

```json
// .oxlintrc.json
{
  "jsPlugins": ["./plugin.js"],
  "rules": {
    "best-plugin-ever/max-classes": "error"
  }
}
```

### Alternative API

Oxlint also provides a slightly different alternative API which is more performant.

Rules created with this API **remain compatible with ESLint** (see [below](#what-does-definerule-do)).

Same rule as above, using the alternative API:

```js
import { defineRule } from "oxlint";

const rule = defineRule({
  createOnce(context) {
    // Define counter variable
    let classCount;

    return {
      before() {
        // Reset counter before traversing AST of each file
        classCount = 0;
      },
      // Same as before
      ClassDeclaration(node) {
        classCount++;
        if (classCount === 6) {
          context.report({ message: "Too many classes", node });
        }
      },
    };
  },
});
```

The differences are:

1. Wrap the rule object in `defineRule(...)`.

```diff
- const rule = {
+ const rule = defineRule({
```

2. Use `createOnce` instead of `create`.

```diff
-   create(context) {
+   createOnce(context) {
```

3. `create` (ESLint's API) is called repeatedly _for each file_, whereas `createOnce` is called once only.
   Perform any per-file setup in `before` hook instead.

```diff
-     let classCount = 0;
+     let classCount;

      return {
+       before() {
+         classCount = 0; // Reset counter
+       },
        ClassDeclaration(node) {
          classCount++;
          if (classCount === 6) {
            context.report({ message: "Too many classes", node });
          }
        },
      };
    },
  });
```

#### What does `defineRule` do?

`defineRule` adds a `create` method to the rule, which delegates to `createOnce`.

**This means the rule can be used with either Oxlint or ESLint.**

- In Oxlint, it'll get a perf boost from the faster `createOnce` API.
- In ESLint, it'll work exactly the same as if it was written with the original ESLint `create` API.

#### `definePlugin`

If your plugin includes multiple rules, wrapping the whole plugin in `definePlugin` has same effect as wrapping each
individual rule in `defineRule`.

```js
import { definePlugin } from "oxlint";

const plugin = definePlugin({
  meta: { name: "my-plugin" },
  rules: {
    "no-foo": rule1,
    "no-bar": rule2,
  },
});
```

#### Skipping AST traversal

Returning `false` from `before` hook causes the rule to skip this file.

```js
// This rule does not run on files which start with a `// @skip-me` comment
const rule = defineRule({
  createOnce(context) {
    return {
      before() {
        if (context.sourceCode.text.startsWith("// @skip-me")) {
          return false;
        }
      },
      FunctionDeclaration(node) {
        // Do stuff
      },
    };
  },
});
```

This is equivalent to this pattern in ESLint:

```js
const rule = {
  create(context) {
    if (context.sourceCode.text.startsWith("// @skip-me")) {
      return {};
    }

    return {
      FunctionDeclaration(node) {
        // Do stuff
      },
    };
  },
};
```

#### `before` hook

`before` hook runs before the AST is visited.

IMPORTANT: `before` hook is NOT guaranteed to run on every file.

At present it does, but in future we intend to add logic on Rust side to determine if the rule needs to run or not,
based on what AST nodes the rule is "interested in", and what the AST contains.
This will enable better performance by skipping redundant calls from Rust into JS.

In example above, if a file does not contain any `FunctionDeclaration`s, running the rule on that file will be skipped
entirely, _including_ skipping the `before` hook.

If you need code to always run once for every file, implement a `Program` visitor instead:

```js
const rule = defineRule({
  createOnce(context) {
    return {
      Program(node) {
        // This always runs for every file, even if it
        // doesn't contain any `FunctionDeclaration`s
      },
      FunctionDeclaration(node) {
        /* do stuff */
      },
    };
  },
});
```

#### `after` hook

There is also an `after` hook. It runs once per file, _after_ the whole AST has been traversed (after `Program:exit`).

Use it to clean up any expensive resources used during the rule's AST traversal.

If `before` hook returns `false` to skip running the rule on the file, `after` hook will be skipped too.

Same as `before` hook, `after` hook is NOT guaranteed to run on every file (see [above](#when-before-hook-runs)).

### Why is the alternative API faster?

Short answer: Right now it isn't. But it _will be soon_.

Prior to the initial technical preview release of JS plugins, we have undergone a lengthy "R&D" process. We have
identified many optimization opportunities, and have prototyped the _next_ version of Oxlint plugins, which has
_extremely_ good performance.

Many of those optimizations are not in the current release, but we'll be polishing them and folding them into Oxlint
over the next few months.

The alternative API is designed to enable and capitalize on these optimizations. By adopting the alternative API now,
plugin authors will see their plugins get a significant speed boost in future "for free", just by bumping `oxlint`
version, without any code changes.

#### What are those optimizations?

Returning to the "no more than 5 classes" rule example from above:

```js
const rule = {
  create(context) {
    let classCount = 0;

    return {
      ClassDeclaration(node) {
        classCount++;
        if (classCount === 6) {
          context.report({ message: "Too many classes", node });
        }
      },
    };
  },
};
```

The `create` method is called once per file, each time with a new `context` object.

Why is that a problem?

For maximum performance, ideally we want to statically know what AST nodes the rule is
"interested in". With that information, we can perform 2 optimizations:

1. Don't walk the AST on JS side. Instead, during traversal of AST on Rust side, compile a list of "pointers" to
   the relevant AST nodes. Send that list to JS, and JS can "jump" straight to the relevant AST nodes, rather than
   searching the whole AST.

2. If the AST doesn't contain _any_ AST nodes which match what the rule is interested in (in example above, if file
   contains no class declarations), skip calling into JS entirely for that file.

But JS is a dynamic language, and `create` could do _anything_. It could return a completely different visitor each time
it's called. So we have to call `create` to find out whether we needed to call `create`!

In comparison, with the alternative API, `createOnce` is called only once, and we then know what the rule does.
This enables the above optimizations.

To be clear, the `create` API was _not_ a poor design decision on ESLint's part. It just presents some difficulties once
Rust-JS interop comes into play.

## API support

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

Not supported yet:

- Language server (IDE) support + suggestions (so no in-editor diagnostics or quick-fixes yet).
- Custom file formats and parsers (e.g. Svelte, Vue, Angular).

ESLint APIs that were removed in ESLint v9 or earlier will not be implemented in most cases. If an ESLint plugin is unmaintained and was never updated to upgrade their API usage for ESLint v9, you may need to modify the plugin yourself or find an alternative.

We will be implementing the remaining features over the next few months, aiming to support 100% of ESLint's
plugin API surface.
