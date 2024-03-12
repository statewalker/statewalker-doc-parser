export default {
  description: "should read tags containing attributes with angle brackets and non-closed code blocks",
  input: "before <a attr='a <b c=`x` d=\"${code block\"></b>' attr3='\" quoted \"' > after"
}