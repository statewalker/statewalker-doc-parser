import {
  type TToken,
  type TTokenizerMethod,
  type TokenizerContext,
} from "./tokenizer.ts";
import {
  type TFencedBlockToken,
  newDynamicFencedBlockReader,
  newFencedBlockReader,
} from "./blocks.ts";

export function newCharsReader(type: string, check: (char: string) => boolean) {
  return (ctx: TokenizerContext) => {
    const start = ctx.i;
    const end = ctx.skipWhile(check);
    if (start === end) return;
    return {
      type,
      value: ctx.substring(start, end),
      start,
      end,
    };
  };
}

export function newCharReader(type: string, check: (char: string) => boolean) {
  return (ctx: TokenizerContext) => {
    const char = ctx.getChar();
    if (!check(char)) return;
    const start = ctx.i;
    const end = ++ctx.i;
    return {
      type,
      value: char,
      start,
      end,
    };
  };
}

export function newCharSequenceReader<T extends TToken>(
  type: string,
  textMask: string
): TTokenizerMethod<T> {
  return (ctx: TokenizerContext): T | undefined => {
    const start = ctx.i;
    for (let i = 0; i < textMask.length; i++) {
      if (ctx.getChar(i) !== textMask[i]) return;
    }
    ctx.i += textMask.length;
    const end = ctx.i;
    return {
      type,
      start,
      end,
      value: ctx.substring(start, end),
    } as T;
  };
}

export function newTextFencedBlockReader<T extends TFencedBlockToken>(
  type: string,
  startMask: string,
  endMask: string,
  readToken: TTokenizerMethod
): TTokenizerMethod<T> {
  return newFencedBlockReader(
    type,
    newCharSequenceReader(`Start${type}`, startMask),
    readToken,
    newCharSequenceReader(`End${type}`, endMask)
  );
}

export function newQuotedTextReader(
  newTokensReader: (token: TToken) => TTokenizerMethod | undefined = () =>
    undefined,
  isQuote = (char: string) => char === '"' || char === "'" || char === "`",
  isPairQuote = (char: string, quote: string) => char === quote
): TTokenizerMethod {
  const readQuotedText = newDynamicFencedBlockReader(
    "QuotedText",
    newCharReader("QuoteOpen", isQuote),
    newTokensReader,
    (quote: TToken) =>
      newCharReader("QuoteClose", (char) => isPairQuote(char, quote.value))
  );
  return (ctx: TokenizerContext) => {
    const token = readQuotedText(ctx);
    if (!token) return;
    const t = token as TToken;
    delete t.startToken;
    delete t.endToken;
    return token;
  };
}
