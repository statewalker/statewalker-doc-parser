import parseEol from "./parseEol.js";
import parseSpaces from "./parseSpaces.js";
import parseMdBlockProperties from "./parseMdBlockProperties.js";

export default function parseMdBlocksSeparators(
  str,
  i = 0,
  separators = ["***", "---", "..."],
) {
  let separatorToken,
    start = i;
  for (let separator of separators) {
    let j;
    for (j = 0; j < separator.length; j++) {
      if (str[i + j] !== separator[j]) break;
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
  if (!separatorToken) return;
  const spaces = parseSpaces(str, i);
  if (spaces) i = spaces.end;
  if (i < str.length) {
    const eol = parseEol(str, i);
    // It is not the end of the file and there is no EOL symbols. So it is not a block separator.
    if (!eol) return ;
    i = eol.end;
  }

  const token = {
    type : "MdBlockSeparator",
    separator : str.substring(separatorToken.start, separatorToken.end),
    separatorChar : separatorToken.char,
    separatorStart : separatorToken.start,
    separatorEnd : separatorToken.end,
    start,
    end : i
  }
  const properties = parseMdBlockProperties(str, i);
  if (properties) {
    token.properties = properties;
    token.end = properties.end;
  }
  return token;

  // const meta = {
  //   type: "MetaData",
  //   content: "",
  //   start: i,
  //   end: i,
  // };
  // const result = {
  //   type: "BlockSeparator",
  //   start,
  //   end: start,
  //   separator: separatorToken,
  //   meta,
  // };
  // // Skip all spaces (excludind ends of files)
  // let token = parseSpaces(str, i);
  // if (token) i = token.end;

  // // Skip all EOL blocks
  // token = parseEol(str, i);
  // let n = 0;
  // if (token) {
  //   i = token.end;
  //   n = token.end - token.start;
  // }
  // meta.start = meta.end = i;

  // // If there is no EOL symbols found and it is not the end of the string
  // // So exit without results
  // if (n === 0 && i < str.length) return;

  // // If there is just one EOL symbol - then exit
  // while (n === 1 && i < str.length) {
  //   if (str[i] === "\r" || str[i] === "\n") {
  //     n = skipEol();
  //     if (n > 1) break;
  //   } else {
  //     i++;
  //   }
  // }
  // meta.end = i;
  // meta.content = str.substring(meta.start, meta.end);
  // result.end = i;
  // result.content = str.substring(result.start, result.end);
  // return result;

  // function skipEol() {
  //   // Carriage Return	U+000D	13	\r
  //   // New Line, Line Feed or End-of-Line	U+000A	10	\n
  //   let count = 0;
  //   for (; i < str.length; i++) {
  //     if (str[i] === "\r") i++;
  //     if (str[i] === "\n") count++;
  //     else break;
  //   }
  //   return count;
  // }
}
