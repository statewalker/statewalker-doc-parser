# TKNZ: token-based AST builder for documents
## Parser for HTML and Markdown documents

Small, tolerant and fast MD AST builder.

* Generates clean AST with exact token positions
* Builds document hierarchies
* No dependencies and very small:
  - TypeScript: ~30K non compressed
  - JavaScript: ~20K non compressed
* Tolerant to errors - non closed tags, qoutes or code blocks
* Allows code embedding