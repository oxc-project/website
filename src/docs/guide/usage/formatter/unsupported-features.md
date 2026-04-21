# Unsupported features

:::info
These features are planned. Follow our [milestone](https://github.com/oxc-project/oxc/milestone/19).
:::

## Configuration limitations

Not currently supported:

- `prettier` field in `package.json`
- Nested `.editorconfig` in sub directories
- `experimentalTernaries` and `experimentalOperatorPosition` options

Note: Default `printWidth` is `100` (Prettier uses `80`).

## Prettier plugins

Not supported. However, Oxfmt provides built-in alternatives:

- `sortImports`
  - Based on `eslint-plugin-perfectionist/sort-imports`
  - Disabled by default
- `sortTailwindcss`
  - Based on `prettier-plugin-tailwindcss`
  - Disabled by default
- `sortPackageJson`
  - Based on `prettier-plugin-packagejson`
  - Enabled by default
- `jsdoc`
  - Based on `prettier-plugin-jsdoc`
  - Disabled by default

See [Configuration file reference](./config-file-reference) for details.

For what Oxfmt does support across frameworks and file types, see the [compatibility matrix](/compatibility).
