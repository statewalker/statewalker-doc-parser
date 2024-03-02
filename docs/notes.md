# Random Notes

Features:
* Core is completely generic and could be adapted to any syntaxes and their combinations
* Allows to dynamically extend and add new kind of blocks with various syntaxes
* Covers the following use-cases:
  - Parses markdown, HTML and frontmatter headers in one pass
  - Recognizes hierarchical code blocks in tags, attributes, in styles etc
  - Automatically generates documents hierarchies based on headers
  - Allows syntax / formatting in references
  - Allows embedded / hierarchical code blocks

* https://github.com/observablehq/framework/pull/597
* https://github.com/observablehq/framework/pull/843
* https://github.com/observablehq/framework/issues/882 - VS Code Extension


Based on fences. A fence is like a rule for the end of stream defined by the parent tokenizer. So fences depends on the context where they were defined. 
Exactly the same sequence of characters could have some specific meaning in one context but in another one it can have completely different function.

It means that this framewor avoids ahead-of-time tokenization and defines tokens dynamically, depending on their context. 
This feature differentiates TKNZ from other parsing frameworks.
Basically TKNZ is a hierarchy of tokens - one tokens are used to build another ones and rules of their creation are defined in run-time.

There is no separation on tokenizer / lexer / parser modules. 
Tokens of the hier level are generated using lower-level tokens. 
Tokens can be used to represent one character or the whole document.
