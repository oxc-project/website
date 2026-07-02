import { ResolverFactory } from "oxc-resolver";

const resolver = new ResolverFactory({});
const directory = process.cwd();
const specifier = "./package.json";
const resolution = resolver.sync(directory, specifier);

console.log("directory", directory);
console.log("specifier", specifier);
console.log("resolution", resolution);
