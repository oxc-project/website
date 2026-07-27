---
title: "Coding agents | Oxlint and Oxfmt"
description: Run Oxlint and Oxfmt automatically after coding agents edit files.
---

# Coding agents

Coding agent hooks can automatically lint and format files after an agent edits them. This keeps generated changes aligned with your project's Oxlint and Oxfmt configuration and gives the agent immediate feedback about problems it could not fix.

## Claude Code

[Claude Code hooks](https://code.claude.com/docs/en/hooks-guide) can run commands after Claude uses a file-editing tool. The following project-level hook applies safe Oxlint fixes, formats the edited file with Oxfmt, and sends any remaining diagnostics back to Claude.

### Prerequisites

Install [Oxlint](./linter/quickstart) and [Oxfmt](./formatter/quickstart) as development dependencies in your project.

The hook uses [`jq`](https://jqlang.org/download/) to read the file path from Claude Code's hook input. Make sure `jq` is available on your `PATH`.

### Create the hook

Create `.claude/hooks/oxc.sh`:

```bash [.claude/hooks/oxc.sh]
#!/usr/bin/env bash

input=$(cat)
file_path=$(jq -r '.tool_input.file_path // empty' <<<"$input")

if [[ -z "$file_path" || ! -f "$file_path" ]]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR" || exit 1

oxlint_output=$(npx oxlint --fix --deny-warnings --format=agent --no-error-on-unmatched-pattern "$file_path" 2>&1)
oxlint_status=$?

oxfmt_output=$(npx oxfmt --write --no-error-on-unmatched-pattern "$file_path" 2>&1)
oxfmt_status=$?

if ((oxlint_status != 0 || oxfmt_status != 0)); then
  printf 'Oxlint:\n%s\nOxfmt:\n%s\n' "$oxlint_output" "$oxfmt_output" >&2
  exit 2
fi
```

Make the hook executable:

```sh
chmod +x .claude/hooks/oxc.sh
```

The hook uses:

- `oxlint --fix` to apply safe fixes.
- `oxlint --format=agent` to produce concise diagnostics for coding agents.
- `--deny-warnings` and exit code `2` to send remaining diagnostics back to Claude.
- `--no-error-on-unmatched-pattern` so each tool silently skips unsupported files.

If you use a package manager without `npx`, replace it with the equivalent command, such as `pnpm exec`, `yarn exec`, or `bunx`.

### Register the hook

Add the hook to `.claude/settings.json`:

```json [.claude/settings.json]
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "\"${CLAUDE_PROJECT_DIR}/.claude/hooks/oxc.sh\""
          }
        ]
      }
    ]
  }
}
```

`.claude/settings.json` can be committed to share the hook with everyone working on the project. If the file already contains hooks, add `PostToolUse` alongside the existing event keys instead of replacing the entire `hooks` object.

The `PostToolUse` hook runs after Claude successfully edits or writes a file. It does not run after file changes made through other tools or outside Claude Code.

### Verify the hook

Run `/hooks` in Claude Code and select `PostToolUse` to confirm the hook is registered. Then ask Claude to edit a JavaScript or TypeScript file. The edited file should be fixed and formatted automatically, and Claude should receive any diagnostics that remain.

See the [Claude Code hooks reference](https://code.claude.com/docs/en/hooks) for configuration, input, output, and troubleshooting details.
