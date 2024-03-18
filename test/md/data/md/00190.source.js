export default {
  description: "should read MD lists and fenced blocks",
  input: `
    Paragraph one.

    ::: column=1
      - item one
        - a
        - b
      - item two
    ::: column=2
      - item three
      - item four
        - c
        - d

    Paragraph two.
    `
}