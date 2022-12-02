import parseEol from "./parseEol.js";
import parseHtmlAttributeValue from "./parseHtmlAttributeValue.js";
import parseHtmlName from "./parseHtmlName.js";
import parseSpaces from "./parseSpaces.js";
import skipSpaces from "./skipSpaces.js";

function parseMdBlockPropertyName(str, i) {
  const start = i;
  i = skipSpaces(str, i, true);
  const name = parseHtmlName(str, i);
  if (!name) return;
  i = name.end;
  i = skipSpaces(str, i, true);

  if (str[i] !== ":") return;
  i++;
  i = skipSpaces(str, i, true);

  return {
    type: "MdBlockPropertyName",
    name: name.name,
    nameStart: name.start,
    nameEnd: name.end,
    start,
    end: i,
  };
}

export default function parseMdBlockProperty(str, i) {
  const token = parseMdBlockPropertyName(str, i);
  if (!token) return;
  token.type = "MdBlockProperty";
  i = token.end;

  const value = token.value = [];
  token.valueStart = i;

  let textStart = i;
  const flushText = () => {
    if (i > textStart) {
      value.push(str.substring(textStart, i));
      textStart = i;
    }
  };
  while (i < str.length) {
    let spaces = parseSpaces(str, i);
    if (spaces) {
      i = spaces.end;
    }
    let eol = parseEol(str, i);
    if (eol) {
      i = eol.end;
      if (eol.count > 1) {
        // Stop if there is more than one EOL
        break;
      }

      // Stop if the next line starts with a new property name
      const nextName = parseMdBlockPropertyName(str, i);
      if (nextName) break;

      // Append whitespaces after the EOL
      spaces = parseSpaces(str, i);
      if (spaces) i = spaces.end;
    }
    const t = parseHtmlAttributeValue(str, i, []);
    if (!t) break;
    flushText();
    value.push(...t.value);
    i = textStart = t.end;
  }
  flushText();
  token.valueEnd = i;
  token.end = i;
  return token;
}
