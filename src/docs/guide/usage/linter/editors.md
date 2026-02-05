---
title: Setup editors
description: Configure Oxlint in VS Code, Zed, JetBrains, and other editors.
outline: 2
---

# Setup editors

Editor extensions use `oxlint --lsp` from your project, so `oxlint` must be installed locally.

See [Quickstart](./quickstart) to install Oxlint.

## Supported editors

- [VS Code](#vs-code) (and Cursor, etc.)
- [Zed](#zed)
- [JetBrains](#jetbrains)
- [coc.nvim](#coc-nvim)
- [Other editors](#other-editors)

## VS Code

### Install

Download the official Oxc VS Code extension from:

- [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode)
- [Open VSX Registry](https://open-vsx.org/extension/oxc/oxc-vscode)

**The extension is compatible with other VS Code-based editors**, including Cursor.

### Team setup

1. Recommend the extension for contributors:

`.vscode/extensions.json`:

```json [.vscode/extensions.json]
{
  "recommendations": ["oxc.oxc-vscode"]
}
```

2. Enable fix-on-save in `.vscode/settings.json`:

```json [.vscode/settings.json]
{
  "editor.codeActionsOnSave": {
    "source.fixAll.oxc": "always"
  }
}
```

3. Enable type-aware linting in `.vscode/settings.json`:

```json [.vscode/settings.json]
{
  "oxc.typeAware": true
}
```

You also need to ensure `oxlint-tsgolint` is installed in your project. See [the type-aware linting docs](/docs/guide/usage/linter/type-aware) for more details.

### Reference

- [oxc-project/oxc-vscode](https://github.com/oxc-project/oxc-vscode)

## Zed

### Install

- [Oxc Zed Extension](https://zed.dev/extensions/oxc)

### Reference

- [oxc-project/oxc-zed](https://github.com/oxc-project/oxc-zed)

## JetBrains

IntelliJ IDEA and WebStorm.

### Install

- [Oxc in JetBrains Marketplace](https://plugins.jetbrains.com/plugin/27061-oxc)

### Reference

- [oxc-project/oxc-intellij-plugin](https://github.com/oxc-project/oxc-intellij-plugin)

## coc.nvim

### Install

```vim
:CocInstall coc-oxc
```

### Reference

- [oxc-project/coc-oxc](https://github.com/oxc-project/coc-oxc)

## Other editors

For editors with LSP support (Neovim, Emacs, Helix, Sublime), configure:

```bash
oxlint --lsp
```

## Reference

- [oxc_language_server](https://github.com/oxc-project/oxc/tree/main/crates/oxc_language_server)
