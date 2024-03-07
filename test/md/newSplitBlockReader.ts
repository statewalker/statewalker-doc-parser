import type { TTokenizerMethod } from "../../src/index.ts";
import {
  type TToken,
  type TokenizerContext,
  newFencedBlockReader,
} from "../../src/index.ts";

export function newSplitBlockReader(
  type: string,
  readToken: TTokenizerMethod,
  readContent?: TTokenizerMethod
): TTokenizerMethod {
  return newFencedBlockReader(
    type,
    (ctx: TokenizerContext): TToken | undefined =>
      ctx.guard(() => {
        const token = readToken(ctx);
        if (!token) return;
        return {
          ...token,
          type: `${type}Start`,
        };
      }),
    readContent,
    (ctx: TokenizerContext): TToken | undefined =>
      ctx.guard(() => {
        const token = readToken(ctx);
        if (!token) return;
        return {
          type: `${type}End`,
          start: token.start,
          end: token.start,
          value: "",
        };
      })
  );
}
