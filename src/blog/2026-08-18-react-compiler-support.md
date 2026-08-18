---
title: React Compiler Support
outline: deep
authors:
  - boshen
---

<AppBlogPostHeader />

We are excited to announce [React Compiler](https://react.dev/learn/react-compiler) support in Oxlint and Oxc Transform.

Oxlint now includes 22 React Compiler-powered rules that use the compiler's validation passes to catch violations of the Rules of React.

Oxc Transform uses [`oxc-transform-react`](https://npmx.dev/package/oxc-transform-react) to apply React Compiler's automatic memoization directly to Oxc's AST. It is more than 10 times faster than Babel in our preliminary benchmark.

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

| Rule name                                                                                               | ESLint preset        | Oxlint category | Note                                                                            |
| ------------------------------------------------------------------------------------------------------- | -------------------- | --------------- | ------------------------------------------------------------------------------- |
| [`error-boundaries`](/docs/guide/usage/linter/rules/react/error-boundaries)                             | `recommended`        | `correctness`   |                                                                                 |
| [`globals`](/docs/guide/usage/linter/rules/react/globals)                                               | `recommended`        | `correctness`   |                                                                                 |
| [`immutability`](/docs/guide/usage/linter/rules/react/immutability)                                     | `recommended`        | `correctness`   |                                                                                 |
| [`incompatible-library`](/docs/guide/usage/linter/rules/react/incompatible-library)                     | `recommended`        | `correctness`   |                                                                                 |
| [`preserve-manual-memoization`](/docs/guide/usage/linter/rules/react/preserve-manual-memoization)       | `recommended`        | `correctness`   |                                                                                 |
| [`purity`](/docs/guide/usage/linter/rules/react/purity)                                                 | `recommended`        | `correctness`   |                                                                                 |
| [`refs`](/docs/guide/usage/linter/rules/react/refs)                                                     | `recommended`        | `correctness`   |                                                                                 |
| [`set-state-in-effect`](/docs/guide/usage/linter/rules/react/set-state-in-effect)                       | `recommended`        | `correctness`   |                                                                                 |
| [`set-state-in-render`](/docs/guide/usage/linter/rules/react/set-state-in-render)                       | `recommended`        | `correctness`   |                                                                                 |
| [`static-components`](/docs/guide/usage/linter/rules/react/static-components)                           | `recommended`        | `correctness`   |                                                                                 |
| [`use-memo`](/docs/guide/usage/linter/rules/react/use-memo)                                             | `recommended`        | `correctness`   |                                                                                 |
| [`unsupported-syntax`](/docs/guide/usage/linter/rules/react/unsupported-syntax)                         | `recommended`        | `restriction`   |                                                                                 |
| `config`                                                                                                | `recommended`        | Not implemented | Oxlint uses fixed, valid compiler options.                                      |
| `gating`                                                                                                | `recommended`        | Not implemented | Oxlint does not expose compiler gating options yet.                             |
| [`void-use-memo`](/docs/guide/usage/linter/rules/react/void-use-memo)                                   | `recommended-latest` | `correctness`   |                                                                                 |
| [`no-deriving-state-in-effects`](/docs/guide/usage/linter/rules/react/no-deriving-state-in-effects)     | `off`                | `perf`          |                                                                                 |
| [`invariant`](/docs/guide/usage/linter/rules/react/invariant)                                           | `off`                | `restriction`   |                                                                                 |
| [`rule-suppression`](/docs/guide/usage/linter/rules/react/rule-suppression)                             | `off`                | `restriction`   |                                                                                 |
| [`syntax`](/docs/guide/usage/linter/rules/react/syntax)                                                 | `off`                | `restriction`   |                                                                                 |
| [`todo`](/docs/guide/usage/linter/rules/react/todo)                                                     | `off`                | `restriction`   |                                                                                 |
| [`capitalized-calls`](/docs/guide/usage/linter/rules/react/capitalized-calls)                           | `off`                | `suspicious`    |                                                                                 |
| [`exhaustive-effect-dependencies`](/docs/guide/usage/linter/rules/react/exhaustive-effect-dependencies) | `off`                | `suspicious`    |                                                                                 |
| [`hooks`](/docs/guide/usage/linter/rules/react/hooks)                                                   | `off`                | `suspicious`    |                                                                                 |
| [`memo-dependencies`](/docs/guide/usage/linter/rules/react/memo-dependencies)                           | `off`                | `suspicious`    |                                                                                 |
| `fbt`                                                                                                   | `off`                | Not implemented | This is a Meta-internal FBT category.                                           |
| `memoized-effect-dependencies`                                                                          | `off`                | Not implemented | Upstream's `EffectDependencies` category is absent from the Rust compiler port. |

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

## Benchmark

Our [preliminary benchmark](https://github.com/oxc-project/bench-transformer#react-compiler) shows that [`oxc-transform-react`](https://npmx.dev/package/oxc-transform-react) is more than 10 times faster than [`babel-plugin-react-compiler`](https://npmx.dev/package/babel-plugin-react-compiler).

Files that used to take around 100 ms to compile now take around 10 ms.

## Background

React Compiler is a build-time compiler that automatically memoizes React components and hooks. [React Compiler 1.0](https://react.dev/blog/2025/10/07/react-compiler-1) was released last year as [`babel-plugin-react-compiler`](https://npmx.dev/package/babel-plugin-react-compiler).

Earlier this year, the React team [ported React Compiler to Rust](https://github.com/react/react/pull/36173). We started looking for ways to integrate it into Oxc.

Our initial integration added [more than 5 MiB to the binary](https://github.com/oxc-project/oxc/pull/22942), and we believed we could improve its performance significantly.

Our first attempt was to maintain a [synchronized fork](https://github.com/oxc-project/forked-react-compiler) and publish it as crates. The goal was to let the Rust tooling ecosystem, including SWC, Bun, and Biome, use and maintain one shared fork.

We then discovered that this version of React Compiler maintained its own Babel-shaped AST. Oxc had to convert its AST into that representation before running the compiler, then convert it back afterwards. We knew we could make it faster by running the compiler directly on Oxc's AST. The Rust port was also unfinished, had bugs, and did not yet conform to the original Babel implementation.

We eventually decided to [vendor React Compiler into Oxc](https://github.com/oxc-project/oxc/tree/main/crates/oxc_react_compiler) for tighter integration. This allowed us to remove the intermediate Babel AST and make React Compiler operate directly on the Oxc AST.

After a lot of work, we made it significantly faster and smaller, with better conformance, diagnostics, and source maps.

## Improvements

The original Rust port was unfinished when it was merged. We finished many missing pieces, fixed bugs, and added the improvements below.

### Performance

In our local measurements, Oxc's version is about twice as fast as the [original Rust port of React Compiler](https://github.com/react/react/pull/36173).

Running directly on Oxc's AST also reduced memory allocations.

### Conformance

Oxc conforms to the [latest experimental release of `babel-plugin-react-compiler`](https://npmx.dev/package/babel-plugin-react-compiler/v/0.0.0-experimental-a1856f3-20260507), while its default options remain aligned with Babel React Compiler v1.

We have compared our output against this version across more than 100 large and popular repositories, covering over 100,000 source files, and made sure all files compile to the same output.

### Diagnostics

We improved React Compiler diagnostics to make issues easier for coding agents to fix. Oxlint now shows compact codeframes, related source locations, help messages, and links.

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

We will maintain the Rust port, complete the remaining TODOs, and fix reported React Compiler issues. We have also found bugs in the original Babel implementation and want to investigate and fix them. Bug reports and contributions are welcome.

## Acknowledgements

Thank you to the React Compiler team, especially [Joseph Savona](https://github.com/josephsavona), for developing and open sourcing the Rust port that made this integration possible.

Thank you to [Lauren Tan](https://github.com/poteto) for answering our questions.

---

Please try it and [report any issues](https://github.com/oxc-project/oxc/issues) with a minimal reproduction.
