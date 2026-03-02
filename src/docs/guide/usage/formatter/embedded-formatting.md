# Embedded Formatting

:::warning
Not fully implemented. See [tracking issue](https://github.com/oxc-project/oxc/issues/15180).
:::

Formats code embedded in JS/TS files (CSS in template literals, GraphQL in template literals, JavaScript/TypeScript/CSS/etc in Markdown).

## Configuration

```json [.oxfmtrc.json]
{
  "embeddedLanguageFormatting": "auto"
}
```

### Values

- `"auto"` — (default) Format embedded sections
- `"off"` — Skip embedded formatting

## Examples

CSS inside a tagged template literal:

```js
const styles = css`
  .container {
    background: blue;
    color: red;
  }
`;
```

GraphQL inside a tagged template literal:

```js
const query = gql`
  query {
    user {
      id
      name
    }
  }
`;

const query2 = graphql(`
  query {
    user {
      id
      name
    }
  }
`);
```

HTML inside a tagged template literal:

```js
const template = html`
  <div class="container">
    <h1>Hello</h1>
    <p>World</p>
  </div>
`;
```

JavaScript code blocks inside a Markdown file:

````md
This is an example Markdown file with JavaScript code blocks:

```js
const x = 1; // This will be formatted if embedded formatting is enabled.
```

Wow!
````

CSS inside a Vue file:

```vue
<style>
/* This CSS will be formatted if embedded formatting is enabled. */
.container {
  background: blue;
  color: red;
}
</style>
```
