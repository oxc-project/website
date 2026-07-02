---
title: Adding Linter Rules
outline: deep
---

# Adding Linter Rules

The best and easiest way to contribute to Oxlint is by adding new linter rules.

This guide will walk you through this process, using ESLint's
[`no-debugger`](https://eslint.org/docs/latest/rules/no-debugger) rule as an
example.

:::tip
Make sure you've read the [setup instructions](../development.md) first.
:::

## Step 1: Pick a Rule

Our [Linter product plan and progress](https://github.com/oxc-project/oxc/issues/481) issue tracks the status
of all rules we want to implement from existing ESLint plugins. From there, pick
a plugin that looks interesting to you and find a rule that has not been
implemented.

**Important**: Since ESLint-compatible JavaScript plugin support is now available, we do not plan to add new Rust-based plugins. However, contributions that add rules to existing plugins are **highly encouraged**. If you think a rule or plugin would benefit from being written in rust, please open a discussion first, before making a pull request.

Most documentation pages for ESLint rules include a link to the rule's [source code](https://eslint.org/docs/latest/rules/no-debugger#resources). Using this as
a reference will help you with your implementation.

## Step 2: Rule Generation

Next, run the rulegen script to generate boilerplate code for your new rule.

```bash
just new-rule no-debugger
```

This will:

1. Create a new file in `crates/oxc_linter/src/rules/<plugin-name>/<rule-name>.rs` with the start of your rule's implementation and all test cases ported from ESLint
2. Register the rule in the appropriate `mod` in [`rules.rs`](https://github.com/oxc-project/oxc/blob/main/crates/oxc_linter/src/rules.rs)
3. Add the rule to `oxc_macros::declare_all_lint_rules!`

For rules that are part of a different plugin, you'll need to use that plugin's
own rulegen script.

:::tip
Run `just` with no arguments to see all available commands.
:::

```bash
just new-rule [name]            # for eslint core rules
just new-jest-rule [name]       # for eslint-plugin-jest
just new-ts-rule [name]         # for @typescript-eslint/eslint-plugin
just new-unicorn-rule [name]    # for eslint-plugin-unicorn
just new-import-rule [name]     # for eslint-plugin-import
just new-react-rule [name]      # for eslint-plugin-react and eslint-plugin-react-hooks
just new-jsx-a11y-rule [name]   # for eslint-plugin-jsx-a11y
just new-oxc-rule [name]        # for oxc's own rules
just new-nextjs-rule [name]     # for eslint-plugin-next
just new-jsdoc-rule [name]      # for eslint-plugin-jsdoc
just new-react-perf-rule [name] # for eslint-plugin-react-perf
just new-n-rule [name]          # for eslint-plugin-n
just new-promise-rule [name]    # for eslint-plugin-promise
just new-vitest-rule [name]     # for eslint-plugin-vitest
```

The generated file will look something like this:

<details>
<summary>Click to expand</summary>

::: code-group

````rust [rules/eslint/no_debugger.rs]
use oxc_diagnostics::OxcDiagnostic;
use oxc_macros::declare_oxc_lint;
use oxc_span::Span;

use crate::{
    context::LintContext,
    fixer::{RuleFix, RuleFixer},
    rule::Rule,
    AstNode,
};

#[derive(Debug, Default, Clone)]
pub struct NoDebugger;

declare_oxc_lint!(
    /// ### What it does
    ///
    ///
    /// ### Why is this bad?
    ///
    ///
    /// ### Examples
    ///
    /// Examples of **incorrect** code for this rule:
    /// ```js
    /// FIXME: Tests will fail if examples are missing or syntactically incorrect.
    /// ```
    ///
    /// Examples of **correct** code for this rule:
    /// ```js
    /// FIXME: Tests will fail if examples are missing or syntactically incorrect.
    /// ```
    NoDebugger,
    nursery, // TODO: change category to `correctness`, `suspicious`, `pedantic`, `perf`, `restriction`, or `style`
             // See <https://oxc.rs/docs/contribute/linter.html#rule-category> for details

    pending  // TODO: describe fix capabilities. Remove if no fix can be done,
             // keep at 'pending' if you think one could be added but don't know how.
             // Options are 'fix', 'fix_dangerous', 'suggestion', and 'conditional_fix_suggestion'
);

impl Rule for NoDebugger {
    fn run<'a>(&self, node: &AstNode<'a>, ctx: &LintContext<'a>) {}
}

#[test]
fn test() {
    use crate::tester::Tester;
    let pass = vec!["var test = { debugger: 1 }; test.debugger;"];
    let fail = vec!["if (foo) debugger"];
    Tester::new(NoDebugger::NAME, pass, fail).test_and_snapshot();
}
````

:::

</details>

Your rule should now be ready to run! You can try it out with `cargo test -p
oxc_linter`. The tests should fail, since you haven't implemented the rule yet.

## Step 3: Fill Out the Template

### Documentation

Fill out the various documentation sections.

- Provide a clear and concise summary of what the rule does.
- Explain why the rule is important and what undesirable behavior it prevents.
- Provide examples of code that violates the rule and code that does not.

Remember, we use this documentation to generate the [rule documentation pages](/docs/guide/usage/linter/rules) for this website, so make sure your
documentation is clear and helpful!

#### Configuration Documentation

If your rule has configuration options, you will need to document them. You should do so via the system for auto-generating documentation. This should be partially generated for you automatically by the rulegen script.

Each configuration option should be defined by adding fields to the rule's struct:

```rust
pub struct RuleName {
  option_name: bool,
  another_option: String,
  yet_another_option: Vec<CompactStr>,
}
```

Alternatively, you can instead define a separate `Config` struct to hold all configuration options:

```rust
pub struct RuleName(Box<RuleNameConfig>);

pub struct RuleNameConfig {
  option_name: bool,
}
```

The configuration options should have `JsonSchema` derived for them and also a serde decoration, like so:

```rust
use schemars::JsonSchema;

#[derive(Debug, Default, Clone, JsonSchema)]
#[serde(rename_all = "camelCase", default)]
pub struct RuleName {
  option_name: bool,
}
```

Add documentation comments (`///`) to each field to describe the option, for example:

```rust
use schemars::JsonSchema;

#[derive(Debug, Default, Clone, JsonSchema)]
#[serde(rename_all = "camelCase", default)]
pub struct RuleName {
  /// Whether to check for foo and bar when evaluating baz.
  /// The comment can be as long as you need to fully describe the option.
  option_name: bool,
}
```

The default value and the type of each option will be automatically extracted from the struct definition, and should not be mentioned in the documentation comments.

See [this issue](https://github.com/oxc-project/oxc/issues/14743) for dozens of examples of how to properly document configuration options in all kinds of rules.

You can view the generated documentation by running `cargo run -p website -- linter-rules --rule-docs target/rule-docs --git-ref $(git rev-parse HEAD)` and then opening `target/rule-docs/<plugin-name>/<rule-name>.md`.

### Rule Category

First, pick a [rule category](../linter.md#rule-category) that best fits the
rule. Remember that `correctness` rules will be run by default, so be careful
when choosing this category. Set your category within the `declare_oxc_lint!` macro.

### Fixer Status

If the rule has a fixer, register what kind of fixes it provides within
`declare_oxc_lint!`. If you're not comfortable with implementing a fixer, you
can also use `pending` as a placeholder. This helps other contributors find and
implement missing fixers down the line.

<!-- TODO: provide link to fixer kinds documentation -->

### Diagnostics

Create a function to create diagnostics for rule violations. Follow these
principles:

1. The `message` should be an imperative statement about what is wrong, not a description of what the rule does.
2. The `help` message should be a command-like statement that tells the user how to fix the issue.

::: code-group

```rust [good]
fn no_debugger_diagnostic(span: Span) -> OxcDiagnostic {
    OxcDiagnostic::warn("`debugger` statement is not allowed")
        .with_help("Remove this `debugger` statement")
        .with_label(span)
}
```

```rust [bad]
fn no_debugger_diagnostic(span: Span) -> OxcDiagnostic {
    OxcDiagnostic::warn("Disallow `debugger` statements")
        .with_help("`debugger` statements are not allowed.")
        .with_label(span)
```

:::

## Step 4: Rule Implementation

Read the rule's source code to understand how it works. Although Oxlint works
similarly to ESLint, it is unlikely that the rule can be ported directly.

ESLint rules have a `create` function that returns an object whose keys are AST
nodes that trigger the rule and values are functions that run lints on those
nodes. Oxlint rules run on one of a few triggers, each of which come from the
[`Rule`](https://github.com/oxc-project/oxc/blob/main/crates/oxc_linter/src/rule.rs)
trait:

1. Run on each AST node (via `run`)
2. Run on each symbol (via `run_on_symbol`)
3. Run a single time on the entire file (via `run_once`)

In the case of `no-debugger`, we are looking for `DebuggerStatement` nodes, so
we'll use `run`. Here's a simplified version of the rule:

<details>
<summary>Click to expand</summary>

::: code-group

````rust [rules/eslint/no_debugger.rs]
use oxc_ast::AstKind;
use oxc_diagnostics::OxcDiagnostic;
use oxc_macros::declare_oxc_lint;
use oxc_span::Span;

use crate::{context::LintContext, rule::Rule, AstNode};

fn no_debugger_diagnostic(span: Span) -> OxcDiagnostic {
    OxcDiagnostic::warn("`debugger` statement is not allowed")
        .with_label(span)
}

#[derive(Debug, Default, Clone)]
pub struct NoDebugger;

declare_oxc_lint!(
    /// ### What it does
    /// Checks for usage of the `debugger` statement
    ///
    /// ### Why is this bad?
    /// `debugger` statements do not affect functionality when a
    /// debugger isn't attached. They're most commonly an
    /// accidental debugging leftover.
    ///
    /// ### Example
    ///
    /// Examples of **incorrect** code for this rule:
    /// ```js
    /// async function main() {
    ///     const data = await getData();
    ///     const result = complexCalculation(data);
    ///     debugger;
    /// }
    /// ```
    NoDebugger,
    correctness
);

impl Rule for NoDebugger {
    // Runs on each node in the AST
    fn run<'a>(&self, node: &AstNode<'a>, ctx: &LintContext<'a>) {
        // `debugger` statements have their own AST kind
        if let AstKind::DebuggerStatement(stmt) = node.kind() {
            // Report a violation
            ctx.diagnostic(no_debugger_diagnostic(stmt.span));
        }
    }
}
````

:::

</details>

:::tip

You
will want to get familiar with the data stored in
[`Semantic`](https://github.com/oxc-project/oxc/blob/main/crates/oxc_semantic/src/lib.rs#L59),
which is where all data extracted during semantic analysis is stored. You will
also want to familiarize yourself with the AST structure. The two most important
data structures here are
[`AstNode`](https://github.com/oxc-project/oxc/blob/main/crates/oxc_semantic/src/node/mod.rs)
and
[`AstKind`](https://github.com/oxc-project/oxc/blob/main/crates/oxc_ast/src/generated/ast_kind.rs)
:::

## Step 5: Testing

To test your rule whenever you make a change, run:

```bash
just watch "cargo test -p oxc_linter -- rule-name"
```

Or to just test it once, run:

```bash
cargo test -p oxc_linter -- rule-name
# Or
cargo insta test -p oxc_linter -- rule-name
```

Oxlint uses [`cargo insta`](https://insta.rs/docs) for snapshot testing. `cargo
test` will fail if snapshots have changed or have just been created. You can run
`cargo insta test -p oxc_linter` to not see diffs in your test results. You can
review the snapshots by running `cargo insta review`, or skip the review and
just accept all changes using `cargo insta accept`.

When you are ready to submit your PR, run `just ready` or `just r` to run CI
checks locally. You can also run `just fix` to auto-fix any lint, format, or
typo problems. Once `just ready` is passing, create a PR and a maintainer will
review your changes.

## General Advice

### Pin point the error message to the shortest code span

We want the user to focus on the problematic code rather than deciphering the
error message to identify which part of the code is erroneous.

### Use `let-else` statements

If you find yourself deeply nesting
[`if-let`](https://doc.rust-lang.org/rust-by-example/flow_control/if_let.html)
statements, consider using [`let-else`](https://doc.rust-lang.org/rust-by-example/flow_control/let_else.html) instead.

:::tip
CodeAesthetic's [never-nesting video](https://www.youtube.com/watch?v=CFRhGnuXG-4) explains this concept in
more detail.
:::

::: code-group

```rust [good]
// let-else is easier to read
fn run<'a>(&self, node: &AstNode<'a>, ctx: &LintContext<'a>) {
    let AstKind::JSXOpeningElement(jsx_opening_elem) = node.kind() else {
        return;
    };
    let Some(expr) = container.expression.as_expression() else {
        return;
    };
    let Expression::BooleanLiteral(expr) = expr.without_parenthesized() else {
        return;
    };
    // ...
}
```

```rust [bad]
// deep nesting is hard to read
fn run<'a>(&self, node: &AstNode<'a>, ctx: &LintContext<'a>) {
    if let AstKind::JSXOpeningElement(jsx_opening_elem) = node.kind() {
        if let Some(expr) = container.expression.as_expression() {
            if let Expression::BooleanLiteral(expr) = expr.without_parenthesized() {
                // ...
            }
        }
    }
}
```

:::

### Use `CompactStr` where possible

Reducing allocations as much as possible is critical for performance in `oxc`. The `String` type requires allocating memory on the heap, which costs memory and CPU cycles. It is possible to [store small strings inline](https://oxc.rs/docs/learn/performance.html#string-inlining) (up to 24 bytes on 64-bit systems) on the stack using `CompactStr`, which means we don't need to allocate memory. If the string is too large to store inline, it will allocate the necessary space. Using `CompactStr` can be used almost anywhere that has the type `String` or `&str`, and can save a significant amount memory and CPU cycles compared to the `String` type.

::: code-group

```rust [good]
struct Element {
  name: CompactStr
}

let element = Element {
  name: "div".into()
};
```

```rust [bad]
struct Element {
  name: String
}

let element = Element {
  name: "div".to_string()
};
```

:::
