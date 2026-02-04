# Dead Code Elimination

Oxc minifier supports eliminating dead code. For example, it removes the statements inside a `if (false)` block and the unused private class fields.

This feature is always enabled, but you can remove more code by enabling some options.

::: tip Useful features in the transformer

Other than the options below, you can also use [the `define` feature in the transformer](/docs/guide/usage/transformer/global-variable-replacement#define) to replace global identifiers with constant expressions to remove more dead code.

:::

## Drop Console

You can remove all `console.*` calls by enabling the `dropConsole` option. This option behaves similar to [Terser](https://terser.org/)'s `drop_console` option and [esbuild's `drop: ['console']` option](https://esbuild.github.io/api/#drop).

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

Note that this option removes the whole call expression including the arguments. This is intentional because removing the evaluation of call arguments is useful for improving the runtime performance if those are expensive to compute. However, if any of those arguments have side effects, this transformation will change the behavior of your code. If you want to keep the arguments, you can use [`compress.treeshake.manualPureFunctions: ['console']`](#define-pure-functions) option.

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

All unused function / class / variable declarations are removed by default. You can keep them by using the `unused` option.

```js
// input
{
  function foo() {}
}

// output
```

```js
// Example
import { minify } from "oxc-minify";

const result = await minify("lib.js", code, {
  compress: {
    unused: true, // or "keep_assign"
  },
});
```

## Keep `name` Property Values

By default, Oxc minifier assumes that your code does not rely on the `name` property of functions / classes. This is because the `name` property is inferred from the function / class name or the variable name and keeping the original name would prevent reducing the output size.

To keep the `name` property values, you can use the `keepNames` option.

```js
// input
var bar = function foo() {};

// output
var bar = function foo() {};
```

```js
// Example
import { minify } from "oxc-minify";

const result = await minify("lib.js", code, {
  compress: {
    keepNames: true, // shorthand of { function: true, class: true }
  },
});
```

::: tip `mangle.keepNames` option

If you are using the mangling feature, you may also want to enable [the `mangle.keepNames` option](./mangling#keep-name-property-values).

:::

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

By default, Oxc minifier assumes that property reads have side effects. This is because the accessing a property of null throws and error. Also there's a case where a property is a getter and the getter might has a side effect. You can tell Oxc minifier to ignore those possibilities by setting `compress.treeshake.propertyReadSideEffects` option to `false`. This feature is similar to [Rollup's `treeshake.propertyReadSideEffects` option](https://rollupjs.org/configuration-options/#treeshake-propertyreadsideeffects) and [Terser](https://terser.org/)'s `pure_getters` option.

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

By default, Oxc minifier assumes that global variable accesses have side effects. This is because accessing a non-existent global variable throws an error. Also there's a case where a global variable is a getter and the getter might has a side effect. You can tell Oxc minifier to ignore those possibilities by setting `compress.treeshake.unknownGlobalSideEffects` option to `false`. This feature is similar to [Rollup's `treeshake.unknownGlobalSideEffects` option](https://rollupjs.org/configuration-options/#treeshake-unknownglobalsideeffects).

```js
// input
const jQuery = $;

// output (with `compress.treeshake.propertyReadSideEffects: false`)
```

### Ignoring Invalid Import Statement Side Effects

By default, Oxc minifier assumes that import statements doesn't have side effects. Import statements have side effects in the following cases:

- the import cannot be resolved
- the import name is not exported from the imported module

If these side effects need to be preserved, you can tell Oxc minifier to preserve them by setting `compress.treeshake.invalidImportSideEffects` option to `true`.

```js
// input
import { existing } from "cannot-be-resolved";
import { missing } from "somewhere";

// output (with `compress.treeshake.invalidImportSideEffects: true`)
import { existing } from "cannot-be-resolved";
import { missing } from "somewhere";

// output (with `compress.treeshake.invalidImportSideEffects: false`)
```
