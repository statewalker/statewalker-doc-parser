export default {
  description: "should read MD lists and fenced blocks with wrapping tags",
  input: `
    # Header 1

    Paragraph one.

    :::::: columns=\"1 2 2\"
      ::: 
      First column
      ::: 
      Second column
      ::: 
      Third column
    ::::::
      ::: 
      ## Sub-header in  cell one
      Paragraph in cell one.
      :::
      <div>
        ## Sub-header in  cell two
        Paragraph in cell two.
        - item one
        - item two
      </div>
      :::
      ## Sub-header in  cell three
      Paragraph in cell three.

    Paragraph two.
    `
}