---
title: "Inline ignore comments | Oxfmt"
---

# Inline ignore comments

For JS/TS files, use `oxfmt-ignore` to skip formatting the next statement:

<!-- prettier-ignore-start -->
```js
// oxfmt-ignore
const a    = 42;

/* oxfmt-ignore */
const x = () => { return 2; };

<>
  {/* oxfmt-ignore */}
  <span   ugly   format=""   />
</>;
```
<!-- prettier-ignore-end -->

For JS in Vue, Svelte, and Astro files, use `oxfmt-ignore` inside the `<script>` tag:

<!-- prettier-ignore-start -->
```vue
<script>
// oxfmt-ignore
const a    = 42;
</script>
```
<!-- prettier-ignore-end -->

Trailing ignore comments are also supported:

<!-- prettier-ignore-start -->
```js
const a    = 42; // oxfmt-ignore
```
<!-- prettier-ignore-end -->

Other [native](./language-support#native) languages also support `oxfmt-ignore` in their own comment syntax:

- `<!-- oxfmt-ignore -->` for Markdown
- `/* oxfmt-ignore */` for CSS, SCSS, and Less
- `# oxfmt-ignore` for YAML and GraphQL

For the rest of Vue, Svelte, and Astro files (e.g., markup, `<style>`) and other [Prettier-backed](./language-support#prettier-backed) files, use `prettier-ignore` comment. See also Prettier's [ignore documentation](https://prettier.io/docs/ignore).

Currently, TOML files do not support ignore comments.

## Prettier compatibility

- `prettier-ignore` comment is also supported
