export default function readAttributeName(str, i = 0) {
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
          (char === ":" &&
            ((i < str.length - 1) && !/^[\s="'`]/.test(str[i + 1] || ""))))) ||
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
    type: "AttributeName",
    name,
    start,
    end: i,
  };
}
