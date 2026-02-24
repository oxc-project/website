# Sorting

Oxfmt includes sorting features for imports, Tailwind classes, and package.json.

- [Sort imports](#sort-imports)
- [Sort Tailwind CSS classes](#sort-tailwind-css-classes)
- [Sort package.json fields](#sort-package-json-fields)

See [Configuration file reference](./config-file-reference) for full details.

## Sort imports

Based on [eslint-plugin-perfectionist/sort-imports](https://perfectionist.dev/rules/sort-imports).

Disabled by default.

### Example configuration

The same order as `eslint-plugin-perfectionist/sort-imports` default.

```json [.oxfmtrc.json]
{
  "sortImports": {
    "groups": [
      "type-import",
      ["value-builtin", "value-external"],
      "type-internal",
      "value-internal",
      ["type-parent", "type-sibling", "type-index"],
      ["value-parent", "value-sibling", "value-index"],
      "unknown"
    ]
  }
}
```

Use `"newlinesBetween": false` at the top level to disable newlines between groups, then use `{ "newlinesBetween": true }` within `groups` to insert a newline at a specific point.

```json [.oxfmtrc.json]
{
  "sortImports": {
    "newlinesBetween": false,
    "groups": [
      ["value-builtin", "value-external"],
      ["value-internal", "value-parent", "value-sibling", "value-index"],
      { "newlinesBetween": true },
      "type-import",
      "unknown"
    ]
  }
}
```

Use `customGroups` to define your own groups for matching specific imports. Each custom group has a `groupName` that can be referenced in `groups`. The `elementNamePattern` accepts glob patterns to match import sources.

```json [.oxfmtrc.json]
{
  "sortImports": {
    "customGroups": [
      {
        "groupName": "react-libs",
        "elementNamePattern": ["react", "react-**"]
      }
    ],
    "groups": [
      "react-libs",
      ["value-builtin", "value-external"],
      "value-internal",
      ["value-parent", "value-sibling", "value-index"],
      "unknown"
    ]
  }
}
```

## Sort Tailwind CSS classes

Sorts Tailwind utility classes.

Based on [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss).

Disabled by default.

### Example configuration

```json [.oxfmtrc.json]
{
  "sortTailwindcss": {
    "stylesheet": "./path/to/stylesheet.css",
    "functions": ["clsx", "cn"],
    "preserveWhitespace": true
  }
}
```

Regex patterns for `attributes` and `functions` are not supported.

## Sort package.json fields

Sorts keys in `package.json` using an opinionated order.

See [field ordering](https://github.com/oxc-project/sort-package-json?tab=readme-ov-file#field-ordering) for details.

Enabled by default.

### Example configuration

To disable:

```json [.oxfmtrc.json]
{
  "sortPackageJson": false
}
```

To sort `scripts` alphabetically:

```json [.oxfmtrc.json]
{
  "sortPackageJson": {
    "sortScripts": true
  }
}
```
