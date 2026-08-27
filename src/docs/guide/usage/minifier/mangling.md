# Mangling

Oxc minifier can shorten variable names and selected property names.

## Variable Names

Variable-name mangling is enabled by default. Set `mangle` to `false` to disable it, or pass an object to configure it. Use `mangle.reserved` to keep exact binding names unchanged and prevent Oxc from generating them.

### Top-Level Variables

Top-level names are mangled by default in modules and CommonJS files, but not in scripts. Set `mangle.toplevel` to override this.

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
  mangle: {
    toplevel: true,
  },
});
```

### Keep `name` Property Values

Mangling variable names can change the `name` property values of functions and classes. Set `mangle.keepNames` to preserve them.

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

### Debugging the Mangler

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
    toplevel: true,
  },
});
```

## Property Names

Property-name mangling is off by default. Use `mangleProps.include` to select the property names to mangle.

```js
import { minify } from "oxc-minify";

const result = await minify("lib.js", code, {
  mangleProps: {
    include: /^_/,
    exclude: /^__public/,
    reserved: ["_externalApi"],
  },
});
```

`exclude` removes matching property names from the set selected by `include`. `reserved` keeps the listed exact names unchanged and also prevents Oxc from generating them as replacement names. Neither option adds entries to `mangleCache` by itself.

Quoted occurrences such as `obj["_field"]` are kept by default. This is handled per occurrence, so an unquoted use of the same name may still be mangled. Set `quoted` to `true` to mangle quoted occurrences too, or `debug` to `true` for readable generated property names.

The filters are JavaScript `RegExp` objects, but Oxc matches them with Rust's [regex engine](https://docs.rs/regex/latest/regex/#syntax). It supports the `i`, `m`, `s`, and `u` flags and reports unsupported syntax or flags in `result.errors`.

To keep names stable when the source changes, reuse `result.mangleCache` as `mangleProps.cache`. A `false` cache entry keeps that property unchanged. Always start from unminified source; do not apply the same cache to already-mangled output.

::: warning

Only mangle properties owned by the code being minified. Oxc cannot safely update names built at runtime or used by unminified code. Exclude or reserve matching names used by public APIs, through module namespace objects, or on globals, DOM APIs, and other host APIs. A cache alone does not make separately minified files safe.

For more details, see the [property-name assumptions](https://github.com/oxc-project/oxc/blob/main/crates/oxc_minifier/docs/ASSUMPTIONS.md#property-names-selected-for-mangling-are-not-accessed-dynamically).

:::
