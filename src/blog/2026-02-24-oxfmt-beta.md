---
title: "Oxfmt Beta"
outline: deep
authors:
  - boshen
  - Dunqing
  - leaysgur
---

<AppBlogPostHeader />

We are excited to announce that Oxfmt has reached beta.

Oxfmt is a Rust-powered, Prettier-compatible code formatter built for the JavaScript ecosystem. It is designed to deliver full compatibility with modern tooling while dramatically improving performance.

In benchmarks, Oxfmt is more than 30× faster than Prettier and 3× faster than Biome on an initial run without caching. See the full [benchmark](https://github.com/oxc-project/bench-formatter) results.

Since the December alpha release, we have expanded support for additional file formats, added embedded language formatting, introduced import sorting, integrated Tailwind CSS support, and delivered numerous stability and compatibility improvements.

Oxfmt has already seen broad adoption across the ecosystem. Projects using Oxfmt include: [openclaw/openclaw](https://github.com/openclaw/openclaw), [vuejs/core](https://github.com/vuejs/core), [vercel/turborepo](https://github.com/vercel/turborepo), [huggingface/huggingface.js](https://github.com/huggingface/huggingface.js), [getsentry/sentry-javascript](https://github.com/getsentry/sentry-javascript), [npmx-dev/npmx.dev](https://github.com/npmx-dev/npmx.dev) and many more.

## Getting Started

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

### Migrating from Prettier

Install, migrate your config, and reformat in a single command:

```sh
pnpm add -D oxfmt && pnpm oxfmt --migrate prettier && pnpm oxfmt
```

For the full migration guide, see [Migrate from Prettier](/docs/guide/usage/formatter/migrate-from-prettier.html).

### AI Migration Prompt

Alternatively, you can copy this prompt to your AI coding assistant to migrate your project:

```
Migrate this project from Prettier to Oxfmt following https://oxc.rs/docs/guide/usage/formatter.html:
1. Install oxfmt and run `oxfmt --migrate prettier`
2. Update package.json scripts to use oxfmt
3. Update CI workflows to use `oxfmt --check`
4. Update lint-staged to use `oxfmt --no-error-on-unmatched-pattern`
5. Run oxfmt to reformat all files
6. Uninstall prettier and related packages
7. Update editor settings for oxfmt
8. Update CONTRIBUTING.md, AGENTS.md, or CLAUDE.md if they mention prettier
```

For more detailed instructions, check out the [Oxfmt docs](https://oxc.rs/docs/guide/usage/formatter.html).

## Highlights of New Features Since Alpha

### 100% Prettier Compatibility

Oxfmt now passes 100% of Prettier's JavaScript and TypeScript conformance tests. For the few remaining formatting inconsistencies, we have [reported them to the Prettier team](https://github.com/oxc-project/oxc/issues/18717) and are collaborating to converge on the expected behavior.

This means you can migrate from Prettier to Oxfmt with confidence that your code will be formatted identically. If you encounter any uncovered cases, please [report them](https://github.com/oxc-project/oxc/issues/new?template=formatter_diff_report.yaml).

### Additional File Formats

Oxfmt now formats JavaScript, JSX, TypeScript, TSX, JSON, JSONC, JSON5, YAML, TOML, HTML, Angular, Vue, CSS, SCSS, Less, Markdown, MDX, GraphQL, Ember, and Handlebars. This means you can use a single formatter for your entire project.

### Tailwind CSS Integration

Automatic [Tailwind CSS class sorting](/docs/guide/usage/formatter/sorting.html#sort-tailwind-css-classes) is supported for both JS/TS and non-JS/TS files. The functionality of `prettier-plugin-tailwindcss` is built-in, so the plugin is no longer required.

### Import Sorting

Built-in [import sorting](/docs/guide/usage/formatter/sorting.html#sort-imports) is now available with configurable options:

- `ignoreCase` - Case-insensitive sorting
- `sortSideEffects` - Sort side-effect imports
- `newlinesBetween` - Control blank lines between import groups
- `groups` - Custom sort order groups
- `customGroups` - Define custom grouping rules

For more options, please see the [full reference](/docs/guide/usage/formatter/config-file-reference.html#sortimports).

### `package.json` Sorting

Automatic [package.json field sorting](/docs/guide/usage/formatter/sorting.html#sort-package-json-fields) is enabled by default, keeping your package.json files consistently organized.

### Embedded Language Formatting

Format code [embedded in template literals](/docs/guide/usage/formatter/embedded-formatting.html):

- CSS-in-JS with styled-components-like syntaxes, `styled-jsx` and CSS prop support
- Angular `@Component` template and styles

### Node.js API

A programmatic API is now available:

```ts
import { format, type FormatOptions } from "oxfmt";

const input = `let a=42;`;
const options: FormatOptions = {
  semi: false,
};

const { code } = await format("a.js", input, options);
console.log(code); // "let a = 42"
```

### [CLI Changes](/docs/guide/usage/formatter/cli.html)

- `--init` - Bootstrap a new configuration file
- `--migrate prettier` - Migrate from Prettier configuration
- `--migrate biome` - Migrate from Biome configuration
- `--stdin-filepath` - Specify filepath for stdin input
- Glob pattern expansion support - `oxfmt './packages/**/*.{js,jsx}'`

### [Config Changes](/docs/guide/usage/formatter/config.html)

- [`overrides`](/docs/guide/usage/formatter/config.html#overrides) - Apply different options to specific file patterns
- [`insertFinalNewline`](/docs/guide/usage/formatter/config.html#insertfinalnewline) - Control trailing newlines
- [`.editorconfig`](/docs/guide/usage/formatter/config.html#editorconfig) support for `insert_final_newline`

### [Editor Support](/docs/guide/usage/formatter/editors.html)

Oxfmt works in all supported editors: VS Code, Cursor, Zed, IntelliJ IDEA, WebStorm, Neovim, and any editor with LSP support.

## Roadmap

We are continuing to improve Oxfmt towards a stable release:

- Prettier plugins support
- Improve xxx-in-js formatting
- Stability
- Performance optimizations

## Next Steps

See the full installation guide in the [Oxfmt docs](/docs/guide/usage/formatter.html).

### Reporting Issues

For formatting differences, please refer to the [formatting differences discussion](https://github.com/oxc-project/oxc/discussions/14669).

### Join the Community

We'd love to hear your feedback on Oxfmt. Connect with us:

- Discord: Join our [community server](https://discord.gg/9uXCAwqQZW) for real-time discussions
- GitHub: Share feedback on the [Formatter RFC](https://github.com/oxc-project/oxc/discussions/13608)
- Issues: Report bugs or request features on our [issue tracker](https://github.com/oxc-project/oxc/issues)
