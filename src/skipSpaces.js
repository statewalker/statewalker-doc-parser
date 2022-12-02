import parseSpaces from "./parseSpaces.js";
import parseEol from "./parseEol.js";

export default function skipSpaces(str, i = 0, whitespaceOnly = false) {
  while (i < str.length) {
    let token = parseSpaces(str, i);
    if (!token && !whitespaceOnly) token = parseEol(str, i);
    if (!token) break;
    i = token.end;
  }
  return i;
}
