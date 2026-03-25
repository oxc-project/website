# JSX

Oxc transformer supports transforming JSX.

## General Usage

```js
import { transform } from "oxc-transform";

const result = await transform("App.jsx", sourceCode, {
  jsx: {
    runtime: "automatic", // or "classic"
    development: false, // or true
    throwIfNamespace: true, // or false
    pure: true, // or false
    importSource: "react",
    pragma: "React.createElement",
    pragmaFrag: "React.Fragment",
    refresh: false, // see below
  },
  // When transforming TSX files:
  typescript: {
    jsxPragma: "React.createElement", // same value with `jsx.pragma`
    jsxPragmaFrag: "React.Fragment", // same value with `jsx.pragmaFrag`
  },
});
```

You can also set `jsx: 'preserve'` to disable JSX transformation.

Oxc transformer also supports JSX pragma comments, which is also supported by [Babel](https://babeljs.io/docs/babel-preset-react/) and [esbuild](https://esbuild.github.io/api/#jsx). Pragma comments are useful for configuring JSX options on a per-file basis.

### Pragma Comment Scanning

Oxc only scans comments that appear **before the first statement** in a file for JSX pragmas. This means pragma comments placed inside functions, classes, or after any statement are ignored.

```jsx
// @jsx h  ← ✅ This pragma is recognized (before first statement)

import { h } from "preact";

// @jsx React.createElement  ← ❌ This pragma is ignored (after first statement)
function App() {
  return <div />;
}
```

This behavior aligns with TypeScript and SWC, which both restrict pragma scanning to leading comments. Note that Babel and esbuild scan all comments in a file (with the last one winning).

## Runtime

By default, the automatic runtime transform is used. This transform was [introduced in React 17+](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html). This transform injects the required `import` statements automatically.

You can also use the classic runtime transform by setting `jsx.runtime` option to `"classic"`.

`// @jsxRuntime classic` / `// @jsxRuntime automatic` are the way to configure this via pragma comments.

## Common Options for Both Runtimes

### Development Transform

By default, the development specific transforms are disabled. You can enable them by setting `jsx.development` option to `true`.

### XML Namespaced Tag Names

By default, an error is thrown if the XML namespaced tag names (e.g. `<foo:bar baz:qux="foobar" />`) are used. Though the JSX spec allows this, it is disallowed by default since React's JSX does not currently support them. You can allow them by setting `jsx.throwIfNamespace` option to `false`.

### Pure Annotation

By default, JSX elements are annotated with pure annotations. Pure annotations are annotation comments that marks expressions that can be safely removed if their return values are not used. But this may not be desired if the JSX elements should be kept. You can disable this by setting `jsx.pure` option to `false`.

## Automatic Runtime Specific Options

### Import Source

This option specifies the import source for the JSX helper functions. The default value is `"react"`.

For example, if you want to use the `preact` package instead of `react`, you can set `jsx.importSource` to `"preact"`, then the following import statements may be injected:

```js
import { createElement } from "preact";
import { Fragment, jsxDEV } from "preact/jsx-dev-runtime";
import { Fragment, jsx, jsxs } from "preact/jsx-runtime";
```

`// @jsxImportSource preact` is the way to configure this via pragma comments.

## Classic Runtime Specific Options

### Pragma

This option specifies the function name to use when transforming JSX expressions. It should be a qualified name (e.g. `React.createElement`) or an identifier (e.g. `createElement`). This option is called `jsxFactory` in esbuild.

`// @jsx createElement` is the way to configure this via pragma comments.

### Pragma Fragment

This option specifies the function name to use when transforming JSX fragments. It should be a valid JSX tag name. This option is called `jsxFragment` in esbuild.

`// @jsxFrag Fragment` is the way to configure this via pragma comments.

## React Refresh

React Refresh (also known as React Fast Refresh) provides hot reloading capabilities for React components during development.

### Usage

To enable React Refresh transformation, set `jsx.refresh` option:

```javascript
import { transform } from "oxc-transform";

const result = await transform("App.jsx", sourceCode, {
  jsx: {
    development: true,
    refresh: true,
    // or...
    // refresh: {
    //   refreshReg: "$RefreshReg$",
    //   refreshSig: "$RefreshSig$",
    //   emitFullSignatures: true,
    // },
  },
});
```

### Configuration Options

| Option               | Type      | Default          | Description                                                 |
| -------------------- | --------- | ---------------- | ----------------------------------------------------------- |
| `refreshReg`         | `string`  | `"$RefreshReg$"` | The name of the function to register components for refresh |
| `refreshSig`         | `string`  | `"$RefreshSig$"` | The name of the function to create signatures for refresh   |
| `emitFullSignatures` | `boolean` | `false`          | Whether to emit full signatures for better debugging        |
