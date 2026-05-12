---
title: AST
outline: deep
---

# Abstract Syntax Tree (AST)

The Oxc AST is the foundation of all Oxc tools. Understanding its structure and how to work with it is essential for contributing to parser, linter, transformer, and other components.

## AST Architecture

### Design Principles

The Oxc AST is designed with the following principles:

1. **Performance First**: Optimized for speed and memory efficiency
2. **Type Safety**: Leverages Rust's type system to prevent common errors
3. **Spec Compliance**: Closely follows ECMAScript specification
4. **Clear Semantics**: Removes ambiguity present in other AST formats

## Working with the AST

### Generate AST Related Code

When you modify AST definitions, run the code generation tool:

```bash
just ast
```

This generates:

- **Visitor patterns**: For traversing the AST
- **Builder methods**: For constructing AST nodes
- **Trait implementations**: For common operations
- **TypeScript types**: For Node.js bindings

### AST Node Structure

Every AST node follows a consistent pattern:

```rust
#[ast(visit)]
pub struct FunctionDeclaration<'a> {
    pub span: Span,
    pub id: Option<BindingIdentifier<'a>>,
    pub generator: bool,
    pub r#async: bool,
    pub params: FormalParameters<'a>,
    pub body: Option<FunctionBody<'a>>,
    pub type_parameters: Option<TSTypeParameterDeclaration<'a>>,
    pub return_type: Option<TSTypeAnnotation<'a>>,
}
```

Key components:

- **`span`**: Source location information
- **`#[ast(visit)]`**: Generates visitor methods
- **Lifetime `'a`**: References to arena-allocated memory

### Memory Management

The AST uses a memory arena for efficient allocation:

```rust
use oxc_allocator::Allocator;

let allocator = Allocator::default();
let ast = parser.parse(&allocator, source_text, source_type)?;
```

Benefits:

- **Fast allocation**: No individual malloc calls
- **Fast deallocation**: Drop entire arena at once
- **Cache friendly**: Linear memory layout
- **No reference counting**: Simple lifetime management

## AST Traversal

### Visitor Pattern

Use the generated visitor for AST traversal:

```rust
use oxc_ast::visit::{Visit, walk_mut};

struct MyVisitor;

impl<'a> Visit<'a> for MyVisitor {
    fn visit_function_declaration(&mut self, func: &FunctionDeclaration<'a>) {
        println!("Found function: {:?}", func.id);
        walk_mut::walk_function_declaration(self, func);
    }
}

// Usage
let mut visitor = MyVisitor;
visitor.visit_program(&program);
```

### Mutable Visitor

`VisitMut` can be used to modify the AST during traversal.

For example, to transform binary addition of string literals into a single string literal:

```rust
use oxc_ast::AstBuilder;
use oxc_ast_visit::{VisitMut, walk_mut};
use oxc_str::Str;

struct MyTransformer<'a> {
    pub builder: &'a AstBuilder<'a>,
}

impl<'a> VisitMut<'a> for MyTransformer<'a> {
    fn visit_expression(&mut self, expr: &mut Expression<'a>) {
        // Detect the expression type which you want to modify when changing from one enum variant to another.
        if let Expression::BinaryExpression(bin_expr) = expr
            && let (
                BinaryOperator::Addition,
                Expression::StringLiteral(sl),
                Expression::StringLiteral(sr),
            ) = (bin_expr.operator, &bin_expr.left, &bin_expr.right)
        {
            let value = Str::from_strs_array_in(
                [sl.value.as_str(), sr.value.as_str()],
                self.builder.allocator,
            );
            *expr = self.builder.expression_string_literal(SPAN, value, None);
        }

        walk_mut::walk_expression(self, expr);
    }
}
```

For example, to modify a binary expression without changing its type:

```rust
use oxc_ast::AstBuilder;
use oxc_ast_visit::{VisitMut, walk_mut};

struct MyTransformer<'a> {
    pub builder: &'a AstBuilder<'a>,
}

impl<'a> VisitMut<'a> for MyTransformer<'a> {
    fn visit_binary_expression(&mut self, expr: &mut BinaryExpression<'a>) {
        if expr.operator == BinaryOperator::Addition {
            // Modify the AST node. You can modify only left/right and operator parts, not the type of expression itself.
        }
        walk_mut::walk_binary_expression(self, expr);
    }
}
```

