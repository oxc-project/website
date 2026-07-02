import { parseSync } from "oxc-parser";

const result = parseSync("test.js", "foo");
const json = JSON.stringify(result.program, null, 2);
console.log(json);

if (globalThis.window) {
  document.querySelector("#code").innerHTML = json;
}
