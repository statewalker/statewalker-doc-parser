import type { TTokenizerMethod } from "../base/index.ts";
import {
  type TToken,
  type TokenizerContext,
  isEol,
  isSpace,
  newDynamicFencedBlockReader,
} from "../base/index.ts";

const isAlphaNum = (char: string[0]) => !!char.match(/\S/u);
export function newMdCodeFenceReader(
  separatorChar?: string[1]
): TTokenizerMethod {
  return (ctx: TokenizerContext): TToken | undefined => {
    return ctx.guard(() => {
      const start = ctx.i;
      ctx.skipWhile(isEol);
      if (ctx.i > 0 && ctx.i - start > 1) return;
      const startLinePos = ctx.i;
      ctx.skipWhile(isSpace);
      const depth = ctx.i - startLinePos;
      const char = ctx.getChar(+0);
      if (char !== "`" && char !== "~") return;
      if (separatorChar && char !== separatorChar) return;
      if (ctx.getChar(+1) !== char || ctx.getChar(+2) !== char) return;
      ctx.i += 3;

      const namesStart = ctx.skipWhile(isSpace);
      const nameEnd = ctx.skipWhile(isAlphaNum);
      const name = ctx.substring(namesStart, nameEnd);
      const end = ctx.i;
      return {
        type: "MdCodeFence",
        start,
        end,
        value: ctx.substring(start, end),
        separator: char,
        name,
        depth,
      } as TToken;
    });
  };
}

export const readCodeFence = newMdCodeFenceReader();

export type TMdCodeBlockTokenizers = {
  readCodeBlockContent?: TTokenizerMethod;
};
export function newMdCodeBlockReader({
  readCodeBlockContent,
}: TMdCodeBlockTokenizers) {
  const readOpenFence = newMdCodeFenceReader();
  return newDynamicFencedBlockReader(
    "MdCodeBlock",
    (ctx: TokenizerContext): TToken | undefined =>
      ctx.guard(() => {
        const token = readOpenFence(ctx);
        if (!token) return;
        return {
          ...token,
          type: "MdCodeBlockStart",
        };
      }),
    () => readCodeBlockContent,
    (openToken: TToken) => {
      const readCloseFence = newMdCodeFenceReader(openToken.separator);
      return (ctx: TokenizerContext): TToken | undefined =>
        ctx.guard(() => {
          let token = readCloseFence(ctx);
          if (!token) return;
          if (!token.name) {
            token.type = "MdCodeBlockEnd";
          } else {
            token = {
              type: "MdCodeBlockEnd",
              start: token.start,
              end: token.start,
              value: "",
            };
          }
          return token;
        });
    }
  );
}
