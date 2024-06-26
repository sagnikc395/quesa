import * as fs from "fs";
import * as acorn from "acorn";

//read the input source from file system using node
const content = fs.readFileSync("./app.svelte", "utf-8");
const ast = parse(content);
const analysis = analyze(ast);
const jsOutput = generate(ast, analysis);

//write the final js output to app.js file
fs.writeFileSync("./app.js", jsOutput, "utf-8");

const parse = (content) => {
  // define the function from each type for the svelte bnf to convert to ast
  let curr = 0; // pointer to current token.
  const ast = {};

  //entry point
  ast.html = parseFragments();

  const parseFragments = () => {
    // from the recursive defn of svelte bnf
    const fragments = [];
    while (curr < content.length) {
      const fragment = parseFragment();
      if (fragment) {
        fragments.push(fragment);
      }
    }
    return fragments;
  };
  const parseFragment = () => {
    // cascade to the right hand side , if the left is nullish
    // ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing
    return parseScript() ?? parseElement() ?? parseExpression() ?? parseText();
  };

  const parseScript = () => {
    if (match("<script>")) {
      //continue matching till </script> has been found,
      // this is the svelte code to be optimized
      eat("<script>");
      const startIdx = curr;
      // find the next position of </script> , given that we have already reached till curr
      const endIdx = content.indexOf("</script>", curr);
      const code = content.slice(startIdx, endIdx);

      //using acorn to parse js
      ast.script = acorn.parse(code, { ecmaVersion: 2022 });
      // update the current  position
      curr = endIdx;
      eat("</script>");
    }
  };
  const parseElement = () => {};

  //for each type of node
  const parseAttributeList = () => {};
  const parseAttribute = () => {};
  const parseExpression = () => {};
  const parseText = () => {};
  const parseJavaScript = () => {};

  const match = (str) => {
    //slice of the characters and check if it matches
    return content.slice(curr, curr + str.length) === str;
  };

  const eat = (str) => {
    //when parsing the attribute name , it needs to immediately match the curly bracket signs
    // tried to match and advance curr pointer
    if (match(str)) {
      curr += str.length;
    } else {
      throw new Error(`Parse Error: expecting ${str}`);
    }
  };

  const readWhileMatching = (reg) => {
    //read up a whole chunk of content , while we are trying to match the things
    // using a regex pattern to match
    let startIdx = curr;
    while (reg.test(content[curr])) {
      curr++;
    }
    return content.slice(startIdx, curr);
  };

  return ast;
};

const analyze = (ast) => {};

const generate = (ast, analysis) => {};
