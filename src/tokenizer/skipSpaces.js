import readSpaces from "./readSpaces.js";
import readEol from "./readEol.js";

export default function skipSpaces(str, i = 0, whitespaceOnly = false) {
  while (i < str.length) {
    let token = readSpaces(str, i);
    if (!token && !whitespaceOnly) token = readEol(str, i);
    if (!token) break;
    i = token.end;
  }
  return i;
}
