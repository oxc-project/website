---
title: "Coding agents | Oxlint and Oxfmt"
description: Run Oxlint and Oxfmt automatically after coding agents edit files.
---

# Coding agents

Coding agent hooks can automatically lint and format files after an agent edits them. This keeps generated changes aligned with your project's Oxlint and Oxfmt configuration and gives the agent immediate feedback about problems it could not fix.

## Prerequisites

Install [Oxlint](./linter/quickstart) and [Oxfmt](./formatter/quickstart) as development dependencies in your project.

The hooks use [`jq`](https://jqlang.org/download/) to read edited paths from the coding agent's hook input. Make sure `jq` is available on your `PATH`.

The examples use `npx` to run locally installed packages. You can replace it with the equivalent command for your package manager, such as `pnpm exec`, `yarn exec`, or `bunx`.

## Claude Code

[Claude Code hooks](https://code.claude.com/docs/en/hooks-guide) can run commands after Claude uses a file-editing tool. The following project-level hook applies safe Oxlint fixes, formats the edited file with Oxfmt, and sends any remaining diagnostics back to Claude.

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

## Codex

[Codex hooks](https://learn.chatgpt.com/docs/hooks) can run commands after Codex edits files with `apply_patch`. Unlike Claude Code, Codex provides the entire patch in `tool_input.command`, and one patch may edit multiple files. The hook extracts all added, updated, and moved paths before running Oxlint and Oxfmt.

### Create the hook

Create `.codex/hooks/oxc.sh`:

```bash [.codex/hooks/oxc.sh]
#!/usr/bin/env bash

input=$(cat)
patch=$(jq -r '.tool_input.command // empty' <<<"$input")
repo_root=$(git rev-parse --show-toplevel) || exit 1
files=()

while IFS= read -r file_path; do
  if [[ "$file_path" != /* ]]; then
    file_path="$repo_root/$file_path"
  fi

  if [[ -f "$file_path" ]]; then
    files+=("$file_path")
  fi
done < <(
  sed -n \
    -e 's/^\*\*\* Add File: //p' \
    -e 's/^\*\*\* Update File: //p' \
    -e 's/^\*\*\* Move to: //p' \
    <<<"$patch"
)

if ((${#files[@]} == 0)); then
  exit 0
fi

cd "$repo_root" || exit 1

oxlint_output=$(npx oxlint --fix --deny-warnings --format=agent --no-error-on-unmatched-pattern "${files[@]}" 2>&1)
oxlint_status=$?

oxfmt_output=$(npx oxfmt --write --no-error-on-unmatched-pattern "${files[@]}" 2>&1)
oxfmt_status=$?

if ((oxlint_status != 0 || oxfmt_status != 0)); then
  printf 'Oxlint:\n%s\nOxfmt:\n%s\n' "$oxlint_output" "$oxfmt_output" >&2
  exit 2
fi
```

Make the hook executable:

```sh
chmod +x .codex/hooks/oxc.sh
```

Deleted files are skipped because neither tool needs to process them. `--no-error-on-unmatched-pattern` lets Oxlint and Oxfmt silently skip edited files they do not support.

### Register the hook

Add the hook to `.codex/hooks.json`:

```json [.codex/hooks.json]
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "\"$(git rev-parse --show-toplevel)/.codex/hooks/oxc.sh\"",
            "statusMessage": "Running Oxlint and Oxfmt"
          }
        ]
      }
    ]
  }
}
```

The `Edit|Write` matcher selects Codex's `apply_patch` tool. `.codex/hooks.json` can be committed to share the hook with everyone working on the project.

### Trust and verify the hook

Project hooks only load in trusted repositories. Run `/hooks` in Codex to review and trust the hook, then ask Codex to edit a JavaScript or TypeScript file. The edited files should be fixed and formatted automatically, and Codex should receive any diagnostics that remain.
