import { minifySync } from "oxc-minify";

const result = minifySync("test.js", "const foo = a ?? b;");

console.log(result);

if (globalThis.window) {
  document.querySelector("#code").innerHTML = JSON.stringify(result, null, 2);
}
