import type { TTokenizerMethod } from "../base/index.ts";
import {
  type TToken,
  type TokenizerContext,
  isEol,
  isSpace,
  newFencedBlockReader,
} from "../base/index.ts";

const isAlphaNum = (char: string[0]) => !!char.match(/\S/u);
export function readCodeFence(ctx: TokenizerContext): TToken | undefined {
  return ctx.guard(() => {
    const start = ctx.i;
    ctx.skipWhile(isEol);
    if (ctx.i > 0 && ctx.i - start > 1) return;
    const startLinePos = ctx.i;
    ctx.skipWhile(isSpace);
    const depth = ctx.i - startLinePos;
    if (
      ctx.getChar(+0) !== "`" ||
      ctx.getChar(+1) !== "`" ||
      ctx.getChar(+2) !== "`"
    ) {
      return;
    }
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
      name,
      depth,
    } as TToken;
  });
}

export type TMdCodeBlockTokenizers = {
  readCodeBlockContent?: TTokenizerMethod;
};
export function newMdCodeBlockReader({
  readCodeBlockContent,
}: TMdCodeBlockTokenizers) {
  return newFencedBlockReader(
    "MdCodeBlock",
    (ctx: TokenizerContext): TToken | undefined =>
      ctx.guard(() => {
        const token = readCodeFence(ctx);
        if (!token) return;
        return {
          ...token,
          type: "MdCodeBlockStart",
        };
      }),
    readCodeBlockContent,
    (ctx: TokenizerContext): TToken | undefined =>
      ctx.guard(() => {
        let token = readCodeFence(ctx);
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
      })
  );
}
