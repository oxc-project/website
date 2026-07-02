---
title: "Output formats | Oxlint"
description: Output linting results in various formats for CI or human consumption
---

# Output formats

Oxlint supports multiple output formats for emitting lint results. These can be used to integrate with various CI systems or other tools.

You can specify the desired format using the `--format` (or `-f`) option when running Oxlint from the CLI.

## Available formats

### `--format=default`

This is the default output format if none is specified.

```
  x eslint(no-debugger): `debugger` statement is not allowed
    ╭─[test.js:5:1]
  4 │
  5 │ debugger;
    · ─────────
  6 │
    ╰────
  help: Remove the debugger statement

Found 0 warnings and 1 error.
Finished in 6ms on 1 file with 2 rules using 1 threads.
```

### `--format=agent`

Outputs a brief format intended for consumption by AI agents and similar tooling.

```
test.js:5:1: error eslint(no-debugger): `debugger` statement is not allowed help: Remove the debugger statement
test.js:1:10: warning eslint(no-unused-vars): Function 'foo' is declared but never used. help: Consider removing this declaration.
test.js:1:17: warning eslint(no-unused-vars): Parameter 'b' is declared but never used. Unused parameters should start with a '_'. help: Consider removing this parameter.
```

### `--format=checkstyle`

Outputs Checkstyle XML format, which can be ingested by some CI tools.

```xml
<?xml version="1.0" encoding="utf-8"?>
<checkstyle version="4.3">
  <file name="test.js">
    <error line="5" column="1" severity="error" message="`debugger` statement is not allowed" source="eslint(no-debugger)" />
  </file>
</checkstyle>
```

### `--format=github`

This format is intended for use with GitHub Actions and GitHub's [annotations feature](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands#setting-an-error-message).

```
::error file=test.js,line=5,endLine=5,col=1,endColumn=10,title=eslint(no-debugger)::`debugger` statement is not allowed
```

It will be enabled by default when Oxlint detects that it is running in a GitHub Actions environment, you can override this behavior by providing a different `--format` option in your CI config.

### `--format=gitlab`

This format is intended for use with GitLab CI and [GitLab's Code Quality feature](https://docs.gitlab.com/ci/testing/code_quality/#code-quality-report-format).

```json
[
  {
    "description": "`debugger` statement is not allowed",
    "check_name": "eslint(no-debugger)",
    "fingerprint": "9333a3278325994",
    "severity": "critical",
    "location": {
      "path": "test.js",
      "lines": {
        "begin": 5,
        "end": 5
      }
    }
  }
]
```

### `--format=json`

A general JSON output format, can also be used with `--rules` to get a list of all Oxlint rules in JSON format.

```json
{
  "diagnostics": [
    {
      "message": "`debugger` statement is not allowed",
      "code": "eslint(no-debugger)",
      "severity": "error",
      "causes": [],
      "url": "https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-debugger.html",
      "help": "Remove the debugger statement",
      "filename": "test.js",
      "labels": [
        {
          "span": {
            "offset": 38,
            "length": 9,
            "line": 5,
            "column": 1
          }
        }
      ],
      "related": []
    }
  ],
  "number_of_files": 1,
  "number_of_rules": 2,
  "threads_count": 1,
  "start_time": 0.018611917
}
```

### `--format=junit`

Outputs JUnit XML format, useful for CI systems that support JUnit reports, such as [GitLab CI](https://docs.gitlab.com/ci/testing/unit_test_reports/#junit-xml-format-specification) or [Bitbucket Pipelines](https://support.atlassian.com/bitbucket-cloud/docs/test-reporting-in-pipelines/).

```xml
<?xml version="1.0" encoding="UTF-8"?>
<testsuites name="Oxlint" tests="1" failures="0" errors="1">
  <testsuite name="test.js" tests="1" disabled="0" errors="1" failures="0">
    <testcase name="eslint(no-debugger)">
      <error message="`debugger` statement is not allowed">line 5, column 1, `debugger` statement is not allowed</error>
    </testcase>
  </testsuite>
</testsuites>
```

### `--format=sarif`

Outputs [SARIF](https://sarifweb.azurewebsites.net/) v2.1.0 format, which is a standardized format that can be ingested by various code scanning tools, including [GitHub Code Scanning](https://docs.github.com/en/code-security/concepts/code-scanning/sarif-files), [GitLab](https://docs.gitlab.com/user/application_security/detect/sarif/), and [SonarQube](https://docs.sonarsource.com/sonarqube-server/analyzing-source-code/importing-external-issues/importing-issues-from-sarif-reports).

```json
{
  "version": "2.1.0",
  "$schema": "https://docs.oasis-open.org/sarif/sarif/v2.1.0/errata01/os/schemas/sarif-schema-2.1.0.json",
  "runs": [
    {
      "tool": {
        "driver": {
          "name": "oxlint",
          "version": "1.66.0",
          "semanticVersion": "1.66.0",
          "informationUri": "https://oxc.rs/docs/guide/usage/linter.html",
          "rules": [
            {
              "id": "eslint(no-debugger)",
              "name": "no-debugger",
              "helpUri": "https://oxc.rs/docs/guide/usage/linter/rules/eslint/no-debugger.html",
              "properties": {
                "category": "correctness",
                "plugin": "eslint",
                "fix": "fixable_suggestion"
              }
            }
          ]
        }
      },
      "artifacts": [
        {
          "location": {
            "uri": "test.js"
          }
        }
      ],
      "results": [
        {
          "ruleId": "eslint(no-debugger)",
          "ruleIndex": 0,
          "level": "error",
          "message": {
            "text": "`debugger` statement is not allowed"
          },
          "locations": [
            {
              "physicalLocation": {
                "artifactLocation": {
                  "uri": "test.js",
                  "index": 0
                },
                "region": {
                  "startLine": 5,
                  "startColumn": 1,
                  "endLine": 5,
                  "endColumn": 10
                }
              }
            }
          ]
        }
      ],
      "columnKind": "unicodeCodePoints"
    }
  ]
}
```

### `--format=stylish`

Stylish is the default output format of ESLint, and is good for compact human-readable output.

```
test.js
5:1   error `debugger` statement is not allowed  eslint(no-debugger)

✖ 1 problem (1 error, 0 warnings)
```

### `--format=unix`

A basic, single-line format.

```
test.js:5:1: `debugger` statement is not allowed [Error/eslint(no-debugger)]

1 problem
```
