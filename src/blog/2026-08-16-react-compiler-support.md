---
title: React Compiler Support
outline: deep
authors:
  - boshen
---

<AppBlogPostHeader />

We are excited to announce React Compiler support in Oxlint and Oxc Transform.

**Oxlint now includes 23 React Compiler-powered rules, while `oxc-transform-react` runs the compiler directly on Oxc's AST without adding Babel to the toolchain.**

## Getting started

### Oxlint

Enable the React plugin and its correctness rules:

```json [.oxlintrc.json]
{
  "plugins": ["react"],
  "categories": {
    "correctness": "error"
  }
}
```

The following rules are available:

- `react/capitalized-calls`
- `react/error-boundaries`
- `react/exhaustive-effect-dependencies`
- `react/gating`
- `react/globals`
- `react/hooks`
- `react/immutability`
- `react/incompatible-library`
- `react/invariant`
- `react/memo-dependencies`
- `react/no-deriving-state-in-effects`
- `react/preserve-manual-memoization`
- `react/purity`
- `react/refs`
- `react/rule-suppression`
- `react/set-state-in-effect`
- `react/set-state-in-render`
- `react/static-components`
- `react/syntax`
- `react/todo`
- `react/unsupported-syntax`
- `react/use-memo`
- `react/void-use-memo`

### Transform

Install [`oxc-transform-react`](https://npmx.dev/package/oxc-transform-react):

```sh
pnpm add -D oxc-transform-react
```

```js
import { transformSync } from "oxc-transform-react";

const result = transformSync(
  "Component.tsx",
  `
    export function Component({ name }: { name: string }) {
      return <div>Hello {name}</div>;
    }
  `,
  {
    reactCompiler: {
      target: "19",
    },
    jsx: {
      runtime: "automatic",
    },
  },
);

if (result.fatal) {
  console.error(result.errors);
} else {
  console.log(result.code);
}
```

The compiler adds a memoization cache to the component:

```js [Output]
import { c as _c } from "react/compiler-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
export function Component(t0) {
  const $ = _c(2);
  const { name } = t0;
  let t1;
  if ($[0] !== name) {
    t1 = /* @__PURE__ */ _jsxs("div", { children: ["Hello ", name] });
    $[0] = name;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  return t1;
}
```

## Conformance

We have compared our output against `babel-plugin-react-compiler` across more than 100 large and popular repositories, covering over 100,000 source files. Both pipelines use the same compiler options and Oxc's code generator, so printer-only differences do not affect the comparison. We use these comparisons to find conformance issues and keep the Oxc implementation aligned with the Babel version.

## Benchmark

TODO

## Background

React Compiler is a build-time compiler that automatically memoizes React components and hooks. [React Compiler 1.0](https://react.dev/blog/2025/10/07/react-compiler-1) was released last year as `babel-plugin-react-compiler`.

Earlier this year, the React team [ported React Compiler to Rust](https://github.com/react/react/pull/36173). We started looking for ways to integrate it into Oxc.

Our initial integration showed that React Compiler added [more than 5 MiB to the binary](https://github.com/oxc-project/oxc/pull/22942), and its performance did not meet our standard.

Our first attempt was to maintain a [synchronized fork](https://github.com/oxc-project/forked-react-compiler) and publish it as crates. The goal was to let the Rust tooling ecosystem, including SWC, Bun, and Biome, use and maintain one shared fork.

We then discovered that this version of React Compiler maintained its own Babel-shaped AST. Oxc had to convert its AST into that representation before running the compiler, then convert it back afterwards. We were convinced that tighter integration with Oxc's AST could improve its performance. The Rust port also contained unfinished code and bugs, and did not yet conform to the original Babel implementation.

We eventually decided to [vendor React Compiler into Oxc](https://github.com/oxc-project/oxc/tree/main/crates/oxc_react_compiler) for tighter integration. This allowed us to remove the intermediate Babel AST and make React Compiler operate directly on the Oxc AST.

We are confident that we have eliminated most bugs and completed most TODOs. We believe we now have a maintained version of the Rust port.

In the future, we want to continue fixing bugs. Along the way, we have also discovered bugs in the original Babel implementation. We welcome bug reports and other improvements.

## Acknowledgements

Thank you to the React Compiler team, especially [Joseph Savona](https://github.com/josephsavona), for developing and open sourcing the Rust port that made this integration possible.

Please try it and [report any issues](https://github.com/oxc-project/oxc/issues) with a minimal reproduction.
