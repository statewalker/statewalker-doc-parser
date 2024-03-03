# Random Notes

Features:

- Core is completely generic and could be adapted to any syntaxes and their combinations
- Allows to dynamically extend and add new kind of blocks with various syntaxes
- Covers the following use-cases:
  - Parses markdown, HTML and frontmatter headers in one pass
  - Recognizes hierarchical code blocks in tags, attributes, in styles etc
  - Automatically generates documents hierarchies based on headers
  - Allows syntax / formatting in references
  - Allows embedded / hierarchical code blocks

## Fenced Parsing

TKNZ can be defined as a context-dependent parser. It don't have separation on tokenizers/lexers/parsers modules. TKNZ uses tokens for everything - from individual characters to the whole document are represented as tokens. Tokens of lower level are used to produce high-level tokens. For example header tokens are used to produce document sections, which are also tokens.

TKNZ reads the character sequence from the beginning to the end and all characters are included in the resulting top-level token. If provided tokenizers methods recognizes some special sequence of charachters then they are added as sub-tokens to the parent.

Tokenizers used to recognize patterns in the text are simple stateless composable functions - you can combine them to produce desired results.

For example it is up to you to include inline syntax detection in the markdown parser or not - it is just the question of combining additional block and inline tokenizers together.

Each toknizer can decide how it read the character sequence. In the simplest case a tokenizer can read everything from the beginning to the end and produce just one token covering the whole document. It is not a very interesting case. In this case the document analysis is stopped by natural document limit - by the end. But to detect ineresting patterns tokenizers need to take into account not only the end of stream but also some rules defined by parent tokenizers. To do so each tokenizer can set a "fence" - a rule defining a logical end of the current tokenizer context. These fences are the main way to delimit tokenizers contexts.

In the example below the HTML block contains 3 elements: "h1", "script" and "p". The script contains a non-closed quoted variable. To properly interpret this sequence the script tag tokenizer defines a fence - it says that the `</script>` pattern should be interpreted by child tokenizers as a fence - as a local "end-of-stream" marker.

```html
<h1>Title</h1>
<script>
  const message = "Hello
</script>
<p>Paragraph</p>
```

## Attributes

### Code Blocks in Attributes

Code blocks can be used to in tags:

- `<div ${code_block} ...>...</div>` - this pattern allows to include arbiterary code to define tag attributes. Note that this code section is "isolated" - it will not be interrupted by angle brackets or anything.
- `<div attr="${code_block}">...</div>` - in quited attribute values
- `<div attr=${code_block}>...</div>` - directly as the value of an attribute

The two last cases are different in how thy handle broken/non-closed code sequences:

- `<div attr="${code_block">...</div>` - code is in the quoted attribute value: non-closed code blocks are limited by quotes and other tags. The code block contains this sequence `${code_block`: it is limited by the attribute closing quote.
- `<div attr=${code_block>...</div>`: code appears directly as the attribute value. In this case the code block will continue until the closing curly braket "}" or till the end of the character stream. The code content in this case: `${code_block>...</div>`

## Related Issues

- https://github.com/observablehq/framework/pull/597
- https://github.com/observablehq/framework/pull/843
- https://github.com/observablehq/framework/issues/882 - VS Code Extension

Based on fences. A fence is like a rule for the end of stream defined by the parent tokenizer. So fences depends on the context where they were defined.
Exactly the same sequence of characters could have some specific meaning in one context but in another one it can have completely different function.

It means that this framewor avoids ahead-of-time tokenization and defines tokens dynamically, depending on their context.
This feature differentiates TKNZ from other parsing frameworks.
Basically TKNZ is a hierarchy of tokens - one tokens are used to build another ones and rules of their creation are defined in run-time.

There is no separation on tokenizer / lexer / parser modules.
Tokens of the hier level are generated using lower-level tokens.
Tokens can be used to represent one character or the whole document.
