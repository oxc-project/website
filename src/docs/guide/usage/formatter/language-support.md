---
title: "Language support | Oxfmt"
---

# Language support

Oxfmt formats a wide range of file types. Most are handled by Oxfmt's own **native** engine, written in Rust. The rest are delegated to a **bundled Prettier** for languages Oxfmt has not yet reimplemented natively. We are actively porting every language to Rust for maximum performance, so the Prettier-backed list keeps shrinking as native support lands.

:::info
Native formats run entirely in Rust with no Node.js round-trip, so they are the fastest. Prettier-backed formats ship inside the `oxfmt` package and need no extra setup — except `.svelte`, which additionally requires the `svelte` package to be installed and the [`svelte`](./config-file-reference) option to be enabled.
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

Detection also covers many well-known config files by name — for example `.babelrc` and `.swcrc` are treated as JSON. `package.json` is additionally sorted before formatting (see [Sorting](./sorting)).

## Prettier-backed

Delegated to the bundled Prettier. No separate `prettier` install is required.

:::tip
These are being actively ported to Rust. As each native formatter lands, its language moves to the [Native](#native) list above for maximum performance — no change needed on your side.
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

Some config files are also matched by name — for example `.prettierrc` and `.clang-format` are treated as YAML. When Prettier formats a file that embeds JavaScript or TypeScript (such as a Vue or Svelte `<script>` block), that embedded code is formatted by Oxfmt's native engine rather than Prettier.

## Embedded languages

Oxfmt also formats code embedded inside JS/TS template literals. CSS and GraphQL are formatted natively; HTML and Markdown go through Prettier. See [Embedded Formatting](./embedded-formatting) for details and examples.

## See also

- [Compatibility matrix](/compatibility) — framework- and file-type-level support at a glance
- [Unsupported features](./unsupported-features)
