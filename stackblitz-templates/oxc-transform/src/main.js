import { transformSync } from "oxc-transform";

const result = transformSync("test.ts", "const foo: any = a ?? b;", {
  target: "es2018",
});

console.log(result);

if (globalThis.window) {
  document.querySelector("#code").innerHTML = JSON.stringify(result, null, 2);
}
