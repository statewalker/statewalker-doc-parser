export default function readMdBlockSeparatorPrefix(
  str,
  i = 0,
  separators = ["***", "---", "..."],
) {
  let separatorToken;
  for (let separator of separators) {
    let j;
    for (j = 0; j < separator.length; j++) {
      if (str[i + j] !== separator[j]) {
        break;
      }
    }
    if (j === separator.length) {
      separatorToken = {
        type: "MdSeparator",
        char: separator[separator.length - 1],
        start: i,
        end: i + separator.length,
      };
      // Skip all separator charts
      for (
        i = separatorToken.end;
        i < str.length && str[i] === separatorToken.char;
        i++
      ) {
        separatorToken.end++;
      }
      separatorToken.content = str.substring(
        separatorToken.start,
        separatorToken.end,
      );
      break;
    }
  }
  return separatorToken;
}
