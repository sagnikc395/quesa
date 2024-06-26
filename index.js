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
  ast.html = parseFragments(() => curr < content.length);

  const parseFragments = (condn) => {
    // from the recursive defn of svelte bnf
    const fragments = [];
    while (condn()) {
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

  const parseElement = () => {
    // from bnf definition
    if (match("<")) {
      eat("<");
      //regex on the tagname type
      const tagName = readWhileMatching(/[a-z]/);
      const attribute = parseAttributeList(); // check from a prior list of attributes possible
      eat(">");

      const endTag = `</${tagName}>`;

      const element = {
        //a DOM node
        //ref: https://developer.mozilla.org/en-US/docs/Web/API/Element
        type: "Element",
        name: tagName,
        attribute,
        //here can pass a different condition
        children: parseFragments(() => match(endTag)),
      };
      eat(endTag);
      return element;
    }
  };

  //for each type of node
  const parseAttributeList = () => {
    //some whitespace and parse attirutes
    const attributes = [];
    skipWhiteSpace();

    while (!match(">")) {
      attributes.push(parseAttribute());
      skipWhiteSpace();
    }
    return attributes;
  };
  const parseAttribute = () => {
    //read while it matches and get the js from in between
    const name = readWhileMatching(/[^=]/);
    eat("={");
    const value = parseJavaScript();
    eat("}");
    return {
      type: "Attribute",
      name,
      value,
    };
  };
  const parseExpression = () => {
    //match the js in the svelte inside {}
    if (match("{")) {
      eat("{");
      const expression = parseJavaScript();
      eat("}");
      return {
        type: "Expression",
        expression,
        value,
      };
    }
  };
  const parseText = () => {
    // text -> is anything else, not a <></> or {}
    const text = readWhileMatching(/[^<{]/);
    if (text.trim() !== "") {
      //if nonwhitespace we return
      return {
        type: "Text",
        value: text,
      };
    }
  };
  const parseJavaScript = () => {
    //parse the javascript using acorn
    const jsRes = acorn.parseExpression(content, curr, { ecmaVersion: 2022 });
    curr = jsRes.end;
    return jsRes;
  };

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

  const skipWhiteSpace = () => {
    //like readWhileMathcing until we hit the whitespaces
    readWhileMatching(/[\s\n]/);
  };

  return ast;
};

const analyze = (ast) => {};

const generate = (ast, analysis) => {};
