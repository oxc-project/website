# Inline ignore comments

For JS/TS files, use `oxfmt-ignore` or `prettier-ignore` to skip formatting:

- the next statement / expression, or
- the current statement / expression when the comment is trailing on the same line.

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

const config={ retries:10, timeout:5000 }; // oxfmt-ignore
const data=[1,2,3]; /* prettier-ignore */
```
<!-- prettier-ignore-end -->

For non-JS files, use `prettier-ignore` comment. See also Prettier's [ignore documentation](https://prettier.io/docs/ignore#html).

Currently, TOML files do not support ignore comments.

## Prettier compatibility

- `prettier-ignore` comments are supported for JS/TS
- Trailing ignore comments in JS/TS files are supported
