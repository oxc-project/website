---
title: Oxlint JS Plugins Preview
authors:
  - overlookmotel
  - cameron
---

<AppBlogPostHeader />

<br>

Earlier this year [we asked for input from the community](https://github.com/oxc-project/oxc/discussions/10342)
to inform design for Oxlint support for custom JS plugins. Today, we are pleased to announce the result of many months
of research, prototyping, and finally building:

**Oxlint supports plugins written in JS!**

#### Key features

- ESLint-compatible plugin API. Oxlint will be able to run many existing ESLint plugins without modification.
- An alternative API which is slightly different, and unlocks better performance.

#### What this is and isn't

This preview release is just the beginning. It is important to note that:

- This initial release does not implement all of ESLint's plugin API.
- Performance is good, but it's going to get _way_ better - we have many optimizations in the pipeline.

The most commonly-used APIs for code-checking rules [are implemented](#features), so many existing ESLint rules will already work.
But token-related APIs are absent, so stylistic (formatting) rules will not.

We invite users to take it for a spin, give feedback, and inform our priorities for the next phase of development.

#### This blog post covers

1. How to use it.
2. What's coming next.
3. Some of the technical details that enable our "have cake and eat it" approach of providing both ESLint compatibility
   **and** excellent performance.

## Quick Start

Install Oxlint in your project:

```sh
pnpm add -D oxlint
```

Write a custom JS plugin:

```js
// plugin.js

// The simplest rule of all - no debugger
const rule = {
  create(context) {
    return {
      DebuggerStatement(node) {
        context.report({
          message: "No debugger!",
          node,
        });
      },
    };
  },
};

const plugin = {
  meta: {
    name: "best-plugin-ever",
  },
  rules: {
    "no-debugger": rule,
  },
};

export default plugin;
```

Create config file enabling the plugin:

```json
// .oxlintrc.json
{
  "jsPlugins": ["./plugin.js"],
  "rules": {
    "best-plugin-ever/no-debugger": "error"
  }
}
```

Add a file to be linted:

```js
// foo.js
debugger;
```

Run Oxlint:

```sh
pnpm oxlint
```

Expect to see:

```
 x best-plugin-ever(no-debugger): No debugger!
  ,-[foo.js:1:1]
1 | debugger;
  : ^^^^^^^^^
  `----
```

For further details on authoring plugins, see [the docs](/docs/guide/usage/linter/writing-js-plugins.html).

## Alternative API

Oxlint also offers a slightly different API which unlocks better performance.

**This alternative API produces plugins which are compatible with ESLint, as well as Oxlint.**

Example rule that flags files containing more than 5 class declarations:

#### ESLint version

```js
const rule = {
  create(context) {
    let classCount = 0;

    return {
      ClassDeclaration(node) {
        classCount++;
        if (classCount === 6) {
          context.report({ message: "Too many classes", node });
        }
      },
    };
  },
};
```

#### Alternative API version

```js
import { defineRule } from "oxlint";

const rule = defineRule({
  createOnce(context) {
    // Define counter variable
    let classCount;

    return {
      before() {
        // Reset counter before traversing AST of each file
        classCount = 0;
      },
      // Same as before
      ClassDeclaration(node) {
        classCount++;
        if (classCount === 6) {
          context.report({ message: "Too many classes", node });
        }
      },
    };
  },
});
```

#### The differences

1. Wrap the rule object in `defineRule(...)`.

```diff
- const rule = {
+ const rule = defineRule({
```

2. Use `createOnce` instead of `create`.

```diff
-   create(context) {
+   createOnce(context) {
```

3. Move any per-file setup from body of `create` into `before` hook.

```diff
-     let classCount = 0;
+     let classCount;

      return {
+       before() {
+         classCount = 0; // Reset counter
+       },
        ClassDeclaration(node) {
          classCount++;
          if (classCount === 6) {
            context.report({ message: "Too many classes", node });
          }
        },
      };
    },
  });
```

This is the only significant difference - `create` (ESLint's method) is called repeatedly _for each file_,
whereas `createOnce` is called once only.

All other APIs behave exactly the same as in ESLint.

The reasons why this alternative API has potential to greatly improve performance are explained in
[the docs](/docs/guide/usage/linter/writing-js-plugins.html#why-is-the-alternative-api-faster).

## Performance

As mentioned above, performance has not been our focus in this initial preview release of Oxlint JS plugins.
Our primary goal has been to fill out enough of the API for JS plugins to be useful in real world projects,
and gather feedback from early adopters.

Performance at present is decent, but not by any means stellar.

However - and we feel this is the important point - our prototype of the _next_ version demonstrates that the
architectural design we've settled on is capable of _exceptional_ performance, once various optimizations are added
into the mix (see [Under the hood](#under-the-hood)).

We'll be applying those optimization over the course of the next few months, and users will see multiple x speed-ups
compared to the current version.

That said, even without those optimizations, Oxlint's performance is still competitive.

Oxlint vs ESLint linting a medium-sized TypeScript project [vuejs/core](https://github.com/vuejs/core):

| Linter                       | Time     |
| ---------------------------- | -------- |
| ESLint                       | 4,116 ms |
| ESLint multi-threaded        | 3,710 ms |
| Oxlint                       | 48 ms    |
| Oxlint with custom JS plugin | 236 ms   |

<div>
<details>
<summary>Details</summary>

:::info

- Benchmark repo: https://github.com/overlookmotel/vue-core-cam/tree/bench-js-plugins
- Benchmarked on MacBook Air M3, 24GB RAM
- Bench command:

```sh
hyperfine -i --warmup 3 \
  './node_modules/.bin/oxlint --silent' \
  './node_modules/.bin/oxlint -c .oxlintrc-with-custom-plugin.json --silent' \
  'USE_CUSTOM_PLUGIN=true ./node_modules/.bin/eslint .' \
  'USE_CUSTOM_PLUGIN=true ./node_modules/.bin/eslint . --concurrency=auto'
```

Note: The version of Oxlint on NPM at time of writing (1.23.0) has a bug which affects this benchmark, and hugely
underestimates the cost of JS plugins. The above results were obtained using latest `main` branch, after the bug fix,
at [this commit](https://github.com/oxc-project/oxc/commit/cd266b4c101c35c33e122457cdd0b514b44597a9).
Please also see [below](#edit-18th-oct-2025).

:::

</details>
</div>

In this example, adding a simple JS plugin to Oxlint does have a significant cost, but Oxlint is still 15x faster
than ESLint, even using ESLint's new multi-threaded runner.

Obviously, more complicated JS plugins, or many of them, will have a higher performance cost.

## Features

Oxlint supports most of ESLint's APIs which are typically used in plugins/rules which rely only on AST inspection.
That includes most "fix code"-type rules.

It does not yet support token-based APIs, so stylistic (formatting) rules will not work yet.

#### Supported

- AST traversal
- AST exploration (`node.parent`, `context.sourceCode.getAncestors`)
- Fixes
- Selectors ([ESLint docs](https://eslint.org/docs/latest/extend/selectors))
- `SourceCode` APIs (e.g. `context.sourceCode.getText(node)`)

#### Not supported yet

- Language server (IDE) support
- Rule options
- Suggestions
- ~~Scope analysis~~ ([implemented](https://github.com/oxc-project/oxc/pull/14890) since v1.25.0)
- `SourceCode` APIs related to tokens and comments (e.g. `context.sourceCode.getTokens(node)`)
- Control flow analysis

## What's next

Over the next few months, we will be:

#### 1. Filling out the plugin API surface

Aim is to support 100% of ESLint's plugin API surface, so that Oxlint will eventually be able to run _any_ ESLint
plugin without modification.

#### 2. Improving performance

Performance is already decent, but we have proven during our prototyping many significant performance gains from further
optimizations. We will apply them, and make JS plugins in Oxlint run at as close to Rust speed as we can get.

## Under the hood

The rest of this post is not necessary to use JS plugins with Oxlint. But if you're interested in the geeky details
of how our implementation works, read on...

### The big question: To ESLint compat or not to ESLint compat?

The question which [we posed to the community](https://github.com/oxc-project/oxc/discussions/10342) earlier this year
was whether Oxlint should aim for an ESLint-compatible plugin API or not.

Obviously, an ESLint-compatible interface is ideal in terms of familiarity and ease of migration from ESLint.

However, Oxlint is known for its excellent performance, and compromising that too much would not be desirable.

The main aim of our prototyping work over past few months has been to quantify what is the trade-off between performance
and ESLint compatibility, and to investigate if there's a "have cake and eat it" solution which satisfies both -
providing an ESLint-compatible API _and_ acceptable performance ("acceptable" here means pretty damn fast!)

We believe that through a combination of different approaches, we've found a way to satisfy both demands.

### Alternative API

See explanation [in docs](/docs/guide/usage/linter/writing-js-plugins.html#why-is-the-alternative-api-faster)
of why this API unlocks potential for higher performance.

### Raw transfer

Tools like Oxc represent the code of a JS/TS file as an "AST"
([abstract syntax tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree)).
ASTs are really big - much much larger than the source code they represent.

Typically, the biggest barrier to performant interop between JS and native languages like Rust is the serialization
and deserialization involved in transferring such large data structures between the "two worlds".

The simplest and most common way to move an AST between JS and Rust is: Serialize the AST to JSON, send it across to JS
as a string and then "rehydrate" it again with `JSON.parse`. But this is extremely slow. Often the cost of these
conversions is so high that they massively outweigh the performance gain of using native code in the first place.
Other serialization formats are more efficient than JSON, but they still have a sizeable overhead.

We have developed a scheme "raw transfer" which cuts out serialization altogether, by using Rust's native memory layout
as the serialization format (more details on how it works [here](https://github.com/oxc-project/oxc/issues/2409)).

"Raw transfer" is the base of the current implementation of JS plugins.

### Lazy deserialization

The 2nd biggest enemy of good perf, particularly when running JS across multiple CPU cores in worker threads,
is the garbage collector. Every object you create also needs to be destroyed to recover its memory.
In JS, this is the job of the garbage collector. JS engines like V8 are highly optimized, but still garbage collection
is an expensive process, and GC "steals" CPU resources from the actual workload.

We have prototyped an AST visitor which deserializes the AST _lazily_, and only deserializes the parts of the AST which
actually _need_ to be.

For example, if your lint rule relates to class declarations, this visitor will fly through most of the AST without
doing much, and will only create JS objects for `ClassDeclaration` AST nodes, which are then passed to the rule's code
to process. For the rest of the AST (variable declarations, `if` statements, functions, etc) there is no need to create
node objects at all.

This has 2 effects:

1. Raw transfer cuts the cost of serialization to zero. Laziness dramatically reduces the other side
   (deserialization) too.
2. Greatly reduced garbage collector pressure.

Deno has taken a similar approach, which is explained brilliantly in
[Marvin Hagemeister's blog post](https://marvinh.dev/blog/speeding-up-javascript-ecosystem-part-11/), and Deno lint
has a superbly efficient implementation.

However, we've found that it's the combination of lazy deserialization with "raw transfer" which delivers _really_ good
performance. Our tests have found that, with both these overheads removed, JS plugins can run at much greater speed.

This optimization is not yet included in current version of JS plugins. We will implement it in a future version.

## Try it out!

Please try out JS plugins and report your experience. All feedback - either positive or negative - is gratefully
received.

In particular, if you find that Oxlint is lacking some of the APIs you need for your plugins to work,
please let us know. We'll be filling in the gaps in the API over the next few months, and will prioritise those for
which there's greatest demand.

Happy linting!

---

#### Edit: 18th Oct 2025

The original version of this blog post published on 9th Oct contained benchmarks results which showed the performance
of Oxlint JS plugins to be far better than they are in reality. This was the result of a bug in Oxlint which was causing
JS plugins to be skipped on many files in certain circumstances when the config contains overrides. This bug lead to
the performance of JS plugins being way overestimated in the benchmarks we quoted.

We sincerely apologise for this mistake, and thank [Herrington Darkholme](https://github.com/HerringtonDarkholme)
for pointing out the error.
