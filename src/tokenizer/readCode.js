export default function readCode(str, i = 0) {
  const res = read(str, i);
  return res;

  function read(str, i = 0) {
    const start = i;
    let depth = 0;
    if (str[i++] !== "$" || str[i++] !== "{") return;
    const codeStart = i;
    let codeEnd = i;
    const code = [];
    let escaped = false;
    let quot = null;
    let textStart = i;
    const flushText = () => {
      if (i > textStart) {
        code.push(str.substring(textStart, i));
        textStart = i;
      }
    }
    for (const len = str.length; i < len; i++, codeEnd++) {
      const ch = str[i];
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (quot) {
        if (ch === quot) {
          quot = "";
        } else if (quot === "`" && ch === "$") {
          const r = read(str, i);
          if (r) {
            flushText();
            code.push(r);
            i = r.end;
            i--;
            codeEnd = i;
          }
        }
      } else if (ch === '"' || ch === "'" || ch === "`") {
        quot = ch;
      } else if (ch === "{") {
        depth++;
      } else if (ch === "}") {
        if (depth === 0) {
          flushText();
          codeEnd = i;
          i++;
          textStart = i;
          break;
        } else {
          depth--;
        }
      }
    }
    flushText();
    return {
      type: "Code",
      codeStart,
      codeEnd,
      code,
      start,
      end: i
    };
  }
}