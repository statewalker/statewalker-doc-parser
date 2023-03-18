import skipSpaces from "../tokenizer/skipSpaces.js";
import readCode from "../tokenizer/readCode.js";
import readAttributeName from "../tokenizer/readAttributeName.js";
import readHtmlAttribute from "./readHtmlAttribute.js";

export default function readHtmlTag(str, i = 0) {
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

  const name = readAttributeName(str, i);
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
        const attr = readCode(str, i) || readHtmlAttribute(str, i);
        if (!attr) break;
        token.attributes.push(attr);
        i = attr.end - 1; // Index will be increased at the next iteration
      }
    }
  }
  token.end = i;

  return token;
}
