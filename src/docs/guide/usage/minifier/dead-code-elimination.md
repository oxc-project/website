# Dead Code Elimination

Oxc minifier supports eliminating dead code. For example, it removes statements inside an `if (false)` block and unused private class fields.

Dead code elimination is enabled by default. Set `compress: false` to disable it.

::: tip Useful features in the transformer

Other than the options below, you can also use [the `define` feature in the transformer](/docs/guide/usage/transformer/global-variable-replacement#define) to replace global identifiers with constant expressions to remove more dead code.

:::

## Drop Console

`dropConsole` removes direct calls such as `console.log(...)`, even when `console` is a local binding. It does not remove optional-chain calls.

```js
// input
const bar = window.bar();
console.log("foo", bar, baz());

// output
const bar = window.bar();
```

```js
// Example
import { minify } from "oxc-minify";

const result = await minify("lib.js", code, {
  compress: {
    dropConsole: true,
  },
});
```

::: warning The whole call expression is removed

Dropping a call also drops its arguments and their side effects. To retain argument side effects when the result is unused, use [`compress.treeshake.manualPureFunctions: ['console']`](#define-pure-functions) instead.

:::

## Drop Debugger

You can remove all `debugger` statements by enabling the `dropDebugger` option. This option is enabled by default. This option behaves similar to [Terser](https://terser.org/)'s `drop_debugger` option and [esbuild's `drop: ['debugger']` option](https://esbuild.github.io/api/#drop).

```js
// input
debugger;

// output
```

```js
// Example
import { minify } from "oxc-minify";

const result = await minify("lib.js", code, {
  compress: {
    dropDebugger: true,
  },
});
```

## Drop Labels

You can remove all labeled statements with specified labels by enabling the `dropLabels` option. This option behaves similar to [esbuild's `dropLabels` option](https://esbuild.github.io/api/#drop-labels).

```js
// input
DEV: console.log("foo");
console.log("bar");

// output
console.log("bar");
```

```js
// Example
import { minify } from "oxc-minify";

const result = await minify("lib.js", code, {
  compress: {
    dropLabels: ["DEV"],
  },
});
```

## Unused Declarations

Set `compress.unused: false` to keep unused declarations. The `"keep_assign"` setting still removes unused declarations, but counts simple assignments as uses.

```js
import { minify } from "oxc-minify";

const code = "function unused() {}";

const defaults = await minify("lib.mjs", code);
console.log(defaults.code); // ""

const kept = await minify("lib.mjs", code, {
  compress: { unused: false },
  mangle: false,
});
console.log(kept.code); // "function unused(){}"
```

## Keep `name` Property Values

Compression can drop function and class names, and mangling can rename them. Configure `compress.keepNames` and [`mangle.keepNames`](./mangling#keep-name-property-values) to preserve them.

```js
import { minify } from "oxc-minify";

const code = "export const bar = function foo() {};";
const result = await minify("lib.mjs", code, {
  compress: {
    keepNames: { function: true, class: true },
  },
  mangle: { keepNames: true },
});
console.log(result.code); // "export const bar=function foo(){};"
```

## Controlling Side Effect Detection

There are multiple options to control the side effect detection.

### Pure Annotations

By default, Oxc minifier respects pure annotations. Pure annotations are annotation comments that marks expressions that can be safely removed if their return values are not used. See [the draft specification proposal](https://github.com/javascript-compiler-hints/compiler-notations-spec) for more information.

This can be disabled by setting `compress.treeshake.annotations` option to `false`.

#### `#__PURE__` / `@__PURE__`

The `#__PURE__` annotation is used to mark function calls that can be safely removed if their return values are not used. Note that it only marks the function call itself and does not cover the arguments of it.

If you want to mark other expressions or the cover the arguments, you can wrap them with a IIFE and put the `#__PURE__` annotation on it.

```js
// input
/* #__PURE__ */ foo();
/* #__PURE__ */ new Foo();
/* #__PURE__ */ foo(bar());
/* #__PURE__ */ (() => {
  foo(bar());
})();
console.log(/* #__PURE__ */ foo());
console.log(/* #__PURE__ */ new Foo());

// output
bar();
console.log(foo());
console.log(new Foo());
```

::: tip The function does not have to be pure

Despite the name, the function does not have to be pure ([Pure function - Wikipedia](https://en.wikipedia.org/wiki/Pure_function)). It does not indicate that the calls can be cached. In other words, the function does not have to be referentially transparent ([Referential transparency - Wikipedia](https://en.wikipedia.org/wiki/Referential_transparency)).

:::

#### `#__NO_SIDE_EFFECTS__` / `@__NO_SIDE_EFFECTS__`

The `#__NO_SIDE_EFFECTS__` annotation is used to mark a function declaration that all calls of it can be safely removed if their return values are not used. This is useful if you have a function call of that function in multiple places.

```js
// input
/* #__NO_SIDE_EFFECTS__ */
export function foo() {}
/* #__NO_SIDE_EFFECTS__ */
export const bar = () => {};
foo();
bar();

// output
export function foo() {}
export const bar = () => {};
```

### Define Pure Functions

Instead of marking functions with pure annotations, you can also mark functions via the `compress.treeshake.manualPureFunctions` option. This option is an array of function names. This feature is similar to [Rollup's `treeshake.manualPureFunctions` option](https://rollupjs.org/configuration-options/#treeshake-manualpurefunctions) and [Terser](https://terser.org/)'s `pure_funcs` option.

```js
// input
foo();
foo.bar();
bar();
bar.baz();
new foo();
foo``;

// output
bar();
```

```js
// Example
import { minify } from "oxc-minify";

const result = await minify("lib.js", code, {
  compress: {
    treeshake: {
      manualPureFunctions: ["foo", "bar.baz"],
    },
  },
});
```

### Ignoring Property Read Side Effects

By default, Oxc minifier assumes that property reads have side effects. This is because the accessing a property of null throws an error. Also there's a case where a property is a getter and the getter might have a side effect. You can tell Oxc minifier to ignore those possibilities by setting `compress.treeshake.propertyReadSideEffects` option to `false`. This feature is similar to [Rollup's `treeshake.propertyReadSideEffects` option](https://rollupjs.org/configuration-options/#treeshake-propertyreadsideeffects) and [Terser](https://terser.org/)'s `pure_getters` option.

```js
// input
const foo = {
  get bar() {
    console.log("effect");
    return "bar";
  },
};
foo.bar;

// output (with `compress.treeshake.propertyReadSideEffects: false`)
```

### Ignoring Global Variable Access Side Effects

By default, Oxc minifier assumes that global variable accesses have side effects. This is because accessing a non-existent global variable throws an error. Also there's a case where a global variable is a getter and the getter might have a side effect. You can tell Oxc minifier to ignore those possibilities by setting `compress.treeshake.unknownGlobalSideEffects` option to `false`. This feature is similar to [Rollup's `treeshake.unknownGlobalSideEffects` option](https://rollupjs.org/configuration-options/#treeshake-unknownglobalsideeffects).

```js [lib.mjs]
// input
const jQuery = $;

// output (with `compress.treeshake.unknownGlobalSideEffects: false`)
```

### Ignoring Invalid Import Statement Side Effects

By default, Oxc can strip unused specifiers from regular imports, leaving a bare import if none remain. This can suppress missing-export errors, but not module resolution errors. Set `compress.treeshake.invalidImportSideEffects: true` to keep the specifiers.

```js
// input (assume ./dependency.js exists but does not export `missing`)
import { missing } from "./dependency.js";
import { unused } from "missing-package";

// output (with `compress.treeshake.invalidImportSideEffects: true` and `mangle: false`)
import { missing } from "./dependency.js";
import { unused } from "missing-package";

// output (with `compress.treeshake.invalidImportSideEffects: false`)
import "./dependency.js";
import "missing-package";
```
