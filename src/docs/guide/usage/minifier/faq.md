# FAQ

## Top level variables are removed

Compression can remove unused, unexported top-level bindings in ES modules and CommonJS files. `module: true` forces ES module mode; `module: false` does not force script mode. Oxc still uses the filename and, when applicable, the source syntax to determine the source type.

Set [`compress.unused: false`](./dead-code-elimination#unused-declarations) to keep unused declarations. If you also need to keep their original names, set [`mangle.toplevel: false`](./mangling#top-level-variables) or disable mangling with `mangle: false`.

## New lines in strings are not removed

It may be surprising that new lines in strings are not removed and replaced with `\n` in minified code. This behavior is because the character escape sequences `\n` is two bytes long while the new line character is one byte long.

<!-- prettier-ignore-start -->

```js
// this code is 16 bytes
const foo="a\nb"

// this code is 15 bytes
const foo=`a
b`
```

<!-- prettier-ignore-end -->
