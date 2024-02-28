import {
  CHAR_ANY,
  CHAR_CONTROL,
  CHAR_DIGIT,
  CHAR_EOL,
  CHAR_PUNCTUATION,
  CHAR_FORMAT,
  CHAR_SPACE,
} from "./chars.ts";
import {
  TToken,
  TTokenLevel,
  TokenizerContext,
  newCompositeTokenizer,
} from "./tokenizer.ts";

function readContinuation<T extends TToken>(
  ctx: TokenizerContext,
  charsMask: number,
  type: string
): T | undefined {
  const start = ctx.i;
  const end = ctx.skipWhile(charsMask);
  if (end > start) {
    return {
      type,
      level: TTokenLevel.char,
      start,
      end,
      value: ctx.substring(start, end),
    } as T;
  }
  ctx.i = start;
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

export interface TPunctuationToken extends TToken {
  type: "Punctuation";
  count: number; // number of control symbols
}

export function readPunctuation(
  ctx: TokenizerContext
): TPunctuationToken | undefined {
  return readContinuation<TPunctuationToken>(
    ctx,
    CHAR_PUNCTUATION,
    "Punctuation"
  );
}

// -----------------------------------------------------------------------------

export interface TFormatToken extends TToken {
  type: "Format";
  count: number; // number of control symbols
}

export function readFormat(ctx: TokenizerContext): TFormatToken | undefined {
  return readContinuation<TFormatToken>(ctx, CHAR_FORMAT, "Format");
}

// -----------------------------------------------------------------------------

export interface TControlToken extends TToken {
  type: "Control";
  count: number; // number of control symbols
}

export function readControls(ctx: TokenizerContext): TControlToken | undefined {
  return readContinuation<TControlToken>(ctx, CHAR_CONTROL, "Control");
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

export function newNgramsReader() {
  return newCompositeTokenizer(
    readEols,
    readSpaces,
    readPunctuation,
    readFormat,
    readControls,
    readDigits,
    readText
  );
}
