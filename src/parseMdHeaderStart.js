import skipSpaces from "./skipSpaces.js";

export default function parseMdHeaderStart(str, i = 0) {
  const start = i;
  i = skipSpaces(str, i, true);
  if (str[i] !== "#") return;
  let n;
  for (n = 0; i + n < str.length; n++) {
    if (str[i + n] !== "#") {
      break;
    }
  }
  if (n === 0) return;
  const prefixStart = i;
  const prefixEnd = i += n;
  const prefix = str.substring(prefixStart, prefixEnd);
  i = skipSpaces(str, i, true);

  return {
    type: "MdHeaderPrefix",
    prefix,
    prefixStart,
    prefixEnd,
    start,
    end: i,
  };
}
