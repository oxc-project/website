# Embedded Formatting

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
    color: ${theme.color};
  }
`;
```

Styled-components:

```js
const Button = styled.button`
  background: ${(props) => props.primary};
  color: white;
`;
```

Styled JSX:

```jsx
<style jsx>{`
  .container {
    background: blue;
    color: red;
  }
`}</style>
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
  ${fragments.all}
`);
```

HTML inside a tagged template literal:

```js
const template = html`
  <div class="container">
    <h1>Hello</h1>
    <p>${world}</p>
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

JavaScript and CSS inside a Vue file:

```vue
<script setup>
import { ref } from "vue";
import MyComponent from "./MyComponent.vue";
</script>

<style>
.container {
  background: blue;
  color: red;
}
</style>
```
