---
title: Bulk suppressions
description: Suppress existing lint errors in bulk and fix them over time.
---

# Bulk suppressions

Enabling a new lint rule in an existing codebase can often introduce many lint errors, which can be challenging to try and fix all at once if no fix is provided automatically. Bulk suppressions allow you to enable a new rule but ignore all existing violations initially so that you can gradually fix them over time. Errors in new code will still be reported, but existing violations will be suppressed until you are ready to address them.

With bulk suppressions, you can incrementally improve the code quality over time of a codebase by enabling more lint rules, but without needing to fix all existing issues immediately.

> [!WARNING]
> Only lint errors will be suppressed. Rules configured to `warning` severity will NOT be suppressed. If you want warnings to be suppressed, consider setting their severity to `error` instead and then suppressing again.
>
> Since the intent of bulk suppressions is to allow linting to succeed even with existing errors, this means we only suppress issues that would cause the linting to report a failure exit code.

## Suppressing errors

To suppress all existing lint rule violations, you can use the `--suppress-all` option. We also recommend using the `--fix` option as well so that any automatic fixes are applied first.

```sh
oxlint --suppress-all
```

This will update (or create) the `oxlint-suppressions.json` in the current working directory and suppress all of the existing violations of lint rules in the codebase. The `oxlint-suppressions.json` file should be committed to source so that the linting behavior is consistent everywhere.

## Resolving suppressed errors

When a suppressed error is resolved, the linter will exit with failure and indicate:

```
  x There are suppressions that do not occur anymore.
```

This is because you now have fewer errors than you did previously. Congratulations! To resolve this error, run the linter again and use the `--prune-suppressions` option. This will remove all errors that no longer occur while linting.

```sh
oxlint --prune-suppressions
```

## Multiple suppression files / multiple projects

Bulk suppressions in `oxlint` are designed to create and use a single `oxlint-suppressions.json` file. If you have a project that contains multiple packages (e.g., a "monorepo" setup) and want to have suppressions on a per-package basis, then we recommend running the linter once per package instead. That is, instead of running:

```sh
oxlint packages/
```

You would run:

```sh
oxlint . # in packages/package-a
oxlint . # in packages/package-b
```

A task runner like [Vite+'s `vp run` command](https://viteplus.dev/guide/run) can do this automatically for you with the recursive flag (`-r`):

```sh
vp run -r lint # Run the `lint` script in each package
```
