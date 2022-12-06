export default function readEol(str, i = 0) {
  // Carriage Return	U+000D	13	\r
  // New Line, Line Feed or End-of-Line	U+000A	10	\n
  let count = 0;
  const start = i;
  for (; i < str.length; i++) {
    if (str[i] === "\r") continue;
    if (str[i] === "\n") {
      count++;
      continue;
    } else break;
  }
  return count > 0
    ? {
      type: "Eol",
      count,
      start,
      end: i,
    }
    : undefined;
}
