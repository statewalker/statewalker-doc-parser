import skipSpaces from "./skipSpaces.js";
import parseHtmlName from "./parseHtmlName.js";
import parseHtmlAttribute from "./parseHtmlAttribute.js";
import parseCode from "./parseCode.js";

export default function parseHtmlTag(str, i = 0) {
  if (str[i] !== "<") return;

  const token = {
    type: "HtmlTag",
    closing: false,
    opening: true,
    name : null,
    nameStart : i,
    nameEnd : i,
    attributes: [],
    start: i,
    end: i,
  };
  i++;
  if (str[i] === "/") {
    token.opening = false;
    token.closing = true;
    i++;
  }

  const name = parseHtmlName(str, i);
  if (!name) return;
  token.name = name.name;
  token.nameStart = name.start;
  token.nameEnd = name.end;
  i = name.end;

  if (token.closing) {
    i = skipSpaces(str, i);
    if (str[i] === ">") {
      i++;
    } else {
      return;
    }
  } else {
    for (; i < str.length; i++) {
      i = skipSpaces(str, i);
      if (str[i] === "/" && str[i + 1] === ">") {
        token.closing = true;
        i += 2;
        break;
      } else if (str[i] === ">") {
        i++;
        break;
      } else {
        const attr = parseCode(str, i) || parseHtmlAttribute(str, i);
        if (!attr) break;
        token.attributes.push(attr);
        i = attr.end - 1; // Index will be increased at the next iteration
      }
    }
  }
  token.end = i;

  return token;
}
