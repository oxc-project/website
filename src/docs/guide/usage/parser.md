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
- Try on [stackblitz](https://stackblitz.com/edit/oxc-parser).

### Rust

Use the umbrella crate [oxc][url-oxc-crate] or the individual [oxc_ast][url-oxc-ast-crate] and [oxc_parser][url-oxc-parser-crate] crates.

Rust usage example can be found [here](https://github.com/oxc-project/oxc/blob/main/crates/oxc_parser/examples/parser.rs).

## Print

After parsing and transforming, you can print code.

Here's a direct example using [esrap](https://npmx.dev/package/esrap) _(`parse` in reverse!)_:

```js
import { print } from "esrap";
import ts from "esrap/languages/ts";
import { parseSync } from "oxc-parser";

const { program } = parseSync("test.js", 'alert("hello oxc & esrap");');
const { code } = print(program, ts());

console.log(code); // alert("hello oxc & esrap");
```

:::info
Today, comments are not printed. _It will be supported thanks to [oxc-parser #13285](https://github.com/oxc-project/oxc/pull/13285)._
:::

<!-- Links -->

[url-swc]: https://swc.rs
[url-benchmark]: https://github.com/oxc-project/bench-javascript-parser-written-in-rust
[url-oxc-crate]: https://docs.rs/oxc
[url-oxc-ast-crate]: https://docs.rs/oxc_ast
[url-oxc-parser-crate]: https://docs.rs/oxc_parser
[url-oxc-parser-npm]: https://npmx.dev/package/oxc-parser
