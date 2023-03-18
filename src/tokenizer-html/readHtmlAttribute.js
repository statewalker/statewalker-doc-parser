import skipSpaces from "../tokenizer/skipSpaces.js";
import readAttributeValue from "../tokenizer/readAttributeValue.js";
import readAttributeName from "../tokenizer/readAttributeName.js";

export default function readHtmlAttribute(str, i = 0) {
  let name = readAttributeName(str, i);
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
    const value = readAttributeValue(str, i);
    if (value) {
      value.name = "HtmlAttributeValue";
      token.value = value.value;
      token.valueStart = value.start;
      token.valueEnd = value.end;
      i = value.end;
    }
  }
  token.end = i;
  return token;
}
