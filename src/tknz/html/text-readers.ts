import { newDynamicFencedBlockReader } from "../blocks-readers.ts";
import { TToken, TTokenizerMethod, TokenizerContext } from "../tokenizer.ts";
import { newCharReader } from "../chars-readers.ts";

export function newQuotedTextReader(
  newTokensReader: (token: TToken) => TTokenizerMethod | undefined = () =>
    undefined
): TTokenizerMethod {
  const readQuotedText = newDynamicFencedBlockReader(
    "QuotedText",
    newCharReader(
      "QuoteOpen",
      (char) => char === '"' || char === "'" || char === "`"
    ),
    newTokensReader,
    (quote: TToken) =>
      newCharReader("QuoteClose", (char) => char === quote.value)
  );
  return (ctx: TokenizerContext) => {
    const token = readQuotedText(ctx);
    if (!token) return;
    const { type, value, start, end, children } = token;
    return { type, value, start, end, children };
  };
}
