- svelte maps closely very mcuh to how closely it maps to actual HTML element, so comparitvely few changes.
- svelte is a compiler based frameworks that does a lot of transformations to convert to a optimized JS for the DOM.
- how to create a compiler based framework in Svelte.
  
- Simple way to understand:
  - Svelte code -> parse -> analyze -> generate a optimized JS 
  - Svelte Compiler -> Parse -> into a AST Syntax Tree.
  - AST -> Analyze -> which state changes , what all things are static 
  - Analyze -> generate optimized DOM code.
  
- Compiler app.svelte -> app.js and use it in index.html 

- 