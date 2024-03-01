import {
  type TToken,
  type TTokenizerMethod,
  CHAR_ANY,
  CHAR_CONTROL,
  CHAR_DIGIT,
  CHAR_EOL,
  CHAR_PUNCTUATION,
  CHAR_FORMAT,
  CHAR_SPACE,
  isCharType,
  TokenizerContext,
  newCompositeTokenizer,
} from "../../../src/tknz/base/index.ts";

export function readSequence<T extends TToken>(
  ctx: TokenizerContext,
  charsMask: number,
  type: string
): T | undefined {
  const start = ctx.i;
  const end = ctx.skipWhile((ch) => isCharType(ch, charsMask));
  return end > start
    ? ({
        type,
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
  return readSequence<TDigitsToken>(ctx, CHAR_DIGIT, "Digit");
}

// -----------------------------------------------------------------------------

export interface TSpaceToken extends TToken {
  type: "Space";
  count: number; // number of spaces
}

export function readSpaces(ctx: TokenizerContext): TSpaceToken | undefined {
  return readSequence<TSpaceToken>(ctx, CHAR_SPACE, "Space");
}

// -----------------------------------------------------------------------------

export interface TEolToken extends TToken {
  type: "Eol";
  count: number; // number of end of line symbols
}

export function readEols(ctx: TokenizerContext): TEolToken | undefined {
  return readSequence<TEolToken>(ctx, CHAR_EOL, "Eol");
}

// -----------------------------------------------------------------------------

export interface TPunctuationToken extends TToken {
  type: "Punctuation";
  count: number; // number of control symbols
}

export function readPunctuation(
  ctx: TokenizerContext
): TPunctuationToken | undefined {
  return readSequence<TPunctuationToken>(ctx, CHAR_PUNCTUATION, "Punctuation");
}

// -----------------------------------------------------------------------------

export interface TFormatToken extends TToken {
  type: "Format";
  count: number; // number of control symbols
}

export function readFormat(ctx: TokenizerContext): TFormatToken | undefined {
  return readSequence<TFormatToken>(ctx, CHAR_FORMAT, "Format");
}

// -----------------------------------------------------------------------------

export interface TControlToken extends TToken {
  type: "Control";
  count: number; // number of control symbols
}

export function readControls(ctx: TokenizerContext): TControlToken | undefined {
  return readSequence<TControlToken>(ctx, CHAR_CONTROL, "Control");
}

// -----------------------------------------------------------------------------

export interface TTextToken extends TToken {
  type: "Text";
  count: number; // number of texts or digits
}

export function readText(ctx: TokenizerContext): TTextToken | undefined {
  return readSequence<TTextToken>(ctx, CHAR_DIGIT | CHAR_ANY, "Text");
}

// -----------------------------------------------------------------------------

export function newNgramsReader(tokenizers: TTokenizerMethod[] = []) {
  tokenizers.push(
    readEols,
    readSpaces,
    readPunctuation,
    readFormat,
    readControls,
    readDigits,
    readText
  );
  return newCompositeTokenizer(tokenizers);
}
