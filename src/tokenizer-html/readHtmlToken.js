import readHtmlInstructions from "./readHtmlInstructions.js";
import readHtmlTag from "./readHtmlTag.js";
import readCode from "../tokenizer/readCode.js";
import readHtmlEntity from "./readHtmlEntity.js";
import readHtmlSymbols from "./readHtmlSymbols.js";
import newHtmlRawTagParser from "./newHtmlRawTagParser.js";

export const rawTagsParser = new newHtmlRawTagParser("script", "style");

export default function readHtmlToken(str, i = 0) {
  return readCode(str, i) ||
    rawTagsParser(str, i) ||
    readHtmlInstructions(str, i) ||
    readHtmlTag(str, i) ||
    readHtmlEntity(str, i) ||
    readHtmlSymbols(str, i);
}
