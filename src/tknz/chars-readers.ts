import { TokenizerContext } from "./tokenizer.ts";

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
