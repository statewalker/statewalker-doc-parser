export default {
  description: "should tokeniz lists, fenced and text blocks",
  input: `
  Introduction
  paragraph

  # Title

  First paragraph
  - item 1
  - item 2

  Second
  paragraph


  ## Sub-section One

  ::::
    This is a note
    - inner item one
    - inner item two
  ::::
    The second fenced block

  - separate list item one
  - separate list item two


  ## Sub-section Two
  Second paragraph
  - item 3
  - item 4
`
}