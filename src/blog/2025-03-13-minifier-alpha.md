---
title: Oxc Minifier Alpha
outline: deep
authors:
  - boshen
---

<AppBlogPostHeader />

<br />

We are excited to announce an alpha release for [`oxc-minify`](https://npmx.dev/package/oxc-minify).

While lacking some advanced minification techniques,
the current version already outperforms `esbuild` in terms of performance and compression size,
as demonstrated by [minification-benchmarks](https://github.com/privatenumber/minification-benchmarks).

Comparing widely-used minifiers on `typescript.js`:

<div align="center">

| Artifact                                                                                                                          |                   Original size |                         Gzip size |                                   |
| :-------------------------------------------------------------------------------------------------------------------------------- | ------------------------------: | --------------------------------: | --------------------------------: |
| [typescript v4.9.5](https://npmx.dev/package/typescript/v/4.9.5) ([Source](https://unpkg.com/typescript@4.9.5/lib/typescript.js)) |                      `10.95 MB` |                         `1.88 MB` |                                   |
| **Minifier**                                                                                                                      |               **Minified size** |                **Minzipped size** |                          **Time** |
| [@swc/core](packages/minifiers/minifiers/swc.ts)                                                                                  | **<sup>🏆-70% </sup>`3.32 MB`** | **<sup>🏆-54% </sup>`858.29 kB`** |        <sup>_5x_ </sup>`2,179 ms` |
| [oxc-minify](packages/minifiers/minifiers/oxc-minify.ts)                                                                          |       <sup>-69% </sup>`3.35 MB` |       <sup>-54% </sup>`860.67 kB` |                       🏆 `444 ms` |
| [terser (no compress)](packages/minifiers/minifiers/terser.ts)                                                                    |       <sup>-68% </sup>`3.53 MB` |       <sup>-53% </sup>`879.30 kB` |       <sup>_14x_ </sup>`6,433 ms` |
| [esbuild](packages/minifiers/minifiers/esbuild.ts)                                                                                |       <sup>-68% </sup>`3.49 MB` |       <sup>-51% </sup>`915.55 kB` |          <sup>_1x_ </sup>`492 ms` |
| [terser](packages/minifiers/minifiers/terser.ts) <sub title="Failed: timeout">❌ Timed out</sub>                                  |                               - |                                 - | <sup>:warning:</sup> `+10,000 ms` |

</div>

## [`oxc-minify`](https://npmx.dev/package/oxc-minify) Usage Example

```typescript
import { minify } from "oxc-minify";

const filename = "test.js";
const code = "const x = 'a' + 'b'; console.log(x);";
const options = {
  compress: {
    target: "esnext",
  },
  mangle: {
    toplevel: false,
  },
  codegen: {
    removeWhitespace: true,
  },
  sourcemap: true,
};
const result = minify(filename, code, options);

console.log(result.code);
console.log(result.map);
```

## Next Release

`oxc-minify` is being integrated into [Rolldown](https://rolldown.rs) as its built-in minifier,
and Rolldown is set to [become the future of Vite](https://voidzero.dev/posts/announcing-voidzero-inc).

So it is critical for us to:

- Continue implementing advanced minification techniques, such as constant inlining and dead code removal.
- Strengthen and expand our test infrastructure to ensure it is production-ready.

## Acknowledgements

Thank you [@sapphi-red](https://github.com/sapphi-red) for improving the minifier,
especially the advanced symbol minification algorithm which `esbuild` lacks.
