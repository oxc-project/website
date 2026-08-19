# Mangling

Oxc minifier supports mangling variable names and private class fields.

This feature is enabled by default and can be disabled by setting the `mangle` option to `false`.

## Top Level Variables

Top level variables are not mangled by default for non module code. You can enable mangling for top level variables by setting the `mangle.toplevel` option to `true`.

```js
// input
var foo = 1;

// output
var e = 1;
```

```js
// Example
import { minify } from "oxc-minify";

const result = await minify("lib.js", code, {
  module: false, // non-module code
  mangle: {
    toplevel: true,
  },
});
```

## Keep `name` Property Values

Mangling variable names can change the `name` property values of functions / classes. You can keep the original `name` property values by enabling the `mangle.keepNames` option.

```js
// input
var foo = function () {};

// output
var foo = function () {};
```

```js
// Example
import { minify } from "oxc-minify";

const result = await minify("lib.js", code, {
  mangle: {
    keepNames: true, // shorthand of { function: true, class: true }
  },
});
```

::: tip `compress.keepNames` option

When enabling this option, you may also want to enable [the `compress.keepNames` option](./dead-code-elimination#keep-name-property-values).

:::

## Debugging The Mangler

To debug the mangler, you can enable the `mangle.debug` option. When this option is enabled, the mangler will use `slot_0`, `slot_1`, ... as variable names.

```js
// input
var foo = 1;

// output
var slot_0 = 1;
```

```js
// Example
import { minify } from "oxc-minify";

const result = await minify("lib.js", code, {
  mangle: {
    debug: true,
  },
});
```
