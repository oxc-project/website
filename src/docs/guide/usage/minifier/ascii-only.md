# ASCII Escaping

Set `codegen.asciiOnly` to `true` to escape non-ASCII characters in string literals, untagged template literals, regular expression literals, and identifier names. The option defaults to `false` and works with or without whitespace stripping.

## Node.js

```js
import { minifySync } from "oxc-minify";

const result = minifySync("input.js", "export let π = '☕';", {
  codegen: {
    asciiOnly: true,
    removeWhitespace: false,
  },
});

console.log(result.code);
```

Output:

```text
export let \u03C0 = "\u2615";
```

The async `minify` function accepts the same option.

## Rust

Set `ascii_only` on `oxc_codegen::CodegenOptions` when generating code:

```rust
use oxc_codegen::{Codegen, CodegenOptions};

let output = Codegen::new()
    .with_options(CodegenOptions {
        ascii_only: true,
        ..CodegenOptions::default()
    })
    .build(&program);
```

## Escapes and Limitations

Characters up to U+FFFF use `\uXXXX` escapes. Higher code points use `\u{...}` escapes, which require ES2015 or later. This option does not provide ES5-compatible output.

Regular expressions use escaped UTF-16 surrogate pairs for higher code points instead. Escaping a regular expression changes its observable `RegExp.prototype.source` value.

Some output can still contain non-ASCII characters:

- Tagged template literal text is preserved because tag functions such as `String.raw` can observe its raw contents.
- JSX names, JSX text, and JSX attribute strings are preserved.
- Hashbangs and preserved comments, including legal comments, are preserved.

JavaScript expressions inside tagged templates and JSX are escaped normally.
