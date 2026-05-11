---
title: Projects using Oxc
outline: deep
---

# Projects Using Oxc

## Oxlint / Oxfmt / Both

- [Microsoft VS Code](https://github.com/microsoft/vscode) (Oxlint) - Microsoft's VS Code editor
- [Google Neuroglancer](https://github.com/google/neuroglancer) (Oxlint) - WebGL volumetric data visualization tool
- [Shopify](https://www.shopify.com/news/performance%F0%9F%91%86-complexity%F0%9F%91%87-killer-updates-from-shopify-engineering) (Oxlint) - Reduced hour of workload to seconds
- [Cloudflare Agents](https://github.com/cloudflare/agents) (Both) - Cloudflare Agents SDK
- [BBC Simorgh](https://github.com/bbc/simorgh) (Oxlint) - BBC online rendering platform
- [Turborepo](https://github.com/vercel/turborepo) (Both) - High-performance build system for JavaScript and TypeScript codebases
- [Sentry JavaScript](https://github.com/getsentry/sentry-javascript) (Oxfmt) - Official Sentry SDKs for JavaScript
- [Vue.js](https://github.com/vuejs/core) (Oxfmt) - The progressive JavaScript framework
- [Hugging Face JS](https://github.com/huggingface/huggingface.js) (Oxfmt) - Hugging Face JS libraries
- [Bun](https://github.com/oven-sh/bun) (Oxlint) - JavaScript runtime and toolkit
- [Mastodon](https://github.com/mastodon/mastodon) (Oxfmt) - Decentralized social networking server
- [Preact](https://github.com/preactjs/preact) (Oxlint) - Fast 3kB React alternative with the same modern API
- [PostHog](https://github.com/PostHog/posthog) (Oxlint) - Open-source product analytics platform
- [Lichess](https://github.com/lichess-org/lila) (Oxfmt) - Lichess chess server/frontend
- [Rolldown](https://github.com/rolldown/rolldown) (Both) - Rust bundler in the VoidZero/Vite ecosystem
- [Renovate](https://github.com/renovatebot/renovate) (Oxlint) - Dependency update automation bot
- [Vue Pinia](https://github.com/vuejs/pinia) (Oxfmt) - Vue's official state management library
- [AFFiNE](https://github.com/toeverything/affine) (Oxlint) - Next-gen knowledge base
- [FormatJS](https://github.com/formatjs/formatjs) (Both) - JavaScript internationalization libraries
- [napi-rs](https://github.com/napi-rs/napi-rs) (Oxlint) - A framework for building compiled Node.js add-ons in Rust via Node-API
- [ComfyUI Frontend](https://github.com/Comfy-Org/ComfyUI_frontend) (Oxfmt) - Frontend for ComfyUI
- [Actual](https://github.com/actualbudget/actual) (Both) - Open-source budgeting app
- [Hey API](https://heyapi.dev/) (Oxlint) - OpenAPI to TypeScript codegen ecosystem
- [nuxt-auth](https://github.com/sidebase/nuxt-auth) (Oxlint) - Authentication built for Nuxt 3
- [OpenClaw](https://github.com/openclaw/openclaw) (Both) - Open source personal AI assistant
- [npmx.dev](https://github.com/npmx-dev/npmx.dev) (Oxfmt) - npm package explorer

## Resolver

- [swc-node](https://github.com/swc-project/swc-node) - Faster ts-node without typecheck
- [Biome](https://biomejs.dev) - for loading configuration
- [turborepo](https://github.com/vercel/turborepo/pull/9134) - for `turbo-trace`
- [dts-resolver](https://npmx.dev/package/dts-resolver) - Resolves TypeScript declaration files for dependencies
- [codemod](https://github.com/codemod/codemod) - For module resolution in jssg codemods

## Parser

- [todoctor](https://github.com/azat-io/todoctor) - CLI tool to track and visualize TODO comments in Git repositories and make report
- [nuxt](https://nuxt.com) - Uses `oxc-parser` to [parse code in plugins](https://github.com/nuxt/nuxt/pull/30066)
- [Elide](https://elide.dev) - Uses `oxc` to strip TypeScript types before execution

## Transformer

- [unplugin-isolated-decl](https://npmx.dev/package/unplugin-isolated-decl) - A blazing-fast tool for generating isolated declarations
- [stc](https://github.com/long-woo/stc) - A tool for converting OpenApi/Swagger/Apifox into code

## Crates

- [Andromeda](https://github.com/tryandromeda/andromeda) - A modern, and secure JavaScript & TypeScript runtime built with The Nova Engine and oxc crates
- [Rolldown](https://rolldown.rs) - Uses all compiler components
- [sovra](https://github.com/oblador/sovra) - Test decider for large JavaScript projects
- [Tauri](https://github.com/tauri-apps/tauri/blob/8c6d1e8e6c852667bb223b5f4823948868c26d98/crates/tauri-cli/src/migrate/migrations/v1/frontend.rs) - Uses the parser for its codemod
- [tree-shaker](https://github.com/KermanX/tree-shaker) - An experimental tree shaker for JavaScript
- [Tyvm](https://github.com/zackradisic/tyvm) - An experimental bytecode interpreter for type-level TypeScript
