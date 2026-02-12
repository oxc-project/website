---
title: Quickstart
description: Install Oxfmt and learn the common workflows.
---

# Quickstart

Recommended setup and common workflows.

## Install

Install `oxfmt` as a dev dependency:

::: code-group

```sh [npm]
$ npm add -D oxfmt
```

```sh [pnpm]
$ pnpm add -D oxfmt
```

```sh [yarn]
$ yarn add -D oxfmt
```

```sh [bun]
$ bun add -D oxfmt
```

:::

Add scripts to `package.json`:

```json [package.json]
{
  "scripts": {
    "fmt": "oxfmt",
    "fmt:check": "oxfmt --check"
  }
}
```

Format files:

```sh
pnpm run fmt
```

Check formatting without writing files:

```sh
pnpm run fmt:check
```

## Usage

```sh
oxfmt [OPTIONS] [PATH]...
```

Running `oxfmt` without arguments formats the current directory (equivalent to `prettier --write .`).

CLI options like `--no-semi` are not supported. Use the configuration file instead to ensure consistent settings across CLI and editor integrations.

To use glob patterns in positional paths, be sure to quote them. Otherwise, they may or may not be expanded depending on your environment.

For the complete list of options, see the [CLI reference](/docs/guide/usage/formatter/cli.html).

## Common workflows

### Pre-commit with lint-staged

```json [package.json]
{
  "lint-staged": {
    "*": "oxfmt --no-error-on-unmatched-pattern"
  }
}
```

`--no-error-on-unmatched-pattern` prevents errors when no files match the pattern.

### Create a config file

Initialize `.oxfmtrc.json` with defaults:

```sh
oxfmt --init
```

### Migrate from Prettier

```sh
oxfmt --migrate prettier
```

See [migrate from prettier](./migrate-from-prettier) for details.

### List files that differ

```sh
oxfmt --list-different
```

This is useful for configuring [files to ignore](./ignore-files).

### Piping file contents

```sh
echo 'const   x   =   1' | oxfmt --stdin-filepath test.ts
```

Prints `const x = 1;`

### Node.js API

```ts
import { format, type FormatOptions } from "oxfmt";

const input = `let a=42;`;
const options: FormatOptions = {
  semi: false,
};

const { code } = await format("a.js", input, options);
console.log(code); // "let a = 42"
```

## Next steps

- [Change configuration](./config)
- [Setup editors](./editors)
- [Setup CI](./ci)
- Learn advanced features: [sorting](./sorting), [embedded formatting](./embedded-formatting)
- Check [CLI reference](./cli)
