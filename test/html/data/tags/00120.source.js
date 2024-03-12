export default {
  description: "should tolerate broken block code in tag attributes",
  input: "<tag attr='x${ code block' attr2=val2 />"
}