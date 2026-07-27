---
title: "Coding agents | Oxlint and Oxfmt"
description: Configure coding agents to use Oxlint and Oxfmt.
---

# Coding agents

Configure coding agents to run Oxlint and Oxfmt as part of their editing workflow.

## Claude Code

[Claude Code hooks](https://code.claude.com/docs/en/hooks-guide#auto-format-code-after-edits) can run Oxlint and Oxfmt after Claude edits a file.

Install [Oxlint](./linter/quickstart), [Oxfmt](./formatter/quickstart), and [`jq`](https://jqlang.org/download/), then merge this project hook into `.claude/settings.json`:

```json [.claude/settings.json]
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "file=$(jq -r '.tool_input.file_path'); npx oxlint --fix --no-error-on-unmatched-pattern \"$file\"; npx oxfmt --no-error-on-unmatched-pattern \"$file\""
          }
        ]
      }
    ]
  }
}
```

The hook applies safe lint fixes and formats the edited file. Unsupported files are skipped. Run `/hooks` in Claude Code to confirm that the hook is registered.

## Codex

[Codex reads `AGENTS.md`](https://learn.chatgpt.com/docs/agent-configuration/agents-md) before starting work. Add these instructions to the `AGENTS.md` in your project root:

```md [AGENTS.md]
## Linting and formatting

- After making code changes, run `npx oxlint --fix`, then run `npx oxfmt`.
- Before finishing, run `npx oxlint --deny-warnings --format=agent`.
```

Codex loads project instructions when a session starts. Start a new session after adding or changing `AGENTS.md`.

These examples use `npx` to run locally installed packages. Replace it with `pnpm exec`, `yarn exec`, or `bunx` if needed.
