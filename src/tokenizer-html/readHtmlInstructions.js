import newFencedReader from "../tokenizer/newFencedReader.js";

export const readHtmlCdataBlock = newFencedReader(
  "HtmlCDATA",
  "<![CDATA[",
  "]]>",
);
export const readHtmlCommentBlock = newFencedReader(
  "HtmlComment",
  "<!--",
  "-->",
);
export const readHtmlParseInstructionsBlock = newFencedReader(
  "HtmlInstructions",
  "<!",
  ">",
);
export const readXmlDeclarationsBlock = newFencedReader(
  "XmlDeclarations",
  "<?",
  ">",
);
// export const readXmlInstructionBlock = newFencedReader("HtmlComment", "<!--", "-->");

export default function readHtmlInstructions(str, i = 0) {
  if ((str[i] === "<") && (str[i + 1] === "!")) {
    return readHtmlCdataBlock(str, i) ||
      readHtmlCommentBlock(str, i) ||
      readHtmlParseInstructionsBlock(str, i);
  } else if ((str[i] === "<") && (str[i + 1] === "?")) {
    return readXmlDeclarationsBlock(str, i);
  } else return;
}
