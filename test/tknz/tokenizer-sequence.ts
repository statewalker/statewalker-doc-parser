import { CHAR_ANY, CHAR_DIGIT, CHAR_EOL, CHAR_SPACE } from "./chars.ts";
import { TToken, TTokenLevel, TokenizerContext } from "./tokenizer.ts";

function readContinuation<T extends TToken>(
  ctx: TokenizerContext,
  charsMask: number,
  type: string
): T | undefined {
  const start = ctx.i;
  const end = ctx.skipWhile(charsMask).i;
  return end > start
    ? ({
        type,
        level: TTokenLevel.char,
        start,
        end,
        value: ctx.substring(start, end),
      } as T)
    : undefined;
}

// -----------------------------------------------------------------------------

export interface TDigitsToken extends TToken {
  type: "Digit";
  count: number; // number of digits
}
export function readDigits(ctx: TokenizerContext): TDigitsToken | undefined {
  return readContinuation<TDigitsToken>(ctx, CHAR_DIGIT, "Digit");
}

// -----------------------------------------------------------------------------

export interface TSpaceToken extends TToken {
  type: "Space";
  count: number; // number of spaces
}

export function readSpaces(ctx: TokenizerContext): TSpaceToken | undefined {
  return readContinuation<TSpaceToken>(ctx, CHAR_SPACE, "Space");
}

// -----------------------------------------------------------------------------

export interface TEolToken extends TToken {
  type: "Eol";
  count: number; // number of end of line symbols
}

export function readEols(ctx: TokenizerContext): TEolToken | undefined {
  return readContinuation<TEolToken>(ctx, CHAR_EOL, "Eol");
}

// -----------------------------------------------------------------------------

export interface TTextToken extends TToken {
  type: "Text";
  count: number; // number of texts or digits
}

export function readText(ctx: TokenizerContext): TTextToken | undefined {
  return readContinuation<TTextToken>(ctx, CHAR_DIGIT | CHAR_ANY, "Text");
}

// -----------------------------------------------------------------------------
