---
title: React Compiler Support
outline: deep
authors:
  - boshen
---

<AppBlogPostHeader />

We are excited to announce [React Compiler](https://react.dev/learn/react-compiler) support in Oxlint and Oxc Transform.

Oxlint now includes 22 React Compiler-powered rules that use the compiler's validation passes to catch violations of the Rules of React.

Oxc Transform uses [`oxc-transform-react`](https://npmx.dev/package/oxc-transform-react) to apply React Compiler's automatic memoization directly to Oxc's AST without adding Babel to the toolchain. It is more than 10 times faster than Babel in our preliminary benchmark.

Integration with [`@vitejs/plugin-react`](https://npmx.dev/package/@vitejs/plugin-react) is coming soon.

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

React Compiler rule categories are aligned with the upstream ESLint presets. We added all recommended rules to Oxlint's correctness category.

If you enabled the previous nursery `react/react-compiler` rule, remove it from your configuration. It has been replaced by the category-specific rules below.

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
| `unsupported-syntax`             | `recommended`        | `restriction`   |                                                                                 |
| `config`                         | `recommended`        | Not implemented | Oxlint uses fixed, valid compiler options.                                      |
| `gating`                         | `recommended`        | Not implemented | Oxlint does not expose compiler gating options yet.                             |
| `void-use-memo`                  | `recommended-latest` | `correctness`   |                                                                                 |
| `no-deriving-state-in-effects`   | `off`                | `perf`          |                                                                                 |
| `invariant`                      | `off`                | `restriction`   |                                                                                 |
| `rule-suppression`               | `off`                | `restriction`   |                                                                                 |
| `syntax`                         | `off`                | `restriction`   |                                                                                 |
| `todo`                           | `off`                | `restriction`   |                                                                                 |
| `capitalized-calls`              | `off`                | `suspicious`    |                                                                                 |
| `exhaustive-effect-dependencies` | `off`                | `suspicious`    |                                                                                 |
| `hooks`                          | `off`                | `suspicious`    |                                                                                 |
| `memo-dependencies`              | `off`                | `suspicious`    |                                                                                 |
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

### [`@vitejs/plugin-react`](https://npmx.dev/package/@vitejs/plugin-react)

Native integration is waiting for [vitejs/vite-plugin-react#1419](https://github.com/vitejs/vite-plugin-react/pull/1419) to land.

We keep this framework-specific integration in [`@vitejs/plugin-react`](https://npmx.dev/package/@vitejs/plugin-react), rather than adding it to Vite or Rolldown, so the core toolchain remains vendor-neutral.

## Conformance

Oxc conforms to the [latest experimental release of `babel-plugin-react-compiler`](https://npmx.dev/package/babel-plugin-react-compiler/v/0.0.0-experimental-a1856f3-20260507), while its default options remain aligned with Babel React Compiler v1.

We have compared our output against this version across more than 100 large and popular repositories, covering over 100,000 source files.

## Benchmark

Our [preliminary benchmark](https://github.com/oxc-project/bench-transformer#react-compiler) shows that [`oxc-transform-react`](https://npmx.dev/package/oxc-transform-react) is more than 10 times faster than [`babel-plugin-react-compiler`](https://npmx.dev/package/babel-plugin-react-compiler).

Measuring locally, the [original Rust port of React Compiler](https://github.com/react/react/pull/36173) is about 2 times slower than Oxc's version.

## Background

React Compiler is a build-time compiler that automatically memoizes React components and hooks. [React Compiler 1.0](https://react.dev/blog/2025/10/07/react-compiler-1) was released last year as [`babel-plugin-react-compiler`](https://npmx.dev/package/babel-plugin-react-compiler).

Earlier this year, the React team [ported React Compiler to Rust](https://github.com/react/react/pull/36173). We started looking for ways to integrate it into Oxc.

Our initial integration showed that React Compiler added [more than 5 MiB to the binary](https://github.com/oxc-project/oxc/pull/22942), and its performance did not meet our standard.

Our first attempt was to maintain a [synchronized fork](https://github.com/oxc-project/forked-react-compiler) and publish it as crates. The goal was to let the Rust tooling ecosystem, including SWC, Bun, and Biome, use and maintain one shared fork.

We then discovered that this version of React Compiler maintained its own Babel-shaped AST. Oxc had to convert its AST into that representation before running the compiler, then convert it back afterwards. We were convinced that tighter integration with Oxc's AST could improve its performance. The Rust port also contained unfinished code and bugs, and did not yet conform to the original Babel implementation.

We eventually decided to [vendor React Compiler into Oxc](https://github.com/oxc-project/oxc/tree/main/crates/oxc_react_compiler) for tighter integration. This allowed us to remove the intermediate Babel AST and make React Compiler operate directly on the Oxc AST.

## Improvements

The original Rust port was unfinished when it was merged. Since integrating it into Oxc, we have completed missing pieces, fixed bugs, and made many improvements.

### Diagnostics

We improved React Compiler diagnostics so coding agents can understand and fix issues more easily. Oxlint now shows compact codeframes, points to related source locations, and includes actionable help instead of exposing internal compiler messages.

```text
⚠ react(immutability): This value cannot be modified
 ╭─[immutability.tsx:7:11]
6 │           const [state, setState] = useState({a: 0});
7 │           state.a = 1;
  ·           ──┬──
  ·             ╰── value cannot be modified
8 │           return <div>{props.foo}</div>;
  ╰────
help: Modifying a value returned from 'useState()', which should not be modified directly. Use the setter function to update instead
note: React Compiler skipped optimizing this component or hook. Additional guidance: https://react.dev/reference/eslint-plugin-react-hooks/lints/immutability
```

### Binary size

Our [first fork-based integration](https://github.com/oxc-project/oxc/pull/22942) produced an 8.66 MiB macOS ARM64 binary. After removing the Babel AST and JSON round-trip, replacing the full regex engine, and removing unused compiler code, the published [`oxc-transform-react` v0.144.0 binding](https://npmx.dev/package/@oxc-transform-react/binding-darwin-arm64) is 3.97 MiB.

React Compiler remains in a separate optional package, so it does not increase the binary size for Oxc Transform.

### Source maps

The original Rust port had incomplete source map support.

We made sure source maps work correctly across React Compiler, TypeScript, JSX, and React Fast Refresh.

## Future work

There are still many TODOs in the code. At the time of writing, the [original Rust crates](https://github.com/oxc-project/forked-react-compiler/tree/39b638ccbb0ac5f87a1420523707fc463d35a824/react-compiler/crates) contain 16 literal `TODO` markers and 62 code paths that emit `Todo` diagnostics. [Oxc's vendored compiler](https://github.com/oxc-project/oxc/tree/794891d93afabfb4a61dbf4b7ada4cca984b7190/crates/oxc_react_compiler) contains 10 literal `TODO` markers and 57 centralized `Todo` diagnostic constructors.

We are committed to maintaining the Rust port by completing the remaining TODOs and triaging and fixing React Compiler issues. Along the way, we have also discovered bugs in the original Babel implementation, which we are keen to investigate and fix. We welcome bug reports and other improvements.

## Acknowledgements

Thank you to the React Compiler team, especially [Joseph Savona](https://github.com/josephsavona), for developing and open sourcing the Rust port that made this integration possible.

Thank you to [Lauren Tan](https://github.com/poteto) for answering our questions.

---

Please try it and [report any issues](https://github.com/oxc-project/oxc/issues) with a minimal reproduction.
