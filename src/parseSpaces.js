export default function parseSpaces(str, i = 0) {
  // Space	U+0020	32
  // Form Feed	U+000C	12	\f
  // Vertical Tab	U+000B	11	\v
  // Horizontal Tab	U+0009	9	\t
  let count;
  const start = i;
  for (
    count = 0;
    i < str.length &&
    (str[i] === " " || str[i] === "\f" || str[i] === "\v" || str[i] === "\t");
    i++, count++
  ) {
    /* */
  }
  return count > 0
    ? {
      type: "Space",
      start,
      end: i,
    }
    : undefined;
}
