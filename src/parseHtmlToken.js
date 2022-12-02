import parseHtmlInstructions from "./parseHtmlInstructions.js";
import parseHtmlTag from "./parseHtmlTag.js";
import parseCode from "./parseCode.js";
import parseHtmlEntity from "./parseHtmlEntity.js";
import parseHtmlSymbols from "./parseHtmlSymbols.js";
import newHtmlRawTagParser from "./newHtmlRawTagParser.js";

export const rawTagsParser = new newHtmlRawTagParser("script", "style");

export default function parseHtmlToken(str, i = 0) {
  return parseCode(str, i) ||
    rawTagsParser(str, i) ||
    parseHtmlInstructions(str, i) ||
    parseHtmlTag(str, i) ||
    parseHtmlEntity(str, i) ||
    parseHtmlSymbols(str, i);
}
