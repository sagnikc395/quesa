import * as fs from "fs";

//read the input source from file system using node
const content = fs.readFileSync("./app.svelte", "utf-8");
const ast = parse(content);
const analysis = analyze(ast);
const jsOutput = generate(ast, analysis);

//write the final js output to app.js file
fs.writeFileSync("./app.js", jsOutput, "utf-8");

const parse = (content) => {};

const analyze = (ast) => {};

const generate = (ast, analysis) => {};
