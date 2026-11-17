---
title: Faster type-aware linting with tsrs
outline: deep
authors:
  - cameron
---

<AppBlogPostHeader />

We’re adding `tsrs` as an alternative to `tsgolint` for type-aware linting in Oxlint. It’s the Rust port of TypeScript [announced by Cloudflare and VoidZero in October](https://blog.cloudflare.com/typescript-rust-port/). Teams at Cloudflare, Owner.com and OpenAI are already using it for type-aware linting.

Our goal is to make Oxlint the best possible linter for developers and agents. Resolving types accounts for much of the cost of type-aware linting. `tsrs` makes that work faster and more memory-efficient, shortening feedback loops in editors, CI, and agent workflows.

The new backend comes with the `tsrs` npm package and works through Oxlint’s existing CLI and configuration. It can be used as a drop-in replacement for a project that already uses Oxlint’s type-aware linting.

<AgentPrompt title="Try tsrs in your codebase" prompt="Evaluate Oxlint’s tsrs backend for this project: https://oxc.rs/blog/2026-11-17-faster-type-aware-linting-with-tsrs. Use the project’s package manager and keep its lint rules intact. Record current diagnostics, elapsed time, and peak memory, then set up tsrs and repeat the checks. Investigate changed results, run project validation, and report whether the switch helped.">

Have your coding agent set up tsrs and measure the difference in your project.

</AgentPrompt>

## Performance



## Compatibility

tsrs implements all 61 rules present in tsgolint v7.0.2007. The goal is to preserve the same configuration options, diagnostics, fixes, and suggestions, so existing projects can switch with minimal effort.

## Try it

If you are using Vite+:

```sh
$ vp upgrade # since v1.7.0
$ vp check # or vp lint
```

If you are using Oxlint directly, upgrade to the latest versions of Oxlint and `tsrs`. Once installed, Oxlint will automatically use `tsrs` for type-aware linting and typechecking.

```sh
$ pnpm i -D oxlint tsrs
$ pnpx oxlint --type-aware
```

You can also request typechecking diagnostics alongside lint results:

```sh
$ pnpx oxlint --type-aware --type-check
```

If type-aware linting is already enabled through `options.typeAware`, you can continue using your usual lint command.

## Feedback

Try `tsrs` type-aware linting as a drop-in replacement for tsgolint on a project, and let us know how it compares. Please [report any differences](https://github.com/oxc-project/tsrs/issues) in output, fixes, runtime, or memory to help us work to a more stable release. [Join the Oxc Discord](https://discord.gg/9uXCAwqQZW) to stay up to date on the latest changes.

## What’s next?

Bringing `tsrs` to Oxlint is another step toward a faster, more integrated JavaScript and TypeScript toolchain. With both tools written in Rust, we have more room to explore deeper integration, reduce duplicated work, and improve performance and memory use across linting and typechecking.

We have tried tsrs and tsrs lint on a large variety of projects and will continue to improve compatibility and stability. We’ll keep following upstream TypeScript and `tsgolint`, closing gaps, and looking for further optimizations. For developers and agents alike, the goal is the same: make thorough checks fast enough to run after every change.

## Acknowledgements

Thank you to [Max Schwenk](https://building.owner.com/tsrs) for creating tsrs, the TypeScript team for their continued support and collaboration, and all of our contributors.
