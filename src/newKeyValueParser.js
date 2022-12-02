import skipSpaces from "./skipSpaces.js";
import parseHtmlAttributeValue from "./parseHtmlAttributeValue.js";
import parseHtmlName from "./parseHtmlName.js";

export default function newKeyValueParser({
  separator = "=",
  pairType = "HtmlAttribute",
  nameType = "HtmlAttributeName",
  valueType = "HtmlAttributeValue",
} = {}) {
  return (str, i = 0) => {
    let name = parseHtmlName(str, i);
    if (!name) {
      return;
    }
    name.type = nameType;
    const token = {
      type: pairType,
      name,
      start: i,
      end: i,
    };
    let value;
    i = skipSpaces(str, name.end);
    if (str[i] === separator) {
      i = skipSpaces(str, i + 1);
      value = parseHtmlAttributeValue(str, i);
      if (value) {
        value.type = valueType;
        i = value.end;
        token.value = value;
      }
    }
    token.end = i;
    return token;
  };
}
