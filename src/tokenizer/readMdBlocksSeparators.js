import readEol from "./readEol.js";
import readSpaces from "./readSpaces.js";
import readMdBlockProperties from "./readMdBlockProperties.js";
import readMdBlockSeparatorPrefix from "./readMdBlockSeparatorPrefix.js";

export default function readMdBlocksSeparators(
  str,
  i = 0,
  readSeparatorPrefix = readMdBlockSeparatorPrefix,
) {
  const separatorToken = readSeparatorPrefix(str, i);
  if (!separatorToken) return;
  const start = i;
  i = separatorToken.end;
  const spaces = readSpaces(str, i);
  if (spaces) i = spaces.end;
  if (i < str.length) {
    const eol = readEol(str, i);
    // It is not the end of the file and there is no EOL symbols. So it is not a block separator.
    if (!eol) return;
    i = eol.end;
  }

  const token = {
    type: "MdBlockSeparator",
    separator: str.substring(separatorToken.start, separatorToken.end),
    separatorChar: separatorToken.char,
    separatorStart: separatorToken.start,
    separatorEnd: separatorToken.end,
    start,
    end: i,
  };
  const properties = readMdBlockProperties(str, i);
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
  // let token = readSpaces(str, i);
  // if (token) i = token.end;

  // // Skip all EOL blocks
  // token = readEol(str, i);
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
