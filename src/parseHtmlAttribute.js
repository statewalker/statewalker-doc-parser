import skipSpaces from "./skipSpaces.js";
import parseHtmlAttributeValue from "./parseHtmlAttributeValue.js";
import parseHtmlName from "./parseHtmlName.js";

export default function parseHtmlAttribute(str, i = 0) {
  let name = parseHtmlName(str, i);
  if (!name) return;
  name.type = "HtmlAttributeName";
  const token = {
    type: "HtmlAttribute",
    name,
    start : i,
    end: i,
  }
  let value;
  i = skipSpaces(str, name.end);
  if (str[i] === "=") {
    i = skipSpaces(str, i + 1);
    value = parseHtmlAttributeValue(str, i);
    if (value) {
      i = value.end;
      token.value = value;
    }
  }
  token.end = i;
  return token;
}
