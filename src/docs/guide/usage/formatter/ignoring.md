# Ignoring

## Ignore files

Oxfmt provides several ways to ignore files.

### `.gitignore`

Respects `.gitignore` in the current working directory and subdirectories.

Does not respect global, exclude, or `.gitignore` in parent directories.
Does not require `.git` directory to exist.

Files listed here can still be formatted if explicitly specified.
This is safe for use cases like `husky`, as ignored files are never staged.

### `.prettierignore` / `oxfmtrc.ignorePatterns`

These are formatter-specific ignore settings, separate from Git, and each operates within its own scope.

`.prettierignore` is only read from the current working directory. For `.oxfmtrc.json(c)`, see [Configuration](./config).

The syntax is the same as `.gitignore`, and paths are resolved relative to the directory containing the ignore file.

Files ignored here cannot be formatted even if explicitly specified. This behavior is intended for use cases like `husky`.

You can also specify custom ignore paths with `--ignore-path`, or use `!`-prefixed positional paths to exclude files.

### VCS directories and `node_modules`

Directories like `.git`, `.svn` and `.jj` are ignored by default.

The `node_modules` directory is also ignored unless `--with-node_modules` flag is specified.

If the current working directory is inside these directories, formatting is still possible.

### Lock files

Files like `package-lock.json` and `pnpm-lock.yaml` are ignored by default.

These cannot be formatted even if explicitly specified.

## Ignore comments

For JS/TS files, you can use `oxfmt-ignore` or `prettier-ignore`.

This takes effect on:

- the next statement / expression, or
- the current statement / expression when used as a trailing comment.

```js
// oxfmt-ignore
const a=42;

/* prettier-ignore */
const x=()=>{return      2;}

<>
  {/* oxfmt-ignore */}
  <span     ugly  format=''   />
</>;

const config={ retries:10, timeout:5000 }; // oxfmt-ignore
const data=[1,2,3]; /* prettier-ignore */
```

For non-JS files, the same convention as Prettier works.
Please see Prettier's [documentation](https://prettier.io/docs/ignore#html).

For TOML files, ignore comments are not supported.
