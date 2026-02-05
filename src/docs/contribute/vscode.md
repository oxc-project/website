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

### Building Debug Version of Server

Running `pnpm build` will build the release version of the server, This can take some time.
If you want faster feedback use the follow flow:

```bash
pnpm compile # transform TS Code
pnpm server:build:debug # build the debug version of the language server
pnpm package # package it as VSCode Extension
pnpm install-extension
```

Make sure to tell the VSCode Extension to use the debug build with the env variable:
`SERVER_PATH_DEV="/workspace/oxc-vscode/target/debug/oxc_language_server"`.

Or use the Extension Settings with `settings.json`:

```json
{
  "oxc.path.server": "./target/debug/oxc_language_server"
}
```

For Windows, the `oxc_language_server` will be provided with a `exe` extension.

### Use the Output Channel

To understand what the Extension and the Language Server is doing, you can use the `Oxc` Output Channel inside VSCode.
The get more information use the Extension Setting inside `settings.json`:

```json
{
  "oxc.trace.server": "verbose"
}
```

On `oxc_language_server` you can use the `info!` or `error!` macro to send messages to the output channel.

### Writing a Test

Depending on the changes, you should create a Test for it.
Tests on the `oxc_language_server` will make sure the (Server)Linter works as expected.
Write Tests in `vscode` when you want to test changing behavior.
Example: expecting a lint fix to be applied, when executing a command or code action.
