---
title: "Unsupported features | Oxfmt"
---

# Unsupported features

:::info
These features are planned. Follow our [milestone](https://github.com/oxc-project/oxc/milestone/19).
:::

## Configuration limitations

Not currently supported:

- `prettier` field in `package.json`
- Nested `.editorconfig` in sub directories
- `experimentalTernaries` option

Note: Default `printWidth` is `100` (Prettier uses `80`).

## Prettier plugins

Not supported.
However, popular plugins are built in.
See [Beyond Prettier](./beyond-prettier#built-in-plugins).

For what Oxfmt does support across frameworks and file types, see the [compatibility matrix](/compatibility).
