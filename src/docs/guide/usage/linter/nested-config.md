---
title: Nested configuration files
description: Use multiple .oxlintrc.json files to apply different Oxlint settings to different parts of a repository.
---

# Nested configuration files

Oxlint can use multiple configuration files in the same repository. It automatically detects configuration files named `.oxlintrc.json` and applies them based on where files live in the directory tree.

This is useful in monorepos where packages need their own settings, while still keeping a shared baseline.

If you only need to exclude files or folders, use [Ignores](./ignore-files) instead.

## How it works

For each file being linted, Oxlint uses the nearest `.oxlintrc.json` relative to that file.

Given the following structure:

```
my-project/
├── .oxlintrc.json
├── src/
│   ├── index.js
├── package1/
│   ├── .oxlintrc.json
│   └── index.js
└── package2/
    ├── .oxlintrc.json
    └── index.js
```

Configuration resolution works as follows:

- `src/index.js` uses `my-project/.oxlintrc.json`
- `package1/index.js` uses `my-project/package1/.oxlintrc.json`
- `package2/index.js` uses `my-project/package2/.oxlintrc.json`

## What to expect

Configuration files are not automatically merged. A config in a child directory does not affect the parent config.

Command line options override configuration files, regardless of whether they come from a parent or child directory.

Passing an explicit config file location using `-c` or `--config` disables nested config lookup, and Oxlint will only use that single configuration file.

You can also disable nested configs with the `--disable-nested-config` flag.

## Monorepo pattern: share a base config with extends

In a monorepo, you often want one shared baseline at the root, and small package specific adjustments.

You do this by keeping a root `.oxlintrc.json`, then having package configs extend it.

```json [my-project/.oxlintrc.json]
{
  "rules": {
    "no-debugger": "error"
  }
}
```

```json [my-project/package1/.oxlintrc.json]
{
  "extends": ["../.oxlintrc.json"],
  "rules": {
    "no-console": "off"
  }
}
```

This keeps the shared baseline in one place and makes package configs small and focused.

## Extending configuration files

A config can reuse settings from other files using `extends`. The value is an array of file paths, resolved relative to the config file that declares them.

Extended files can have any name. They do not need to be named `.oxlintrc.json`, as long as they are valid JSON configuration files.

Example:

```json [oxlint-typescript.json]
{
  "plugins": ["typescript"],
  "rules": {
    "typescript/no-explicit-any": "error"
  }
}
```

```json [.oxlintrc.json]
{
  "extends": ["oxlint-typescript.json"],
  "rules": {
    "no-unused-vars": "warn"
  }
}
```

Only some properties can be extended. The supported properties are:

- `rules`
- `plugins`
- `overrides`
