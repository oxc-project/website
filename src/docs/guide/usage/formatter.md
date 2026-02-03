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

## Supported languages

JavaScript, JSX, TypeScript, TSX, JSON, JSONC, JSON5, YAML, TOML, HTML, Angular, Vue, CSS, SCSS, Less, Markdown, MDX, GraphQL, Ember, Handlebars

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

The `oxfmt` CLI behaves similarly to Prettier by default, allowing adoption with minimal changes to scripts and tooling.

Oxfmt matches Prettier’s JavaScript formatting. When migrating from recent versions of Prettier, formatting differences should not occur; any differences are considered bugs.

Oxfmt currently passes approximately 95% of Prettier's JavaScript and TypeScript test suite. The remaining cases are niche scenarios, and we work with the Prettier team to converge on formatting over time.

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
- [Unsupported features](./formatter/unsupported-features)
