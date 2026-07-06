---
title: "Language support | Oxfmt"
---

# Language support

Oxfmt formats a wide range of file types. Most are handled by Oxfmt's own **native** engine, written in Rust. The rest are delegated to a **bundled Prettier** for languages Oxfmt has not yet reimplemented natively. We are actively porting every language to Rust for maximum performance, so the Prettier-backed list keeps shrinking as native support lands.

:::info
Native formats run entirely in Rust with no Node.js round-trip, so they are the fastest. Prettier-backed formats ship inside the `oxfmt` package and need no extra setup. Except `.svelte`, which additionally requires the `svelte` package to be installed and the [`svelte`](./config-file-reference) option to be enabled.
:::

## Native

Formatted directly by Oxfmt, with no Prettier dependency:

| Language             | Extensions                                    |
| -------------------- | --------------------------------------------- |
| JavaScript / JSX     | `.js`, `.jsx`, `.mjs`, `.cjs`, and more       |
| TypeScript / TSX     | `.ts`, `.tsx`, `.mts`, `.cts`, `.d.ts`        |
| JSON / JSONC / JSON5 | `.json`, `.jsonc`, `.json5`                   |
| CSS / SCSS / Less    | `.css`, `.scss`, `.less`, `.pcss`, `.postcss` |
| GraphQL              | `.graphql`, `.gql`, `.graphqls`               |
| TOML                 | `.toml`                                       |

Detection also covers many well-known config files by name. For example `.babelrc` and `.swcrc` are treated as JSON.

## Prettier-backed

Delegated to the bundled Prettier. No separate `prettier` install is required.

:::tip
These are being actively ported to Rust. As each native formatter lands, its language moves to the [Native](#native) list above for maximum performance. No change needed on your side.
:::

| Language   | Extensions                |
| ---------- | ------------------------- |
| HTML       | `.html`, `.htm`, `.xhtml` |
| Angular    | `*.component.html`        |
| Vue        | `.vue`                    |
| Svelte     | `.svelte`                 |
| Markdown   | `.md`, `.markdown`        |
| MDX        | `.mdx`                    |
| YAML       | `.yml`, `.yaml`           |
| Handlebars | `.hbs`, `.handlebars`     |
| MJML       | `.mjml`                   |

## Embedded languages

Oxfmt also formats code embedded inside JS/TS template literals. CSS and GraphQL are formatted natively; HTML and Markdown go through Prettier. See [Embedded Formatting](./embedded-formatting) for details and examples.

For Vue and Svelte files, embedded JavaScript and TypeScript (such as `<script>` blocks) is formatted by Oxfmt's native engine rather than Prettier. Embedded JS/TS in the other Prettier-backed formats (such as `<script>` tags in HTML) is still formatted by Prettier.

## See also

- [Compatibility matrix](/compatibility) — framework- and file-type-level support at a glance
- [Unsupported features](./unsupported-features)
