---
title: React Compiler Support
outline: deep
authors:
  - boshen
---

<AppBlogPostHeader />

We are excited to announce React Compiler support in Oxlint, Oxc Transform, and [`@vitejs/plugin-react`](https://npmx.dev/package/@vitejs/plugin-react).

**Oxlint now includes 22 React Compiler-powered rules, while Oxc Transform and [`@vitejs/plugin-react`](https://npmx.dev/package/@vitejs/plugin-react) use [`oxc-transform-react`](https://npmx.dev/package/oxc-transform-react) to run the compiler directly on Oxc's AST without adding Babel to the toolchain.**

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

React Compiler rule categories are now aligned with the ESLint presets in [`babel-plugin-react-compiler@0.0.0-experimental-a1856f3-20260507`](https://npmx.dev/package/babel-plugin-react-compiler). Rules that are off upstream no longer use Oxlint's default correctness category, while `incompatible-library` uses correctness because it is recommended upstream.

| Rule name                        | ESLint preset        | Oxlint category | Note                                                                            |
| -------------------------------- | -------------------- | --------------- | ------------------------------------------------------------------------------- |
| `error-boundaries`               | `recommended`        | `correctness`   |                                                                                 |
| `globals`                        | `recommended`        | `correctness`   |                                                                                 |
| `immutability`                   | `recommended`        | `correctness`   |                                                                                 |
| `incompatible-library`           | `recommended`        | `correctness`   |                                                                                 |
| `preserve-manual-memoization`    | `recommended`        | `correctness`   |                                                                                 |
| `purity`                         | `recommended`        | `correctness`   |                                                                                 |
| `refs`                           | `recommended`        | `correctness`   |                                                                                 |
| `set-state-in-effect`            | `recommended`        | `correctness`   |                                                                                 |
| `set-state-in-render`            | `recommended`        | `correctness`   |                                                                                 |
| `static-components`              | `recommended`        | `correctness`   |                                                                                 |
| `use-memo`                       | `recommended`        | `correctness`   |                                                                                 |
| `unsupported-syntax`             | `recommended`        | `restriction`   | Compiler support boundary.                                                      |
| `config`                         | `recommended`        | Not implemented | Oxlint uses fixed, valid compiler options.                                      |
| `gating`                         | `recommended`        | Not implemented | Oxlint does not expose compiler gating options.                                 |
| `void-use-memo`                  | `recommended-latest` | `correctness`   | Enabled by the newer upstream preset.                                           |
| `no-deriving-state-in-effects`   | `off`                | `perf`          | Performance and derived-state guidance.                                         |
| `invariant`                      | `off`                | `restriction`   | Internal compiler invariant.                                                    |
| `rule-suppression`               | `off`                | `restriction`   | Compiler policy restriction.                                                    |
| `syntax`                         | `off`                | `restriction`   | Compiler syntax restriction.                                                    |
| `todo`                           | `off`                | `restriction`   | Unimplemented-feature diagnostic; a hint upstream.                              |
| `capitalized-calls`              | `off`                | `suspicious`    | Kept out of default correctness.                                                |
| `exhaustive-effect-dependencies` | `off`                | `suspicious`    | Dependency diagnostic, not default correctness.                                 |
| `hooks`                          | `off`                | `suspicious`    | Overlaps the non-compiler `rules-of-hooks` rule.                                |
| `memo-dependencies`              | `off`                | `suspicious`    | Overlaps the non-compiler `exhaustive-deps` rule.                               |
| `fbt`                            | `off`                | Not implemented | This is a Meta-internal FBT category.                                           |
| `memoized-effect-dependencies`   | `off`                | Not implemented | Upstream's `EffectDependencies` category is absent from the Rust compiler port. |

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

### [`@vitejs/plugin-react`](https://npmx.dev/package/@vitejs/plugin-react)

Install [`oxc-transform-react`](https://npmx.dev/package/oxc-transform-react) alongside [`@vitejs/plugin-react`](https://npmx.dev/package/@vitejs/plugin-react):

```sh
pnpm add -D @vitejs/plugin-react oxc-transform-react
```

Enable the native compiler in your Vite config:

```js [vite.config.js]
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react({ compiler: true })],
});
```

## Improvements

### Diagnostics

We converted React Compiler errors into [native Oxc diagnostics](https://github.com/oxc-project/oxc/pull/25742). Oxlint now shows compact codeframes, points to related source locations, and includes actionable help instead of exposing internal compiler messages.

```text
⚠ react(refs): Cannot access refs during render
 ╭─[Component.tsx:3:3]
2 │ const ref = useRef(null);
3 │ ref.current = 1;
  · ─┬─────┬───
  ·  │     ╰── Cannot update ref value during render
  ·  ╰── This value is a ref
  ╰────
```

### Binary size

Our [first fork-based integration](https://github.com/oxc-project/oxc/pull/22942) produced an 8.66 MiB macOS ARM64 native binding. After removing the Babel AST and JSON round-trip, replacing the full regex engine, and removing unused compiler code, the published [`oxc-transform-react` v0.144.0 binding](https://npmx.dev/package/@oxc-transform-react/binding-darwin-arm64) is 3.97 MiB.

React Compiler remains in a separate optional package, so it does not increase the binary size for Oxc Transform or [`@vitejs/plugin-react`](https://npmx.dev/package/@vitejs/plugin-react) users who do not enable it.

### Source maps

[`oxc-transform-react`](https://npmx.dev/package/oxc-transform-react) generates source maps across React Compiler, TypeScript, JSX, and React Fast Refresh in one transform. This avoids composing source maps from multiple transform passes and keeps browser diagnostics and debugging locations mapped to the original source.

[`@vitejs/plugin-react`](https://npmx.dev/package/@vitejs/plugin-react) enables source maps during development and follows Vite's [`build.sourcemap`](https://vite.dev/config/build-options.html#build-sourcemap) setting for production builds.

## Conformance

We have compared our output against [`babel-plugin-react-compiler`](https://npmx.dev/package/babel-plugin-react-compiler) across more than 100 large and popular repositories, covering over 100,000 source files. Both pipelines use the same compiler options and Oxc's code generator, so printer-only differences do not affect the comparison. We use these comparisons to find conformance issues and keep the Oxc implementation aligned with the Babel version.

## Benchmark

Our [preliminary benchmark](https://github.com/oxc-project/bench-transformer#react-compiler) shows that [`oxc-transform-react`](https://npmx.dev/package/oxc-transform-react) is more than 10 times faster than [`babel-plugin-react-compiler`](https://npmx.dev/package/babel-plugin-react-compiler).

The benchmark compares synchronous React Compiler transforms targeting React 19 across two TSX fixtures, with source maps and JSX lowering disabled for both implementations.

Measuring locally, the original Rust port of React Compiler is about 2 times slower than Oxc's version.

## Background

React Compiler is a build-time compiler that automatically memoizes React components and hooks. [React Compiler 1.0](https://react.dev/blog/2025/10/07/react-compiler-1) was released last year as [`babel-plugin-react-compiler`](https://npmx.dev/package/babel-plugin-react-compiler).

Earlier this year, the React team [ported React Compiler to Rust](https://github.com/react/react/pull/36173). We started looking for ways to integrate it into Oxc.

Our initial integration showed that React Compiler added [more than 5 MiB to the binary](https://github.com/oxc-project/oxc/pull/22942), and its performance did not meet our standard.

Our first attempt was to maintain a [synchronized fork](https://github.com/oxc-project/forked-react-compiler) and publish it as crates. The goal was to let the Rust tooling ecosystem, including SWC, Bun, and Biome, use and maintain one shared fork.

We then discovered that this version of React Compiler maintained its own Babel-shaped AST. Oxc had to convert its AST into that representation before running the compiler, then convert it back afterwards. We were convinced that tighter integration with Oxc's AST could improve its performance. The Rust port also contained unfinished code and bugs, and did not yet conform to the original Babel implementation.

We eventually decided to [vendor React Compiler into Oxc](https://github.com/oxc-project/oxc/tree/main/crates/oxc_react_compiler) for tighter integration. This allowed us to remove the intermediate Babel AST and make React Compiler operate directly on the Oxc AST.

We are confident that we have eliminated most bugs and completed most TODOs. At the time of writing, the [original Rust crates](https://github.com/oxc-project/forked-react-compiler/tree/39b638ccbb0ac5f87a1420523707fc463d35a824/react-compiler/crates) contain 16 literal `TODO` markers and 62 code paths that emit `Todo` diagnostics. [Oxc's vendored compiler](https://github.com/oxc-project/oxc/tree/794891d93afabfb4a61dbf4b7ada4cca984b7190/crates/oxc_react_compiler) contains 10 literal `TODO` markers and 57 centralized `Todo` diagnostic constructors. We believe we now have a maintained version of the Rust port.

In the future, we want to continue fixing bugs. Along the way, we have also discovered bugs in the original Babel implementation. We welcome bug reports and other improvements.

## Acknowledgements

Thank you to the React Compiler team, especially [Joseph Savona](https://github.com/josephsavona), for developing and open sourcing the Rust port that made this integration possible.

Please try it and [report any issues](https://github.com/oxc-project/oxc/issues) with a minimal reproduction.
