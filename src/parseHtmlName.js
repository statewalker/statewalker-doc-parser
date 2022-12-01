export default function parseHtmlName(str, i = 0) {
  // ([A-Za-z_\{\}$][-A-Za-z0-9_:\.\{\}$]*?)
  const start = i;
  let escaped = false;
  let name = "";
  const re = /^\p{L}/u;
  for (; i < str.length; i++) {
    const char = str[i];
    if (escaped) {
      name += char;
    } else if (char === "\\") {
      escaped = true;
      continue;
    } else if (
      (char >= "A" && char <= "A") ||
      (char >= "a" && char <= "z") ||
      (i > start &&
        ((char >= "0" && char <= "9") ||
          char === "-" ||
          char === "." ||
          char === ":")) ||
      
      char === "_" ||
      char === "{" ||
      char === "}" ||
      (char === "$" && str[i + 1] !== "{") ||
      re.test(char)
    ) {
      name += char;
    } else {
      break;
    }
  }
  if (i === start) return;
  return {
    type: "HtmlName",
    name,
    start,
    end: i,
  };
}
