import newFencedParser from "./newFencedParser.js";

export const readHtmlCdataBlock = newFencedParser(
  "HtmlCDATA",
  "<![CDATA[",
  "]]>",
);
export const readHtmlCommentBlock = newFencedParser(
  "HtmlComment",
  "<!--",
  "-->",
);
export const readHtmlParseInstructionsBlock = newFencedParser(
  "HtmlInstructions",
  "<!",
  ">",
);
export const readXmlDeclarationsBlock = newFencedParser(
  "XmlDeclarations",
  "<?",
  ">",
);
// export const readXmlInstructionBlock = newFencedParser("HtmlComment", "<!--", "-->");

export default function readHtmlInstructions(str, i = 0) {
  if ((str[i] === "<") && (str[i + 1] === "!")) {
    return readHtmlCdataBlock(str, i) ||
      readHtmlCommentBlock(str, i) ||
      readHtmlParseInstructionsBlock(str, i);
  } else if ((str[i] === "<") && (str[i + 1] === "?")) {
    return readXmlDeclarationsBlock(str, i);
  } else return;
}
