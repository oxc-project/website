---
title: Oxlint Import Plugin Alpha
outline: deep
authors:
  - boshen
---

<AppBlogPostHeader />

We are excited to announce an alpha release for `oxlint --import-plugin`, a port of [`eslint-plugin-import`](https://npmx.dev/package/eslint-plugin-import).

This port aims to resolve all known issues associated with `eslint-plugin-import`:

- Performance - execution time exceeding one minute when certain rules are enabled
- Dependency size - 188 dependencies totaling 30M
- Backwards compatibility - the necessity to [support Node.js v4.0.0](https://github.com/import-js/eslint-plugin-import/pull/2447#issuecomment-1117384140)
- Dependency compatibility - the need to replace it with [`eslint-plugin-import-x`](https://npmx.dev/package/eslint-plugin-import-x)
- [Upgrading to ESLint v9](https://github.com/import-js/eslint-plugin-import/issues/2948)

## What's in the release?

This alpha release is expected to work if your project is in ESM (ECMAScript Modules).

If path aliases (e.g. `@/foo`) are required through [tsconfig.compilerOptions.paths](https://www.typescriptlang.org/tsconfig/#paths),
the `--tsconfig` option can be used:

```
npx oxlint@latest --tsconfig ./tsconfig.json --import-plugin
```

The rules that are enabled by default via `npx oxlint@latest --import-plugin` are:

- [default](https://github.com/import-js/eslint-plugin-import/blob/v2.29.1/docs/rules/default.md)
- [named](https://github.com/import-js/eslint-plugin-import/blob/v2.29.1/docs/rules/named.md)
- [namespace](https://github.com/import-js/eslint-plugin-import/blob/v2.29.1/docs/rules/namespace.md)

Rules that can be enabled selectively via `npx oxlint@latest --import-plugin -D rule-name` are:

- [no-named-as-default](https://github.com/import-js/eslint-plugin-import/blob/v2.29.1/docs/rules/no-named-as-default.md)
- [no-named-as-default-member](https://github.com/import-js/eslint-plugin-import/blob/v2.29.1/docs/rules/no-named-as-default-member.md)
- [no-self-import](https://github.com/import-js/eslint-plugin-import/blob/v2.29.1/docs/rules/no-self-import.md)
- [no-duplicates](https://github.com/import-js/eslint-plugin-import/blob/v2.29.1/docs/rules/no-duplicates.md)
- [no-amd](https://github.com/import-js/eslint-plugin-import/blob/v2.29.1/docs/rules/no-amd.md)
- [no-default-export](https://github.com/import-js/eslint-plugin-import/blob/v2.29.1/docs/rules/no-default-export.md)
- [no-cycle](https://github.com/import-js/eslint-plugin-import/blob/v2.29.1/docs/rules/no-cycle.md)

There are also improvements to these rules; for example, the diagnostics for the `no-cycle` rule have been improved:

```
 ⚠ eslint-plugin-import(no-cycle): Dependency cycle detected
   ╭─[apps/web/playwright/lib/fixtures.ts:13:42]
12 │ import { createPaymentsFixture } from "../fixtures/payments";
13 │ import { createBookingPageFixture } from "../fixtures/regularBookings";
   ·                                          ─────────────────────────────
14 │ import { createRoutingFormsFixture } from "../fixtures/routingForms";
   ╰────
 help: These paths form a cycle:
       -> ../fixtures/regularBookings - apps/web/playwright/fixtures/regularBookings.ts
       -> ./users - apps/web/playwright/fixtures/users.ts
       -> ../lib/testUtils - apps/web/playwright/lib/testUtils.ts
       -> ./fixtures - apps/web/playwright/lib/fixtures.ts
```

This isn't a long list of features,
but due to the complexity of the current state of the ecosystem,
it requires a lot of effort to implement these rules and ensure they work correctly.

Over the past six months, we have worked in our spare time and successfully completed all the prerequisites for the `--import-plugin` to work:

- a [resolver](https://github.com/oxc-project/oxc-resolver) for module resolution
- a small ["runtime"](https://github.com/oxc-project/oxc/blob/main/crates/oxc_linter/src/service.rs) to maximize processing dependent files in parallel
- a [`ModuleRecord`](https://github.com/oxc-project/oxc/blob/main/crates/oxc_syntax/src/module_record.rs) data structure for storing import / export information, and its respective [builder](https://github.com/oxc-project/oxc/blob/main/crates/oxc_semantic/src/module_record/builder.rs)

## How can I help?

If you are a project maintainer (a.k.a. configuration engineer) and lack the time or energy to keep ESLint and all its plugins updated,
you may follow [@brooooooklyn](https://github.com/brooooooklyn)'s lead and [replace ESLint with oxlint in all his projects](https://github.com/napi-rs/napi-rs/pull/2032).

If you are an open-source enthusiast and are willing to help out, come talk to us on [discord](https://discord.gg/9uXCAwqQZW), check out the [linter product plan and progress issue](https://github.com/oxc-project/oxc/issues/481), or help by [proposing new rules](https://github.com/oxc-project/oxc/issues/3161) that were deferred.

If you are an engineering manager, or are willing to migrate your project to oxlint (with 330 rules and growing) to keep your infrastructure costs down,
you may consider [sponsoring](https://github.com/sponsors/Boshen) so we can prioritize your project.

Please remember `oxlint` is currently community driven, I believe that with enough resources, we can make `--import-plugin` generally available in the next few months.

---

To start using `oxlint`, follow the [installation guide](/docs/guide/usage/linter) or learn more about the [oxc project](/docs/guide/introduction.html).
