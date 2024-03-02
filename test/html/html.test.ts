import {
  TToken,
  TTokenizerMethod,
  TokenizerContext,
  isEol,
  newCharsReader,
  newCompositeTokenizer,
  newDynamicFencedBlockReader,
} from "../../src/base/index.ts";
import { newCodeReader } from "../../src/code/index.ts";
import {
  newHtmlCloseTagReader,
  newHtmlOpenTagReader,
  readHtmlEntity,
} from "../../src/html/index.ts";
import { describe, it } from "../deps.ts";
import { newBlockTest } from "./newBlockTest.ts";
import { testData } from "./html.data.ts";
import { newInstructionsBlockReader } from "../../src/html/instructions.ts";

function newHtmlReader(readCode: TTokenizerMethod): TTokenizerMethod {
  const tokenizers: TTokenizerMethod[] = [];
  const readToken = newCompositeTokenizer(tokenizers);

  const readOpenTag = newHtmlOpenTagReader(readCode);
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
  const readHtmlInstructions = newInstructionsBlockReader(readCode);
  const readHtmlSpecialSymbols = newCharsReader(
    "HtmlSpecialSymbol",
    (ch) => ch === "<" || ch === ">" || ch === "&"
  );
  tokenizers.push(
    readHtmlTag,
    readCode,
    readHtmlInstructions,
    readHtmlEntity,
    readHtmlSpecialSymbols
  );
  return readToken;
}

describe("newHtmlReader", () => {
  const readCode = newCodeReader();
  const test = newBlockTest(newHtmlReader(readCode));
  testData.forEach((data) => {
    it(data.description, () => {
      test(data.input, data.expected);
    });
  });
});
