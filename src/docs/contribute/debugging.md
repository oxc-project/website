---
title: Debugging
outline: deep
---

# Debugging

## OXC_LOG Environment Variable

The `OXC_LOG` environment variable enables runtime tracing in `oxlint` and `oxfmt`. When not set, logging is completely disabled for zero-cost operation.

### Basic Usage

```bash
# Enable debug logging for oxlint
OXC_LOG=debug oxlint

# Enable debug logging for oxfmt
OXC_LOG=debug oxfmt

# Enable resolver tracing when using import plugin
OXC_LOG=oxc_resolver oxlint --import-plugin

# Enable formatter tracing
OXC_LOG=oxc_formatter oxfmt
```

### Filter Syntax

`OXC_LOG` uses [tracing-subscriber](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/filter/struct.EnvFilter.html) filter syntax:

| Pattern                      | Description                              |
| ---------------------------- | ---------------------------------------- |
| `debug`                      | Enable debug level for all modules       |
| `trace`                      | Enable trace level for all modules       |
| `oxc_resolver`               | Enable all logs from oxc_resolver module |
| `oxc_resolver=debug`         | Enable debug level for oxc_resolver      |
| `oxc_resolver=trace`         | Enable trace level for oxc_resolver      |
| `oxc_formatter,oxc_resolver` | Enable multiple modules                  |

### Output

Logs are written to **stderr** to avoid interfering with the normal output of linter diagnostics or formatted code on stdout. In `oxfmt`, thread names and span timing information are included for debugging multi-threaded operations.

### Common Use Cases

**List all files being processed:**

```bash
OXC_LOG=debug oxlint
OXC_LOG=debug oxfmt
```

**Debugging module resolution issues:**

```bash
OXC_LOG=oxc_resolver=debug oxlint --import-plugin
```

## rust-lldb

rust-lldb can be used to get panic information from debug builds.

Enable debug symbols:

```toml Cargo.toml
[profile.release]
debug = true
strip = false
panic = "unwind"
```

Build the binary:

```bash
cargo build --release --bin oxlint --features allocator
```

Run the binary:

```bash
rust-lldb -- ./target/release/oxlint
```

Once it launches, press `r` for running the program.

## Debug TypeScript in VSCode

According to their [debugging guide](https://github.com/microsoft/TypeScript/blob/main/CONTRIBUTING.md#debugging-the-tests), in the TypeScript repository:

- rename `.vscode/launch.template.json` to `launch.json`
- add `tests/cases/compiler/foo.ts`
- change `"${fileBasenameNoExtension}"` to `foo.ts`
- set a breakpoint somewhere in TypeScript's source code
- from the menu "Run - Debugging", or press F5
- while debugging, tsc will evaluate global `.d.ts` files before the targeted test file
- `Debug.formatXXX(value)` from `src/compiler/debug.ts` can be used to print out enum values
- use the "WATCH" section to "see" value of interest

## Debug Linter in VSCode

It's easy to debug Linter for a npm project somewhere else with [CodeLLDB](https://marketplace.visualstudio.com/items?itemName=vadimcn.vscode-lldb).

In `.vscode/launch.json`, change config fields to your need:

- `cwd`: absolute path to the npm project
- `args`: arguments passed to linter

```json
{
  "type": "lldb",
  "request": "launch",
  "name": "Debug Oxlint",
  "cargo": {
    "env": {
      "RUSTFLAGS": "-g"
    },
    "args": ["build", "--bin=oxlint", "--package=oxlint"],
    "filter": {
      "name": "oxlint",
      "kind": "bin"
    }
  },
  "cwd": "PATH-TO-TEST-PROJECT", // [!code focus]
  "args": ["--ARGS-TO-OXLINT"] // [!code focus]
}
```

Open VS Code Debugging panel and select `Debug Oxlint`, then start debugging.

The debug process will be launched with specified `cwd`, like running linter in testing project and attaching debugger into it.
