---
title: Parser
outline: deep
---

# Parser

<AppBadgeList />

A high-performance JavaScript / TypeScript parser written in Rust, powering other tools in the Oxc project.

## Features

- 3x faster than swc parser ([benchmark][url-benchmark]).
- Parses `.js(x)` and `.ts(x)`.
- Passes all parser tests from Test262 and 99% from Babel and TypeScript.
- Returns ESM information directly, no need for [`es-module-lexer`](https://npmx.dev/package/es-module-lexer).
- [✅ works with checker.ts](https://x.com/robpalmer2/status/1805502964435505559)

## Installation

### Node.js

- Use the node binding [oxc-parser][url-oxc-parser-npm].
- Try on [stackblitz](https://stackblitz.com/fork/github/oxc-project/website/tree/main/stackblitz-templates/oxc-parser).

### Rust

Use the umbrella crate [oxc][url-oxc-crate] or the individual [oxc_ast][url-oxc-ast-crate] and [oxc_parser][url-oxc-parser-crate] crates.

Rust usage example can be found [here](https://github.com/oxc-project/oxc/blob/main/crates/oxc_parser/examples/parser.rs).

## Print

After parsing or transforming, use [`oxc-codegen`](./codegen) to print the ESTree AST as source code.

For example:

```js
import { parseSync } from "oxc-parser";
import { printSync } from "oxc-codegen";

const { program } = parseSync("test.js", 'alert("hello oxc");');
const { code } = printSync(program);

console.log(code); // alert("hello oxc");
```

:::info
`oxc-codegen` currently does not print comments. See the [Code Generator guide](./codegen#current-limitations) for the other current limitations.
:::

<!-- Links -->

[url-swc]: https://swc.rs
[url-benchmark]: https://github.com/oxc-project/bench-javascript-parser-written-in-rust
[url-oxc-crate]: https://docs.rs/oxc
[url-oxc-ast-crate]: https://docs.rs/oxc_ast
[url-oxc-parser-crate]: https://docs.rs/oxc_parser
[url-oxc-parser-npm]: https://npmx.dev/package/oxc-parser
