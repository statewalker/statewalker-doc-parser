export default {
  description: "should tables with other tokens inside cells",
  input: `
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1.1 
  - item one
  - item two
 | Cell \${

  with

    code

} 1.2 | 
 > Blockoute  |
    `
}