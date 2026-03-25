---
title: Minifier
outline: deep
---

# Minifier

JavaScript minification plays a crucial role in optimizing website performance as it reduces the amount of data sent to users,
resulting in faster page loads.
This holds tremendous economic value, particularly for e-commerce websites, where every second can equate to millions of dollars.

However, existing minifiers typically require a trade-off between compression quality and speed.
You have to choose between the slowest for the best compression or the fastest for less compression.
But what if we could develop a faster minifier without compromising on compression?

## Project Goals

We are actively working on a prototype that aims to achieve this goal,
by porting all test cases from well-known minifiers such as [google-closure-compiler], [terser], [esbuild], and [tdewolff-minify].

Preliminary results indicate that we are on track to achieve our objectives.
With the Oxc minifier, you can expect faster minification times without sacrificing compression quality.

### Target Performance

- **Speed**: faster than Terser, competitive with esbuild
- **Compression**: Match or exceed Terser's compression ratio
- **Correctness**: Pass all major minifier test suites

## Architecture Overview

### Design Principles

The Oxc minifier is built around several key principles:

1. **Semantic-Aware**: Uses semantic analysis to enable safe optimizations
2. **Incremental**: Designed for incremental compilation workflows
3. **Configurable**: Supports various optimization levels and targets
4. **Correct**: Prioritizes correctness over aggressive optimization

## Current Status

### Implemented Features

- ✅ **Dead Code Elimination**: Remove unreachable code
- ✅ **Constant Folding**: Evaluate constant expressions
- ✅ **Tree Shaking**: Remove unused exports (basic)
- ✅ **Variable Merging**: Merge variable declarations
- ✅ **Statement Merging**: Combine compatible statements
- ✅ **Name Mangling**: Shorten variable and function names
- ✅ **Control Flow Optimization**: Simplify control structures
- ✅ **Function Inlining**: Inline small functions
- ✅ **Advanced Tree Shaking**: Cross-module optimization

### Performance Optimization

Key strategies for maintaining performance:

1. **Minimal AST Traversals**: Combine multiple optimizations in single passes
2. **Efficient Data Structures**: Use arena allocation and compact representations
3. **Early Termination**: Skip optimizations when no benefit is possible

## Resources

### Documentation

- [Minifier API Documentation](https://docs.rs/oxc_minifier)

### External References

- [Google Closure Compiler Optimizations](https://github.com/google/closure-compiler/wiki/JS-Modules)
- [Terser Options](https://github.com/terser/terser#minify-options)
- [esbuild Minification](https://esbuild.github.io/api/#minification)

#### Playgrounds

- esbuild: https://esbuild.github.io/try
- rollup: https://rollupjs.org/repl
- swc: https://play.swc.rs
- terser: https://try.terser.org
- closure compiler: https://jscompressor.treblereel.dev
  - Official website is no longer available: [Closure Compiler Webservice Turndown - 2025](https://github.com/google/closure-compiler/issues/4199)

[google-closure-compiler]: https://github.com/google/closure-compiler
[terser]: https://github.com/terser/terser
[esbuild]: https://github.com/evanw/esbuild
[tdewolff-minify]: https://github.com/tdewolff/minify
