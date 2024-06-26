- svelte maps closely very mcuh to how closely it maps to actual HTML element, so comparitvely few changes.
- svelte is a compiler based frameworks that does a lot of transformations to convert to a optimized JS for the DOM.
- how to create a compiler based framework in Svelte.
  
- Simple way to understand:
  - Svelte code -> parse -> analyze -> generate a optimized JS 
  - Svelte Compiler -> Parse -> into a AST Syntax Tree.
  - AST -> Analyze -> which state changes , what all things are static 
  - Analyze -> generate optimized DOM code.
  
- Compiler app.svelte -> app.js and use it in index.html 

- How does the optimized JS looks like ?
  - Eg: creating lifetime methods for creating and destroying can we wrapped up with as :
```svelte
<script>
let counter = 0;
const increment = () => counter++;
const decrement = () => counter--;
</script>


<button on:click={decrement}>Decrement</button>
<div>{counter}</div>
<button on:click={increment}>Increment</button>
```

can be transformed to something as following in the DOM 
with an Object Lifecycle,defined on it 

```js 

function App() {
let button;
const lifecycle = {
//create 
  create(target){
      let button = document.createElement("button");
      button.addEventListener('click',decrement);
      target.appendChild(button);
  },
//destroy 
  destroy(){
      button.removeEventListener('click',decrement);
      target.removeChild(button);
  }
}
return lifecycle;
};

App().create(document.body);
```

- we can keep on adding items via the create and destroy method for each item in the svelte code.
- similarly we would also need a update method to update the text varibale present inside of it.
- how do we know that the varible is dynamic ?
  - that's why we need to analyze the code.
  - the way we analyze the code , it seems straightforward visually, but how do we analyze it.
  - as at the end of the day these are just strings.
  - parse need it to AST -> DOM Tree.
  
- how to parse tree into AST ?
  - describe how our code will look like.
  - know a syntax notation:
    - how our code will look like.
  - Various forms:
    - Syntax Notation
    - or Backus Naur Form.
  - A BNF for JS:
```bnf
<object> ::= "{}" | "{" <property-list> "}"
<property-list> ::= <property> | <property-list> "," <property>
<property> ::= <string> ":" <value>
```

- Similarly Svelte BNF :
```bnf
<fragments> ::= <fragment> | <fragments> <fragment>
<fragment> ::= <script> | <element> | <expression> | <text>
<script> ::= "<script>" <javascript> "</script>"
<element> ::= "<" <tag-name> <attribute-list> ">" <fragments> "</" <tag-name> ">"
<attribute> ::= <attribute-name> "={" <javascript> "}"
<expression> ::= "{" <javascript> "}"
```

- i  is a pointer, that points to the current string we are looking at. To know what we are parsing for.

