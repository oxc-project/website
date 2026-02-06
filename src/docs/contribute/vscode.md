---
title: VS Code Extension
outline: deep
---

# VS Code Extension

::: tip
This page is for contributing to the Oxc VS Code extension.
To download the extension, see the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode) or the [Open VSX Registry](https://open-vsx.org/extension/oxc/oxc-vscode).
:::

## Development

Clone the [oxc-vscode](https://github.com/oxc-project/oxc-vscode) repository and run `pnpm install`.

## Building and running the extension locally

There are two options for running and testing your changes to the Oxc VS Code extension.

**Via command line:**

- Run `pnpm build` to compile the VS Code extension and build the release version of the language server.
- Run `pnpm install-extension` to install it into VS Code.
- Press `Ctrl` + `Shift` + `P` and search for "Developer: Reload Window".
- You are now able to manually test your changes inside VS Code.

**Via VS Code itself:**

- Open the `oxc-vscode` repository in VS Code.
- Go to the "Run and Debug" tab in the left sidebar of your editor.
- Select the `Launch VS Code Extension` configuration.
- Click the green play button at the top.
- This will build the VS Code extension and launch a new VS Code window with the newly built VS Code extension installed.

### Testing unreleased versions of `oxlint`/`oxfmt`

Build the project in the [oxc project](https://github.com/oxc-project/oxc) with:

```bash
cd apps/oxlint && pnpm build-test
cd ../oxfmt && pnpm build-test
```

Then configure the VS Code extension to use the local build via the extension settings in `settings.json`:

```json
{
  "oxc.path.oxlint": "/path/to/oxc/apps/oxlint/dist/cli.js",
  "oxc.path.oxfmt": "/path/to/oxc/apps/oxfmt/dist/cli.js"
}
```

### Use the output channel

To see what the extension and language server are doing, use the `Oxc` output channel in VS Code.
To get more information, enable the following extension setting in `settings.json`:

```json
{
  "oxc.trace.server": "verbose"
}
```

In the language server integration for `oxlint`/`oxfmt` (for example, the `oxc_language_server` crate), you can use the `info!` or `error!` macros to send messages to the `Oxc` output channel in VS Code.

### Writing a test

Depending on your changes, you should create a test.
Write tests in the VS Code extension only when they are specific to VS Code.
Tests for LSP communication with the tools should be added in `oxlint/oxfmt` or in the Rust crate `oxc_language_server`.

Example:

- VS Code: status bar changes
- oxlint: returned diagnostics / code actions
- oxc_language_server: workspace problems
