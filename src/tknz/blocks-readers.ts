import { TToken, TTokenizerMethod, TokenizerContext } from "./tokenizer.ts";

export interface TFencedBlockToken extends TToken {
  startToken: TToken;
  endToken?: TToken;
}

export function newDynamicFencedBlockReader<
  T extends TFencedBlockToken = TFencedBlockToken
>(
  type: string,
  readStart: TTokenizerMethod,
  getContentTokenizer: (startToken: TToken) => TTokenizerMethod | undefined,
  getEndTokenizer: (startToken: TToken) => TTokenizerMethod | undefined
): TTokenizerMethod<T> {
  return (ctx: TokenizerContext): T | undefined =>
    ctx.guard((fences) => {
      const start = ctx.i;
      const startToken = readStart(ctx);
      let endToken: TToken | undefined;
      if (!startToken) return;
      ctx.i = startToken.end;

      const readToken = getContentTokenizer(startToken) || (() => undefined);
      const readEnd = getEndTokenizer(startToken);
      if (readEnd) fences.addFence(readEnd);

      const children: TToken[] = [];
      while (ctx.i < ctx.length) {
        endToken = readEnd?.(ctx);
        if (endToken) {
          ctx.i = endToken.end;
          break;
        }
        const fence = fences.getFenceToken();
        if (fence) {
          break;
        }
        const token = readToken(ctx);
        if (token) {
          children.push(token);
          ctx.i = token.end;
        } else {
          ctx.i++;
        }
      }
      let end = ctx.i;
      const result = {
        type,
        start,
        end,
        startToken,
        value: ctx.substring(start, end),
        children,
      } as T;
      if (endToken) result.endToken = endToken;
      return result;
    });
}

export function newFencedBlockReader<
  T extends TFencedBlockToken = TFencedBlockToken
>(
  type: string,
  readStart: TTokenizerMethod,
  readToken: TTokenizerMethod,
  readEnd: TTokenizerMethod
): TTokenizerMethod<T> {
  return newDynamicFencedBlockReader(
    type,
    readStart,
    () => readToken,
    () => readEnd
  );
}

export function newBlockReader(
  type: string,
  readToken: TTokenizerMethod
): TTokenizerMethod {
  return (ctx: TokenizerContext): TToken | undefined =>
    ctx.guard((fences) => {
      const start = ctx.i;
      const len = ctx.length;
      const children: TToken[] = [];
      while (ctx.i < len) {
        const fence = fences.getFenceToken();
        if (fence) {
          break;
        }
        const token = readToken(ctx);
        if (token) {
          children.push(token);
        } else {
          ctx.i++;
        }
      }
      const end = ctx.i;
      if (end === start) return;
      return {
        type,
        start,
        end,
        value: ctx.substring(start, end),
        children,
      };
    });
}
