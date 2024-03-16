export default {
  description: "should read the '~' symbols as MD code block separators",
  input: `
    before 
    ~~~ts
    First Typescript Block
    ~~~

    ~~~js
    Javascript Block
    ~~~

    ~~~
    Simple Fenced Block
    ~~~
    after
    `
}