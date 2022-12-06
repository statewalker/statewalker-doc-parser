import skipSpaces from "./skipSpaces.js";
import readHtmlAttributeValue from "./readHtmlAttributeValue.js";
import readHtmlName from "./readHtmlName.js";

export default function readHtmlAttribute(str, i = 0) {
  let name = readHtmlName(str, i);
  if (!name) {
    return;
  }
  name.type = "HtmlAttributeName";
  const token = {
    type: "HtmlAttribute",
    name: name.name,
    nameStart: name.start,
    nameEnd: name.end,
    start: i,
    end: i,
  };
  i = skipSpaces(str, name.end);
  if (str[i] === "=") {
    i = skipSpaces(str, i + 1);
    const value = readHtmlAttributeValue(str, i);
    if (value) {
      token.value = value.value;
      token.valueStart = value.start;
      token.valueEnd = value.end;
      i = value.end;
    }
  }
  token.end = i;
  return token;
}
