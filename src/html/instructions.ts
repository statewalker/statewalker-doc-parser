import {
  type TFencedBlockToken,
  type TTokenizerMethod,
  newTextFencedBlockReader,
} from "../base/index.ts";

export function newInstructionsBlockReader(
  readToken?: TTokenizerMethod
): TTokenizerMethod {
  const readHtmlCdataBlock = newHtmlCdataBlockReader(readToken);
  const readHtmlCommentBlock = newHtmlCommentBlockReader(readToken);
  const readHtmlInstructionsBlock = newHtmlInstructionsBlockReader(readToken);
  const readXmlDeclarationsBlock = newXmlDeclarationsBlockReader(readToken);
  return (ctx) => {
    if (ctx.getChar(+0) !== "<") return;
    let nextChar = ctx.getChar(+1);
    if (nextChar === "!") {
      nextChar = ctx.getChar(+2);
      if (nextChar === "[") return readHtmlCdataBlock(ctx);
      else if (nextChar === "-") return readHtmlCommentBlock(ctx);
      else return readHtmlInstructionsBlock(ctx);
    } else if (nextChar === "?") {
      return readXmlDeclarationsBlock(ctx);
    } else {
      return;
    }
  };
}

export interface THtmlCdataBlockToken extends TFencedBlockToken {
  type: "HtmlCDATA";
}
export function newHtmlCdataBlockReader(
  readToken?: TTokenizerMethod
): TTokenizerMethod<THtmlCdataBlockToken> {
  return newTextFencedBlockReader("HtmlCDATA", "<![CDATA[", "]]>", readToken);
}

export interface THtmlCommentBlockToken extends TFencedBlockToken {
  type: "HtmlComment";
}
export function newHtmlCommentBlockReader(
  readToken?: TTokenizerMethod
): TTokenizerMethod<THtmlCommentBlockToken> {
  return newTextFencedBlockReader("HtmlComment", "<!--", "-->", readToken);
}

export interface THtmlInstructionsBlockToken extends TFencedBlockToken {
  type: "HtmlInstructions";
}
export function newHtmlInstructionsBlockReader(
  readToken?: TTokenizerMethod
): TTokenizerMethod<THtmlInstructionsBlockToken> {
  return newTextFencedBlockReader("HtmlInstructions", "<!", ">", readToken);
}

export interface TXmlDeclarationsBlockToken extends TFencedBlockToken {
  type: "XmlDeclarations";
}
export function newXmlDeclarationsBlockReader(
  readToken?: TTokenizerMethod
): TTokenizerMethod<TXmlDeclarationsBlockToken> {
  return newTextFencedBlockReader("XmlDeclarations", "<?", ">", readToken);
}
