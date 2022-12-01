import parseSpaces from "./parseSpaces.js";
import parseEol from "./parseEol.js";

export default function skipSpaces(str, i = 0) {
  while (i < str.length) {
    const token = parseSpaces(str, i) || parseEol(str, i);
    if (!token) break;
    i = token.end;
  }
  return i;
}
