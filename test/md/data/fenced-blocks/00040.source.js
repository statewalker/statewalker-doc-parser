export default {
  description: "should tokenize a hierarchical fenced blocks",
  input: `
    First paragraph

    :::
    First block
    :::
    Second block\",
    :::
    Third block\",

    Next paragraph
    `
}