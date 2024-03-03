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
import {
  isHtmlCloseTagToken,
  newHtmlCloseTagReader,
  newHtmlOpenTagReader,
} from "./tags.ts";

export type THtmlTokenizers = {
  readOpenTagTokens?: TTokenizerMethod;
  // Read tokens in HTML instractions blocks (e.g. CDATA, HTML Comments, etc )
  readInstructionsTokens?: TTokenizerMethod;
  readTagContentTokens?: TTokenizerMethod;
};

export function newHtmlReader(readers: THtmlTokenizers = {}): TTokenizerMethod {
  const tokenizers: TTokenizerMethod[] = [];
  const readToken = newCompositeTokenizer(tokenizers);

  const readOpenTag = newHtmlOpenTagReader(readers.readOpenTagTokens);
  const readCloseTag = newHtmlCloseTagReader();

  const newNamedHtmlCloseTagReader = (name: string) => {
    return (ctx: TokenizerContext) =>
      ctx.guard(() => {
        const token = readCloseTag(ctx);
        if (!token || !isHtmlCloseTagToken(token)) return;
        if (token.tagName !== name) return;
        return token;
      });
  };

  const readHtmlTag = newDynamicFencedBlockReader(
    "HtmlTag",
    readOpenTag,
    () => readToken,
    (openTagToken) => {
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
        return newNamedHtmlCloseTagReader(openTagToken.tagName);
      }
    }
  );
  const readHtmlInstructions = newInstructionsBlockReader(
    readers.readInstructionsTokens
  );
  const readHtmlSpecialSymbols = newCharsReader(
    "HtmlSpecialSymbol",
    (ch) => ch === "<" || ch === ">" || ch === "&"
  );
  tokenizers.push(readHtmlTag);
  readers.readTagContentTokens && tokenizers.push(readers.readTagContentTokens);
  tokenizers.push(readHtmlInstructions, readHtmlEntity, readHtmlSpecialSymbols);
  return readToken;
}
