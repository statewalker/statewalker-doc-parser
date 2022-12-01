export default function parseCode(str, i = 0) {
  const res = parse(str, i);
  return res;

  function parse(str, i = 0) {
    const start = i;
    let code = "";
    let depth = 0;
    if (str[i++] !== "$" || str[i++] !== "{") return;
    code += "";
    let escaped = false;
    let quot = null;
    for (const len = str.length; i < len; i++) {
      const ch = str[i];
      if (escaped) {
        escaped = false;
        code += ch;
      } else if (ch === "\\") {
        escaped = true;
      } else if (quot) {
        if (ch === quot) {
          quot = "";
          code += ch;
        } else if (quot === "`" && ch === "$") {
          const r = parse(str, i);
          if (r) {
            code += r.content;
            i = r.end;
            i--;
          } else {
            code += ch;
          }
        } else {
          code += ch;
        }
      } else if (ch === '"' || ch === "'" || ch === "`") {
        quot = ch;
        code += ch;
      } else if (ch === "{") {
        depth++;
        code += ch;
      } else if (ch === "}") {
        if (depth === 0) {
          i++;
          break;
        } else {
          depth--;
          code += ch;
        }
      } else {
        code += ch;
      }
    }
    return {
      type: "Code",
      code: [code],
      start,
      end: i
    };
  }
}