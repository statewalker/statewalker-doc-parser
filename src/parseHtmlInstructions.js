import newFencedParser from "./newFencedParser.js";

export const parseHtmlCdataBlock = newFencedParser(
  "HtmlCDATA",
  "<![CDATA[",
  "]]>",
);
export const parseHtmlCommentBlock = newFencedParser(
  "HtmlComment",
  "<!--",
  "-->",
);
export const parseHtmlParseInstructionsBlock = newFencedParser(
  "HtmlInstructions",
  "<!",
  ">",
);
export const parseXmlDeclarationsBlock = newFencedParser(
  "XmlDeclarations",
  "<?",
  ">",
);
// export const parseXmlInstructionBlock = newFencedParser("HtmlComment", "<!--", "-->");

export default function parseHtmlInstructions(str, i = 0) {
  if ((str[i] === "<") && (str[i + 1] === "!")) {
    return parseHtmlCdataBlock(str, i) ||
      parseHtmlCommentBlock(str, i) ||
      parseHtmlParseInstructionsBlock(str, i);
  } else if ((str[i] === "<") && (str[i + 1] === "?")) {
    return parseXmlDeclarationsBlock(str, i);
  } else return;
}
