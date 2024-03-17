export default {
  description: "should tokenize simple tables",
  input: `
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1.1 | Cell \${

  with

    code

} 1.2 | Cell 1.2 |
| Cell 2.1 | Cell 2.2 | Cell 2.2 |
    `
}