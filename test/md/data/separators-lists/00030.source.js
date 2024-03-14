export default {
  description: "should tokeniz lists, fenced and text blocks",
  input: `

  # Title

  Paragrah starts...
\${

  code 

  block

}
  ...and continues.

  - item 1
    - A
    - B
  - item 2


  ## Sub-section \${One}

  ::::
    This is a note
    \${with  code}
  ::::
    The second fenced block

  ## Sub-section \${Two}
  Second paragraph
`
}