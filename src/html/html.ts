import {
  type TToken,
  type TTokenizerMethod,
  TokenizerContext,
  newCharsReader,
  newCompositeTokenizer,
  newDynamicFencedBlockReader,
} from "../base/index.ts";
import { readHtmlEntity } from "./entities.ts";
import { newInstructionsBlockReader } from "./instructions.ts";
import { newHtmlCloseTagReader, newHtmlOpenTagReader } from "./tags.ts";

export function newHtmlReader(
  readInnerToken?: TTokenizerMethod
): TTokenizerMethod {
  const tokenizers: TTokenizerMethod[] = [];
  const readToken = newCompositeTokenizer(tokenizers);

  const readOpenTag = newHtmlOpenTagReader(readInnerToken);
  const readCloseTag = newHtmlCloseTagReader();

  function getTagName(token: TToken) {
    const tagName = token.children?.[0].name;
    return tagName;
  }

  const newNamedHtmlCloseTagReader = (name: string) => {
    return (ctx: TokenizerContext) =>
      ctx.guard(() => {
        const token = readCloseTag(ctx);
        if (!token) return;
        if (getTagName(token) !== name) return;
        return token;
      });
  };

  const readHtmlTag = newDynamicFencedBlockReader(
    "HtmlTag",
    readOpenTag,
    () => readToken,
    (openTagToken) => {
      const tagName = getTagName(openTagToken);
      if (openTagToken.autoclosing) {
        return (ctx: TokenizerContext) => {
          const start = ctx.i;
          const end = ctx.i;
          return {
            type: "HtmlCloseTag",
            start,
            end,
            value: "",
          };
        };
      } else {
        return newNamedHtmlCloseTagReader(tagName);
      }
    }
  );
  const readHtmlInstructions = newInstructionsBlockReader(readInnerToken);
  const readHtmlSpecialSymbols = newCharsReader(
    "HtmlSpecialSymbol",
    (ch) => ch === "<" || ch === ">" || ch === "&"
  );
  tokenizers.push(readHtmlTag);
  readInnerToken && tokenizers.push(readInnerToken);
  tokenizers.push(readHtmlInstructions, readHtmlEntity, readHtmlSpecialSymbols);
  return readToken;
}
