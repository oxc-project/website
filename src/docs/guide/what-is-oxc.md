---
title: What is Oxc?
description: The fastest toolchain for JavaScript and TypeScript.
---

# What is Oxc?

/oʊ ɛks siː/

The Oxidation Compiler is a collection of high-performance tools for JavaScript and TypeScript written in Rust.

Oxc is part of [VoidZero](https://voidzero.dev)'s vision for a unified, high-performance toolchain for JavaScript. It powers [Rolldown](https://rolldown.rs) ([Vite](https://vitejs.dev)'s future bundler) and enables the next generation of ultra-fast development tools that work seamlessly together.

<sub>\* Oxidation is the chemical process that creates rust</sub>

## Fastest tooling across the stack

Oxc focuses on performance across the whole toolchain. This includes parsing, module resolution, linting, formatting, transforms, and minification.

## Philosophy

Oxc is built around a few core ideas.

### Performance is a feature

Oxc treats speed as a product requirement. Faster tools improve the local feedback loop and reduce CI cost. Performance regressions are treated as bugs.

### One toolchain, shared building blocks

Oxc is a suite. Tools like the linter, formatter, parser, transformer, minifier, and resolver are built on shared components. This reduces duplicated work and makes behavior more consistent across the stack.

### Correctness with clear boundaries

Oxc aims to be correct and predictable. When behavior differs from other tools, the differences should be documented. Compatibility is a feature, not an accident.

### Practical developer experience

Oxc focuses on a workflow that works in real projects. Defaults should be sensible, configuration should be understandable, and output should be stable.

## What you get

Oxc includes end-user tools and reusable compiler building blocks:

- [Oxlint](/docs/guide/usage/linter) is the fastest linter for JavaScript and TypeScript. It targets compatibility with the ESLint ecosystem.
- [Oxfmt](/docs/guide/usage/formatter) is the fastest formatter. It targets Prettier-compatible formatting.
- [Parser](/docs/guide/usage/parser) is the fastest JS and TS parser with an AST for tooling.
- [Transformer](/docs/guide/usage/transformer) provides fastest TS, JSX, and modern JavaScript transforms.
- [Minifier](/docs/guide/usage/minifier) is the fastest minifier for production output.
- [Resolver](/docs/guide/usage/resolver) is the fastest module resolver for JS and TS projects.

You can use each tool on its own, or use them together as one toolchain.

## Who Oxc is for

- **App and library developers** who want the fastest lint and format loop locally and in CI.
- **Toolchain and platform teams** who want a fast compiler-grade foundation at scale.
- **Tool authors** who want fast reusable crates or npm packages for JS tooling.
