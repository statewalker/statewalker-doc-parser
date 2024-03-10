import { newFencedBlockReader } from "./blocks.ts";
import { isEol } from "./chars.ts";
import {
  type TToken,
  type TTokenizerMethod,
  type TokenizerContext,
} from "./tokenizer.ts";

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

export function newTextFencedBlockReader<T extends TToken>(
  type: string,
  startMask: string,
  endMask: string,
  readToken?: TTokenizerMethod
): TTokenizerMethod<T> {
  return newFencedBlockReader(
    type,
    newCharSequenceReader(`${type}Start`, startMask),
    readToken,
    newCharSequenceReader(`${type}End`, endMask)
  );
}

export function newQuotedTextReader(
  newTokensReader: (quote: string) => TTokenizerMethod | undefined = () =>
    undefined,
  {
    isQuote = (char: string) => char === '"' || char === "'" || char === "`",
    isPairQuote = (char: string, quote: string) => char === quote,
    isSkipped = (char: string) => char === "<" || char === ">",
    isEscapeSymbol = (char: string) => char === "\\",
  }: {
    isQuote?: (char: string) => boolean;
    isPairQuote?: (char: string, quote: string) => boolean;
    isSkipped?: (char: string) => boolean;
    isEscapeSymbol?: (char: string) => boolean;
  } = {}
): TTokenizerMethod {
  return (ctx: TokenizerContext) => {
    const quote = ctx.getChar();
    if (!isQuote(quote)) return;
    return ctx.guard((fences) => {
      fences.addFence(
        newCharReader("QuoteClose", (char) => isPairQuote(char, quote))
      );
      const readToken = newTokensReader(quote);
      const start = ctx.i;
      ctx.i++;
      let escaped = false;
      let children: TToken[] | undefined;
      while (ctx.i < ctx.length) {
        const ch = ctx.getChar();
        if (escaped) {
          escaped = false;
        } else if (isEscapeSymbol(ch)) {
          escaped = true;
        } else if (isPairQuote(ch, quote)) {
          ctx.i++;
          break;
        } else if (!isSkipped(ch)) {
          if (fences.isFenceBoundary()) {
            break;
          } else if (readToken) {
            const token = readToken(ctx);
            if (token) {
              children = children || [];
              children.push(token);
              ctx.i = token.end;
              continue;
            }
          }
        }
        ctx.i++;
      }
      const end = ctx.i;
      const result: TToken = {
        type: "QuotedText",
        start,
        end,
        value: ctx.substring(start, end),
      };
      if (children) result.children = children;
      return result;
    });
  };
}

export function readNewLines(
  ctx: TokenizerContext,
  count?: number
): TToken | undefined {
  return ctx.guard(() => {
    const start = ctx.i;
    const eolPos = ctx.skipWhile(isEol, count);
    if (start > 0 && eolPos === start) return;
    return {
      type: "Eol",
      start,
      end: eolPos,
      value: ctx.substring(start, eolPos),
      level: 0,
    };
  });
}

export function readEmptyLine(ctx: TokenizerContext): TToken | undefined {
  return ctx.guard(() => {
    const start = ctx.i;
    // if (ctx.i > 0) {
    if (!isEol(ctx.getChar(+0)) || !isEol(ctx.getChar(+1))) return;
    ctx.i += 2;
    // }
    const end = ctx.i;
    return {
      type: "EmptyLine",
      start,
      end,
      value: ctx.substring(start, end),
    };
  });
}
