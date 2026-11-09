---
title: "Beyond Prettier | Oxfmt"
---

# Beyond Prettier

Oxfmt uses Prettier's output as its baseline.
On top of that, it ships features that Prettier does not have, or only has through plugins.

For intentional output differences that fix Prettier bugs, see [Known divergences](./migrate-from-prettier#known-divergences).

## Built-in plugins

Popular Prettier plugins are built in, with no extra install:

- [`sortImports`](./sorting#sort-imports)
  - Based on `eslint-plugin-perfectionist/sort-imports`
  - Disabled by default
- [`sortTailwindcss`](./sorting#sort-tailwind-css-classes)
  - Based on `prettier-plugin-tailwindcss`
  - Disabled by default
- [`sortPackageJson`](./sorting#sort-package-json-fields)
  - Based on `prettier-plugin-packagejson`
  - Enabled by default
- [`jsdoc`](./config-file-reference#jsdoc)
  - Based on `prettier-plugin-jsdoc`
  - Disabled by default

`oxfmt --migrate prettier` converts their options too.
See [Migrate from Prettier](./migrate-from-prettier#step-3-migrate-configuration).

## JavaScript / TypeScript

### Test calls

Like Prettier, Oxfmt keeps a test call's description and callback on one line, even if it exceeds `printWidth`.
Prettier does this only for Jest / Jasmine / Playwright style calls (`it`, `describe`, `test` with `.only` / `.skip`, etc.).
Oxfmt also recognizes:

- Vitest: `.concurrent`, `.sequential`, `.fails`, `.shuffle`, `bench`
- `Deno.test`

<!-- oxfmt-ignore-start -->
```js
// Oxfmt, printWidth: 80
it.concurrent("does something really long and descriptive with the formatter output", async () => {
  expect(1).toBe(1);
});

// Prettier, printWidth: 80
it.concurrent(
  "does something really long and descriptive with the formatter output",
  async () => {
    expect(1).toBe(1);
  },
);
```
<!-- oxfmt-ignore-end -->

## TOML

### Native support

`.toml` files are formatted natively.
Prettier needs a plugin for TOML.

### TOML in Markdown

`+++` front matter and `toml` code blocks in Markdown are formatted too:

<!-- oxfmt-ignore-start -->
````md
<!-- input -->
+++
a   =   1
+++

```toml
b   =  [1,2]
```

<!-- Oxfmt -->
+++
a = 1
+++

```toml
b = [1, 2]
```
````
<!-- oxfmt-ignore-end -->

Prettier leaves both as-is.

## Markdown

### Container directives

`:::` container directives (VitePress, Docusaurus, remark-directive, Pandoc) are parsed as blocks.
Fence lines are kept as written, and only the content inside is formatted.

<!-- oxfmt-ignore-start -->
```md
<!-- input -->
:::warning
Some **text** that is
long.
:::

<!-- Oxfmt, proseWrap: "always" -->
:::warning
Some **text** that is long.
:::

<!-- Prettier, proseWrap: "always" -->
:::warning Some **text** that is long. :::
```
<!-- oxfmt-ignore-end -->

Prettier treats the fences as plain text and merges them into the paragraph, which breaks the container.

## HTML

### Dynamic end tags in HTML in JS

In `html` tagged templates (Lit, Solid, etc.), an element whose end tag is a `${}` expression is formatted:

<!-- oxfmt-ignore-start -->
```js
// input
const view = html`
  <${Show} when=${loggedIn}>
      <p>Welcome back!</p>
   <button   onclick=${logout}>Log out</button>
  </${Show}>
`;

// Oxfmt
const view = html`
  <${Show} when=${loggedIn}>
    <p>Welcome back!</p>
    <button onclick=${logout}>Log out</button>
  </${Show}>
`;
```
<!-- oxfmt-ignore-end -->

Prettier fails to parse the end tag and leaves the whole template as-is.

## Vue

### TypeScript in templates of `lang="tsx"`

In a Vue file whose `<script>` is `lang="tsx"`, template expressions are parsed as TSX, as Vue's compiler does:

<!-- oxfmt-ignore-start -->
```vue
<!-- input -->
<script setup lang="tsx">
const a = <div />;
</script>

<template>
  <p>{{ (value  as  Item).name }}</p>
</template>

<!-- Oxfmt -->
<script setup lang="tsx">
const a = <div />;
</script>

<template>
  <p>{{ (value as Item).name }}</p>
</template>
```
<!-- oxfmt-ignore-end -->

Prettier parses them as TypeScript only for `lang="ts"`, and leaves TypeScript syntax as-is for `lang="tsx"`.

## Options

- [`insertFinalNewline`](./config-file-reference#insertfinalnewline)
  - Whether to insert a final newline at the end of the file.
  - Also respects `insert_final_newline` in `.editorconfig`.
