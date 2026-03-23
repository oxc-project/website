---
title: Type-Aware Linting
description: Linting with type information.
---

# Type-Aware Linting

Type-aware linting enables rules that rely on TypeScript’s type system, such as detecting unhandled promises or unsafe assignments. In Oxlint, type-aware linting is provided by [`tsgolint`](https://github.com/oxc-project/tsgolint) and is integrated into the Oxlint CLI and configuration system.

Type-aware linting currently supports [59 out of 61](https://github.com/oxc-project/tsgolint/tree/main?tab=readme-ov-file#implemented-rules) type-aware rules from typescript-eslint. Rule coverage, performance, and compatibility continue to improve.

## Overview

Oxlint separates responsibilities between two components:

- **Oxlint (Rust)**
  Handles file traversal, ignore logic, configuration, non-type-aware rules, and reporting.

- **tsgolint (Go)**
  Builds TypeScript programs using [`typescript-go`](https://github.com/microsoft/typescript-go) and executes type-aware rules, returning structured diagnostics to Oxlint.

## Installation

Type-aware linting requires an additional dependency:

::: code-group

```sh [npm]
npm add -D oxlint-tsgolint@latest
```

```sh [pnpm]
pnpm add -D oxlint-tsgolint@latest
```

```sh [yarn]
yarn add -D oxlint-tsgolint@latest
```

```sh [bun]
bun add -D oxlint-tsgolint@latest
```

:::

## Running type-aware linting

You can enable type-aware linting in either place:

- CLI flag: `--type-aware`
- Root config: `options.typeAware: true`

CLI:

```bash
oxlint --type-aware
```

Root config:

::: code-group

```json [.oxlintrc.json]
{
  "options": {
    "typeAware": true
  }
}
```

```ts [oxlint.config.ts]
import { defineConfig } from "oxlint";

export default defineConfig({
  options: {
    typeAware: true,
  },
});
```

:::

When enabled, Oxlint runs standard rules and type-aware rules in the `typescript/*` namespace.

`--type-aware` takes precedence over config files. For example, `oxlint --type-aware -c .oxlintrc.json` enables type-aware linting even if that config sets `options.typeAware` to `false`.

`options.typeAware` and `options.typeCheck` are only supported in the root config file. Nested configs should not set these fields.

In editor and LSP-based integrations like VS Code, type-aware linting can be enabled by setting the `typeAware` option to `true`, see the [Editors](./editors) page for more information.

### Monorepos and build outputs

Type-aware linting requires resolved type information.

In monorepos:

- Build dependent packages so `.d.ts` files are available
- Ensure dependencies are installed before running

```bash
pnpm install
pnpm -r build
oxlint --type-aware
```

### Type checking diagnostics

Enable type checking to report TypeScript errors alongside lint results:

```bash
oxlint --type-aware --type-check
```

Or enable it in the root config:

::: code-group

```json [.oxlintrc.json]
{
  "options": {
    "typeAware": true,
    "typeCheck": true
  }
}
```

```ts [oxlint.config.ts]
import { defineConfig } from "oxlint";

export default defineConfig({
  options: {
    typeAware: true,
    typeCheck: true,
  },
});
```

:::

`--type-check` takes precedence over config files. For example, `oxlint --type-check -c .oxlintrc.json` enables type checking even if that config sets `options.typeCheck` to `false`.

This mode can replace a separate `tsc --noEmit` step in CI:

```bash
# before
tsc --noEmit
oxlint

# after
oxlint --type-aware --type-check
```

## Configuring type-aware rules

Type-aware rules are configured like other Oxlint rules.

::: code-group

```json [.oxlintrc.json]
{
  "plugins": ["typescript"],
  "rules": {
    "typescript/no-floating-promises": "error",
    "typescript/no-unsafe-assignment": "warn"
  }
}
```

```ts [oxlint.config.ts]
import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["typescript"],
  rules: {
    "typescript/no-floating-promises": "error",
    "typescript/no-unsafe-assignment": "warn",
  },
});
```

:::

Rules support the same options as their `typescript-eslint` equivalents.

::: code-group

```json [.oxlintrc.json]
{
  "plugins": ["typescript"],
  "rules": {
    "typescript/no-floating-promises": ["error", { "ignoreVoid": true }]
  }
}
```

```ts [oxlint.config.ts]
import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["typescript"],
  rules: {
    "typescript/no-floating-promises": ["error", { ignoreVoid: true }],
  },
});
```

:::

## Disable comments

Type-aware rules support inline disable comments:

```ts
// oxlint-disable-next-line typescript/no-floating-promises
doSomethingAsync();
```

Report unused disable comments with:

```bash
oxlint --type-aware --report-unused-disable-directives
```

## TypeScript compatibility

Type-aware linting is powered by `typescript-go`.

- TypeScript **7.0+** is required
- Some legacy `tsconfig` options are not supported (like `baseUrl` in `tsconfig.json`)
- If you're using config options/features that were deprecated in TypeScript 6.0 or removed in TypeScript 7.0, you'll need to migrate your codebase first
- Invalid options are reported when `--type-check` is enabled

See the [TypeScript migration guide](https://github.com/microsoft/TypeScript/issues/62508#issuecomment-3348649259) for more details, and consider using [ts5to6](https://github.com/andrewbranch/ts5to6) to upgrade your tsconfig file.

## Stability notes

Type-aware linting:

- Rule coverage is incomplete (but very close)
- Very large codebases may encounter high memory usage
- Performance continues to improve

## Troubleshooting

### Performance and debugging

If type-aware linting is slow or uses excessive memory:

1. Update both tools:

- `oxlint`
- `oxlint-tsgolint`

2. Enable debug logging:

```bash
OXC_LOG=debug oxlint --type-aware
```

Example output (showing key timing milestones):

```
2026/01/01 12:00:00.000000 Starting tsgolint
2026/01/01 12:00:00.001000 Starting to assign files to programs. Total files: 259
2026/01/01 12:00:01.000000 Done assigning files to programs. Total programs: 8. Unmatched files: 75
2026/01/01 12:00:01.001000 Starting linter with 12 workers
2026/01/01 12:00:01.001000 Workload distribution: 8 programs
2026/01/01 12:00:01.002000 [1/8] Running linter on program: /path/to/project/jsconfig.json
...
2026/01/01 12:00:01.100000 [4/8] Running linter on program: /path/to/project/tsconfig.json
2026/01/01 12:00:02.500000 Program created with 26140 source files
2026/01/01 12:00:14.000000 /path/to/project/oxlint-plugin.mts
...
2026/01/01 12:00:14.100000 [5/8] Running linter on program: /path/to/project/apps/tsconfig.json
...
2026/01/01 12:00:15.000000 Linting Complete
Finished in 16.4s on 259 files with 161 rules using 12 threads.
```

**How to interpret the log:**

- **File assignment phase** (`Starting to assign files...` → `Done assigning files...`): Maps source files to their tsconfig projects. This phase should be fast. If slow, please file an issue.
- **Program linting** (`[N/M] Running linter on program...`): Each TypeScript project is linted separately. Programs that take significantly longer may indicate expensive type resolution or an overly large project.
  - Look for programs with an unusually high number of source files (e.g., `Program created with 26140 source files`). This may indicate misconfigured tsconfig `includes`/`excludes` pulling in unnecessary files like `node_modules`.
  - Each file path logged indicates when that file is being linted. Large time gaps between files may indicate expensive type resolution for certain files.

### Common performance issues

#### Root tsconfig includes too many files

A root `tsconfig.json` with overly broad `include` patterns can inadvertently include all files in the repository, causing significant slowdowns:

```json [tsconfig.json]
{
  "include": ["**/*"] // ❌ Catches everything
}
```

This configuration pulls in build outputs and other files that shouldn't be type-checked.

**Fix:** Explicitly scope the `include` patterns and add appropriate `exclude` entries:

```json [tsconfig.json]
{
  "include": ["src/**/*"], // ✅ Only source files
  "exclude": ["dist", "build", "coverage"] // node_modules are excluded by default
}
```

For monorepos, ensure the root `tsconfig.json` does not include source files directly:

```json [tsconfig.json]
{
  "files": []
}
```

**Diagnosing the issue:** Enable debug logging and look for programs with an unusually high number of source files:

```
2026/01/01 12:00:02.500000 Program created with 26140 source files
```

If you see thousands of files in a single program, check that tsconfig's `include`/`exclude` settings.

## Next steps

- Check [implemented rules](https://github.com/oxc-project/tsgolint/tree/main?tab=readme-ov-file#implemented-rules)
- Report issues to [https://github.com/oxc-project/tsgolint](https://github.com/oxc-project/tsgolint)
