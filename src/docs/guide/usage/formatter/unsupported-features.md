# Unsupported features

:::info
These features are planned. Follow our [milestone](https://github.com/oxc-project/oxc/milestone/15).
:::

## Configuration limitations

Not currently supported:

- `prettier` field in `package.json`
- Config file format other than `.json` and `.jsonc`
- Nested configs in sub directories
- Nested `.editorconfig` in sub directories
- `experimentalTernaries` and `experimentalOperatorPosition` options

Note: Default `printWidth` is `100` (Prettier uses `80`).

## Prettier plugins

Not supported. However, Oxfmt provides built-in alternatives:

- `experimentalSortImports`
  - Based on `eslint-plugin-perfectionist/sort-imports`
  - Disabled by default
- `experimentalSortPackageJson`
  - Based on `prettier-plugin-packagejson`
  - Enabled by default
- `experimentalTailwindcss`
  - Based on `prettier-plugin-tailwindcss`
  - Disabled by default

See [Configuration file reference](./config-file-reference) for details.

## Bun Runtime

https://github.com/oven-sh/bun/issues/25658 to be fixed.
