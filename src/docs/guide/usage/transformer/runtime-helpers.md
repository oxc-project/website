# Runtime Helpers

The transformer may inject import statements from `@oxc-project/runtime`, a package containing Oxc's runtime helpers. There are two ways to handle this.

## Bundling the Helpers

If you are using a bundler, the runtime helpers will be resolved and bundled into your output. This is the only option for non-Node apps. For Node apps and libraries, this is also suitable when you don't want to manage the runtime version yourself.

No additional setup is required — your bundler will handle the imports automatically.

## Externalizing the Helpers

Alternatively, you can add `@oxc-project/runtime` to your dependencies and externalize the imports. You need to select the runtime version that matches your `oxc-transform` version (see [version compatibility](#version-compatibility) below).

The benefit of this approach is deduplication: when a user depends on multiple libraries that were transformed with Oxc, the runtime helpers are shared rather than duplicated in each bundle.

::: code-group

```sh [npm]
npm add @oxc-project/runtime
```

```sh [pnpm]
pnpm add @oxc-project/runtime
```

```sh [yarn]
yarn add @oxc-project/runtime
```

```sh [bun]
bun add @oxc-project/runtime
```

:::

## Version Compatibility

| `oxc-transform` | `@oxc-project/runtime` |
| --------------- | ---------------------- |
| 0.115.0         | 0.115.0                |
