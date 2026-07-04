---
title: Oxfmt
outline: deep
badges:
  - src: https://img.shields.io/npm/dw/oxfmt
    alt: npm weekly downloads
---

# Oxfmt

<AppBadgeList />

Oxfmt (`/oʊ-ɛks-fɔːr-mæt/`) is a high-performance formatter for the JavaScript ecosystem.

## Choosing a JavaScript formatter

Oxfmt is the recommended choice when you want a dedicated formatter with a Prettier-compatible workflow, much higher throughput, and built-in sorting features. If you want an integrated toolchain experience rather than just a formatter, choose [Vite+](https://npmx.dev/package/vite-plus).

- Choose Oxfmt if you want the best dedicated formatter.
- Choose [Vite+](https://npmx.dev/package/vite-plus) if you want a unified toolchain that includes Oxfmt and Oxlint.
- Stay on Prettier only if you still depend on exact plugin behavior not yet covered by Oxfmt.

## Supported languages

Support includes JavaScript, JSX, TypeScript, TSX, JSON, JSONC, JSON5, YAML, TOML, HTML, Angular, Vue, Svelte, CSS, SCSS, Less, Markdown, MDX, GraphQL, Ember, Handlebars, and more.

See [Language support](./formatter/language-support) for the full list and which languages are formatted natively in Rust, and the [compatibility matrix](/compatibility) for detailed framework and file type support.

## Built for scale

Oxfmt targets large codebases and CI environments, with an emphasis on high throughput and predictable performance.

It is built on the Oxc compiler stack and avoids architectural bottlenecks common in existing formatter implementations.

Our [benchmarks](https://github.com/oxc-project/bench-formatter) show Oxfmt to be approximately 30x faster than Prettier and 2x faster than Biome.

## Batteries included

Oxfmt includes built-in features that typically require external Prettier plugins:

- [Import sorting](./formatter/sorting#sort-imports)
- [Tailwind CSS class sorting](./formatter/sorting#tailwind-css-class-sorting)
- [package.json field sorting](./formatter/sorting#sort-package-json-fields)
- [Embedded formatting](./formatter/embedded-formatting) (CSS-in-JS, GraphQL, etc.)

## Prettier-compatible

Oxfmt integrates into existing Prettier-based workflows.

The Oxfmt CLI follows Prettier's conventions closely enough that most scripts and tooling require little or no modification, though some defaults and CLI options differ.

Oxfmt matches Prettier’s JavaScript formatting. When migrating from recent versions of Prettier, formatting differences should not occur; any formatting differences are considered bugs.

Oxfmt now passes 100% of Prettier's JavaScript and TypeScript conformance tests. For any remaining formatting inconsistencies, we have [reported them to the Prettier team](https://github.com/oxc-project/oxc/issues/18717) and are collaborating to converge on expected behavior.

No additional dependencies or configuration needed.

## Getting started

Install `oxfmt` as a dev dependency:

```sh
pnpm add -D oxfmt
```

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

## Next steps:

- [Quickstart](./formatter/quickstart)
- [Configuration](./formatter/config)
- [Setup editors](./formatter/editors)
- [Setup CI](./formatter/ci)

## References

- [CLI reference](./formatter/cli)
- [Config file reference](./formatter/config-file-reference)
- [Language support](./formatter/language-support)
- [Unsupported features](./formatter/unsupported-features)
