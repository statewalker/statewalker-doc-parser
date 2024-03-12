export default {
  description: "should tokenize a hierarchical fenced blocks",
  input: `
    First paragraph

    :::::::::::::: type=header columns=\"1 2 1\" min-height=500px
    First Line Header
      :::
      Cell 1.1
      :::
      Cell 1.2
      :::
      Cell 1.3
    :::::::::::::: 
    Second Line Header
      :::
      Cell 2.1
      :::
      Cell 2.2
      :::
      Cell 2.3

    Next paragraph
    `
}