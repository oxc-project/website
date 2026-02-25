---
title: Versioning policy
editLink: false
---

# Versioning policy

Oxlint follows semantic versioning, with the goal of providing clarity and predictability as you upgrade.

What's considered a **breaking** change:

- Changes to the CLI interface that would break existing workflows.
- Changes to the configuration file (`.oxlintrc.json`) that would break existing setups.
- Renaming or removing a rule.

What's considered a **non-breaking** change:

- Adding new lint rules.
- Changing the default configuration for a rule.
- Improving rule descriptions or diagnostic messages.
- Adding new config options to existing rules.
- Fixes that change rule behavior to better align with the original ESLint rule's behavior.
- Adding new fields to the configuration file.

## Features Not Subject to Semver

The following features are **experimental** and are not subject to semantic versioning. They may introduce breaking changes at any time, even in patch or minor releases:

- **JavaScript custom plugins** - The plugin API and behavior may change without notice.
- **Type-aware linting** - Type-aware rules and their behavior may change as this feature evolves.

## Are New Lint Errors a Breaking Change?

If a new version of Oxlint reports additional issues in your code, that’s expected. This behavior means Oxlint has improved — not that something in your project broke. New errors reflect stronger analysis, not a broken upgrade.

## What to Expect from New Versions

- **Patch version** (1.0.x): Bug fixes, performance improvements, internal refactors. These are always safe to upgrade.
- **Minor version** (1.x.0): New rules, better diagnostics, new features. These are not considered breaking changes even if they cause new errors to appear in your codebase.
- **Major version** (x.0.0): Reserved for breaking changes to the CLI or configuration format.

## With Renovate Bot

Add the snippet below to your Renovate config to let it keep Oxlint automatically up to date.

```json [renovate.json]
{
  "extends": ["config:recommended"],
  "packageRules": [
    {
      "matchPackageNames": ["oxlint"],
      "groupName": "oxlint",
      "automergeType": "branch",
      "stabilityDays": 1
    }
  ]
}
```

If you use [eslint-plugin-oxlint](https://npmx.dev/package/eslint-plugin-oxlint), ensure that it is also updated alongside Oxlint to avoid compatibility issues.

## With Dependabot

Add the snippet below to your Dependabot config to let it keep Oxlint automatically up to date.

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/" # location of package.json
    schedule:
      interval: "daily"
    groups: # group all Oxlint updates together
      oxlint:
        patterns:
          - "oxlint"
    commit-message: # keep the history tidy
      prefix: "chore"
      include: "scope"
    ignore: # optional: ignore future majors
      - dependency-name: "oxlint"
        update-types: ["version-update:semver-major"]
    open-pull-requests-limit: 1 # one PR at a time
```

If you use [eslint-plugin-oxlint](https://npmx.dev/package/eslint-plugin-oxlint), ensure that it is also updated alongside Oxlint to avoid compatibility issues.
