import parseHtmlInstructions from "./parseHtmlInstructions.js";
import parseHtmlTag from "./parseHtmlTag.js";
import parseCode from "./parseCode.js";
import parseHtmlEntity from "./parseHtmlEntity.js";
import parseHtmlSymbols from "./parseHtmlSymbols.js";
import newHtmlRawTagParser from "./newHtmlRawTagParser.js";

const rawTagsParser = new newHtmlRawTagParser("script", "style");

export function parseHtmlToken(str, i = 0) {
  return parseCode(str, i) ||
    rawTagsParser(str, i) ||
    parseHtmlInstructions(str, i) ||
    parseHtmlTag(str, i) ||
    parseHtmlEntity(str, i) ||
    parseHtmlSymbols(str, i);
}

export default function parseHtmlTokens(str, i = 0) {
  const token = {
    type: "Html",
    content: [],
    start: i,
    end: i,
  };
  let textStart = i;
  const flushTextContent = () => {
    let t;
    if (i > textStart) {
      t = {
        type: "Text",
        text: str.substring(textStart, i),
        start: textStart,
        end: i,
      };
    }
    token.end = i;
    textStart = i;
    return t;
  };
  for (; i < str.length; i++) {
    const t = parseHtmlToken(str, i);
    if (t) {
      const textToken = flushTextContent();
      if (textToken) token.content.push(textToken);

      token.content.push(t);
      token.end = textStart = i = t.end;
      i--;
    }
  }
  const textToken = flushTextContent();
  if (textToken) token.content.push(textToken);
  return token;
}
