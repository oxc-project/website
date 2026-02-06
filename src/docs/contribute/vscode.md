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

There are two options for running and testing your changes to the oxc VS Code extension.

**Via command line:**

- Run `pnpm build` to compile the vscode extension and build the release version of the language server.
- Run `pnpm install-extension` to install it on your VS Code Editor.
- Hit `CTRL` + `SHIFT` + `P` and search for "Developer: Reload Window".
- You are now able to manually test your changes inside VS Code.

**Via VS Code itself:**

- Open the `oxc-vscode` repository in VS Code.
- Go to the "Run and Debug" tab in the left sidebar of your editor.
- Select the `Launch VS Code Extension` configuration.
- Hit the green play button at the top.
- This will build the VS Code extension and launch a new VS Code window with the newly-built VS Code extension installed.

### Testing unreleased Version of `oxlint`/`oxfmt`

You need to build the project inside [oxc project](https://github.com/oxc-project/oxc) with:

```bash
cd apps/oxlint && pnpm build-test
```

and tell the VSCode Extension to use the debug build with the Extension Settings in `settings.json`:

```json
{
  "oxc.path.oxlint": "/path/to/oxc/apps/oxlint/dist/cli.js",
  "oxc.path.oxfmt": "/path/to/oxc/apps/oxfmt/dist/cli.js"
}
```

### Use the Output Channel

To understand what the Extension and the Language Server is doing, you can use the `Oxc` Output Channel inside VSCode.
The get more information use the Extension Setting inside `settings.json`:

```json
{
  "oxc.trace.server": "verbose"
}
```

On `oxlint` or `oxfmt` you can use the `info!` or `error!` macro to send messages to the output channel.

### Writing a Test

Depending on the changes, you should create a Test for it.
Write Tests in `vscode` only when they are related to `vscode` only.
Tests for the LSP communication with the tool should be done inside `oxlint/oxfmt` or the rust crate `oxc_language_server`.

Example:

- VS Code: Status bar changes
- oxlint: returned diagnostic / code action
- oxc_language_server: workspace problems
