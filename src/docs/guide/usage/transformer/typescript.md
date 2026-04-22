# TypeScript

Oxc transformer supports transforming TypeScript to JavaScript.

```js
import { transform } from "oxc-transform";

const result = await transform("lib.ts", sourceCode, {
  typescript: {
    jsxPragma: "React.createElement",
    jsxPragmaFrag: "React.Fragment",
    onlyRemoveTypeImports: false,
    allowNamespaces: true,
    removeClassFieldsWithoutInitializer: false,
    rewriteImportExtensions: false,
    optimizeConstEnums: false,
    optimizeEnums: false,
  },
});
```

## `verbatimModuleSyntax`

By default, TypeScript removes unused imports in a different semantics than the JavaScript specification.
The [`verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig/#verbatimModuleSyntax) option tells TypeScript to align with the JavaScript specification.

If you are using this option, make sure to set `typescript.onlyRemoveTypeImports` option to `true`.

```js
import { transform } from "oxc-transform";

const result = await transform("lib.ts", sourceCode, {
  typescript: {
    onlyRemoveTypeImports: true,
  },
});
```

## `useDefineForClassFields`

TypeScript used to have a different semantics for class fields than the JavaScript specification. The [`useDefineForClassFields`](https://www.typescriptlang.org/tsconfig/#useDefineForClassFields) option tells TypeScript to align with the JavaScript specification. This options is enabled by default if the `target` option in the tsconfig is set to `es2022` or higher.

If you are disabling this option, make sure to set `typescript.removeClassFieldsWithoutInitializer` option and `assumptions.setPublicClassFields` to `true`.

```js
import { transform } from "oxc-transform";

const result = await transform("lib.ts", sourceCode, {
  typescript: {
    removeClassFieldsWithoutInitializer: true,
  },
  assumptions: {
    setPublicClassFields: true,
  },
});
```

## Decorators

Oxc transformer supports transforming legacy decorators. This is called experimental decorators in TypeScript.

If you are using the [`experimentalDecorators`](https://www.typescriptlang.org/tsconfig/#experimentalDecorators) option in the tsconfig, you can use the `decorator.legacy` option.
If you are using the [`emitDecoratorMetadata`](https://www.typescriptlang.org/tsconfig/#emitDecoratorMetadata) option in the tsconfig, you can use the `decorator.emitDecoratorMetadata` option.

```js
import { transform } from "oxc-transform";

const result = await transform("lib.ts", sourceCode, {
  decorator: {
    legacy: true,
    emitDecoratorMetadata: true,
  },
});
```

:::: warning Decorator Metadata: Types that requires type inference will fallback to `Object`

Due to the lack of full type inference feature, Oxc transformer will fallback to `Object` type if it cannot calculate the type of the decorator metadata.

For example, the following code will be transformed to the following code:

::: code-group

```ts [input.ts]
import { Something1 } from "./somewhere";

type Something2 = Exclude<string | number, string>;

export class Foo {
  @test
  foo(input1: Something1, input2: Something2) {}
}
```

```js [output(oxc).js]
// omit helper functions
import { Something1 } from "./somewhere";
var _ref;
export class Foo {
  foo(input1, input2) {}
}
_decorate(
  [
    test,
    _decorateMetadata("design:type", Function),
    _decorateMetadata("design:paramtypes", [
      typeof (_ref = typeof Something1 !== "undefined" && Something1) === "function"
        ? _ref
        : Object,
      Object, // [!code highlight]
    ]),
    _decorateMetadata("design:returntype", void 0),
  ],
  Foo.prototype,
  "foo",
  null,
);
```

```js [output(typescript_compiler).js]
// omit helper functions
var _a;
import { Something1 } from "./somewhere";
export class Foo {
  foo(input1, input2) {}
}
__decorate(
  [
    test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [
      typeof (_a = typeof Something1 !== "undefined" && Something1) === "function" ? _a : Object,
      Number, // [!code highlight]
    ]),
    __metadata("design:returntype", void 0),
  ],
  Foo.prototype,
  "foo",
  null,
);
```

:::

This behavior aligns with TypeScript's behavior when using a type that is external.

You can explicitly set the types by calling `Reflect.metadata`:

::: code-group

```ts [input.ts]
import { Something1 } from "./somewhere";

type Something2 = Exclude<string | number, string>;

