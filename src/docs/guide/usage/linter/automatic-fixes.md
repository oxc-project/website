---
title: Automatic fixes
description: Apply safe, suggested, and dangerous fixes with Oxlint.
---

# Automatic fixes

Oxlint can automatically fix some lint violations. Automatic fixes are only applied when passing the relevant CLI flags. You choose when to apply them.

In code editor integrations (such as VS Code, Zed, etc.), automatic fixes are exposed as "code actions" that you can apply in-editor.

You can see all rules which have fixers in [the rules list](/docs/guide/usage/linter/rules).

## Safe fixes

Safe fixes are changes that do not alter program behavior.

Apply safe fixes:

```bash
oxlint --fix
```

## Suggestions

Suggestions are changes that may alter behavior or may not match your intent.

Apply suggestions:

```bash
oxlint --fix-suggestions
```

## Dangerous fixes

Dangerous fixes are aggressive changes that may break your code.

Apply dangerous fixes:

```bash
oxlint --fix-dangerously
```

## Combining fix modes

You can combine safe fixes and suggestions:

```bash
oxlint --fix --fix-suggestions
```

You can also include dangerous fixes:

```bash
oxlint --fix --fix-suggestions --fix-dangerously
```

## Rule support

Not all rules provide fixes. Some rules support safe fixes, some provide suggestions, and some do not provide fixes yet.
For some rules, a fixer is not realistically possible and cannot or should not be added.

If a rule is missing a fixer and you believe it warrants one, contributions are welcome.

## Type-aware linting and fixes

Fixers can be applied with [type-aware lint rules](/docs/guide/usage/linter/type-aware) as well.

You can apply safe fixes with type-aware linting enabled like so:

```bash
oxlint --type-aware --fix
```

## JS Plugins

[JS Plugins](/docs/guide/usage/linter/js-plugins) that provide fixers or suggestions can also be applied by Oxlint.