## AST Construction

### Builder Pattern

Use the AST builder for creating nodes:

```rust
use oxc_ast::AstBuilder;

let ast = AstBuilder::new(&allocator);

// Create a binary expression: a + b
let left = ast.expression_identifier_reference(SPAN, "a");
let right = ast.expression_identifier_reference(SPAN, "b");
let expr = ast.expression_binary_expression(
    SPAN,
    left,
    BinaryOperator::Addition,
    right,
);
```

### Helper Functions

Common patterns are provided as helpers:

```rust
impl<'a> AstBuilder<'a> {
    pub fn expression_numeric_literal(&self, span: Span, value: f64) -> Expression<'a> {
        self.alloc(Expression::NumericLiteral(
            self.alloc(NumericLiteral { span, value, raw: None })
        ))
    }
}
```

## Development Workflow

### Adding New AST Nodes

1. **Define the struct**:

   ```rust
   #[ast(visit)]
   pub struct MyNewNode<'a> {
       pub span: Span,
       pub name: Atom<'a>,
       pub value: Expression<'a>,
   }
   ```

2. **Add to enum**:

   ```rust
   pub enum Statement<'a> {
       // ... existing variants
       MyNewStatement(Box<'a, MyNewNode<'a>>),
   }
   ```

3. **Run code generation**:

   ```bash
   just ast
   ```

4. **Implement parsing logic**:
   ```rust
   impl<'a> Parser<'a> {
       fn parse_my_new_node(&mut self) -> Result<MyNewNode<'a>> {
           // Parsing implementation
       }
   }
   ```

## Comparing AST Formats

### Use AST Explorer

For comparing with other parsers, use [ast-explorer.dev](https://ast-explorer.dev):

1. **Better UI**: Modern interface with syntax highlighting
2. **Up-to-date**: Latest parser versions
3. **Multiple parsers**: Compare Oxc, Babel, TypeScript, etc.
4. **Export formats**: JSON, code generation

## Performance Considerations

### Memory Layout

The AST is designed for cache efficiency:

```rust
// Good: Compact representation
struct CompactNode<'a> {
    span: Span,           // 8 bytes
    flags: u8,            // 1 byte
    name: Atom<'a>,       // 8 bytes
}

// Avoid: Large enums without boxing
enum LargeEnum {
    Small,
    Large { /* 200 bytes of data */ },
}
```

### Arena Allocation

All AST nodes are allocated in the arena:

```rust
// Automatically handled by #[ast] macro
let node = self.ast.alloc(MyNode {
    span: SPAN,
    value: 42,
});
```

### Enum Size Testing

We enforce small enum sizes:

```rust
#[cfg(all(target_arch = "x86_64", target_pointer_width = "64"))]
#[test]
fn no_bloat_enum_sizes() {
    use std::mem::size_of;
    assert_eq!(size_of::<Statement>(), 16);
    assert_eq!(size_of::<Expression>(), 16);
    assert_eq!(size_of::<Declaration>(), 16);
}
```

## Advanced Topics

### Custom AST Attributes

Add custom attributes for specific tools:

```rust
#[ast(visit)]
#[cfg_attr(feature = "serialize", derive(Serialize))]
pub struct MyNode<'a> {
    #[cfg_attr(feature = "serialize", serde(skip))]
    pub internal_data: u32,
    pub public_field: Atom<'a>,
}
```

### Integration with Semantic Analysis

Link AST nodes with semantic information:

```rust
#[ast(visit)]
pub struct IdentifierReference<'a> {
    pub span: Span,
    pub name: Atom<'a>,
    #[ast(ignore)]
    pub reference_id: Cell<Option<ReferenceId>>,
}
```

This allows tools to access binding information, scope context, and type information during AST traversal.

## Debugging Tips

### Pretty Printing

Use the debug formatter to inspect AST:

```rust
println!("{:#?}", ast_node);
```

### Span Information

Track source locations for error reporting:

```rust
let span = node.span();
println!("Error at {}:{}", span.start, span.end);
```