export class Foo {
  @test
  @Reflect.metadata("design:paramtypes", [Something1, Number])
  foo(input1: Something1, input2: Something2) {}
}
```

```js [output.js]
// omit helper functions
import { Something1 } from "./somewhere";
var _ref;
export class Foo {
  foo(input1, input2) {}
}
_decorate(
  [
    test,
    Reflect.metadata("design:paramtypes", [Something1, Number]),
    _decorateMetadata("design:type", Function),
    _decorateMetadata("design:paramtypes", [
      typeof (_ref = typeof Something1 !== "undefined" && Something1) === "function"
        ? _ref
        : Object,
      Object,
    ]),
    _decorateMetadata("design:returntype", void 0),
  ],
  Foo.prototype,
  "foo",
  null,
);
```

:::

::::

## TSX

Transforming TSX files is supported as well.
See [JSX transform](./jsx) for more information.

## Rewriting import extensions

If you are using the [`rewriteRelativeImportExtensions`](https://www.typescriptlang.org/tsconfig/#rewriteRelativeImportExtensions) option in the tsconfig, you can use the `typescript.rewriteImportExtensions` option.

- `"rewrite"` or `true`: rewrites `.ts` and `.tsx` to `.js`, `.mts` to `.mjs`, and `.cts` to `.cjs`.
- `"remove"`: removes `.ts`/`.tsx`/`.mts`/`.cts` extensions entirely.
- `false` (default): no changes.

```js
import { transform } from "oxc-transform";

const result = await transform("lib.ts", sourceCode, {
  typescript: {
    rewriteImportExtensions: "rewrite", // or "remove", true, false
  },
});
```

## Optimize Enums

Oxc transformer can optimize enums by inlining their member values at usage sites.

- `optimizeConstEnums`: inlines `const enum` values and removes the declaration.
- `optimizeEnums`: inlines regular (non-const) enum member accesses when all members satisfy const enum constraints (i.e., their values are statically evaluable). Non-exported enum declarations are also removed when all members are evaluable and no references to the enum as a runtime value exist.

```js
import { transform } from "oxc-transform";

const result = await transform("lib.ts", sourceCode, {
  typescript: {
    optimizeConstEnums: true,
    optimizeEnums: true,
  },
});
```

## Declaration

Generate `.d.ts` declaration files alongside the transform output. The source file must be compliant with all [`isolatedDeclarations`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-5.html#isolated-declarations) requirements.

```js
import { transform } from "oxc-transform";

const result = await transform("lib.ts", sourceCode, {
  typescript: {
    declaration: {
      stripInternal: false,
    },
  },
});

console.log(result.declaration); // the .d.ts content
console.log(result.declarationMap); // the declaration source map (if sourcemap is enabled)
```

## Caveats

### Isolated Modules

Because Oxc transformer transforms each files independently, some TypeScript features are not supported.
To avoid using unsupported features, you should enable the [`isolatedModules`](https://www.typescriptlang.org/tsconfig/#isolatedModules) option in your `tsconfig.json` file.

### Partial Namespace Support

TypeScript has a legacy feature called [namespaces](https://www.typescriptlang.org/docs/handbook/namespaces.html). While [it is recommended to use ES modules for new projects](https://www.typescriptlang.org/docs/handbook/namespaces-and-modules.html#using-modules), Oxc transformer has a partial support for namespaces.

#### Exporting a variable using `var` or `let` is not supported

Exporting a variable using `var` or `let` is not supported.

```ts
namespace Foo {
  export let bar = 1; // [!code highlight]
}
console.log(Foo.bar);
```

A workaround is to use `const`. If you need the variable to be mutable, use an object with internal mutability:

```ts
namespace Foo {
  export const bar = { value: 1 }; // [!code highlight]
}
console.log(Foo.bar.value);
```

#### Namespaces does not share the scope between namespaces with the same name

::: code-group

```ts [input.ts]
namespace Foo {
  export const bar = 1;
}
namespace Foo {
  export const baz = bar;
}
```

```js [output(oxc).js]
let foo;
(function (_Foo) {
  const bar = (_Foo.bar = 1);
})(Foo || (Foo = {}));
(function (_Foo2) {
  const baz = (_Foo2.baz = bar); // [!code highlight]
})(Foo || (Foo = {}));
```

```js [output(typescript_compiler).js]
var Foo;
(function (Foo) {
  Foo.bar = 1;
})(Foo || (Foo = {}));
(function (Foo) {
  Foo.baz = Foo.bar; // [!code highlight]
})(Foo || (Foo = {}));
```

:::

In this example, the `bar` reference in the second namespace points to the `bar` variable in the first namespace for the TypeScript compiler output, but it does not for the Oxc transformer output.

A workaround is to explicitly reference via the namespace object:

```ts
namespace Foo {
  export const bar = 1;
}
namespace Foo {
  export const baz = Foo.bar; // [!code highlight]
}
```
