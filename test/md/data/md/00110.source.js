export default {
  description: "should tokenize document sections with lists",
  input: `
    # Header 1
    - item one 
      - sub-item 1
      - sub-item 2
        the rest of sub-item 2
    - item two
    `
}