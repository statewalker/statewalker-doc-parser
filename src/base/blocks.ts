import {
  type TToken,
  type TTokenizerMethod,
  type TokenizerContext,
} from "./tokenizer.ts";

export interface TFencedBlockToken extends TToken {
  startToken: TToken;
  endToken?: TToken;
}

/**
 * Generic method to create a reader for a fenced block.
 * This method returns a reader consuming all characters until a fence
 * or an end token is found.
 *
 * @param type the type of produced tokens
 * @param readStart the method to read the start token; this returned generates
 * new tokens starting from the first token of the block
 * @param getContentTokenizer returns an optional function recognizing inner
 * tokens in the stream between the initial and final tokens
 * @param getEndTokenizer this function returns an optional method to recognize
 * the end token of the block; if this method is not provided the block will
 * be recognized until a fence is found
 * @returns a tokenizer method consuming all characters until the end of the block
 * or a fence is found
 */
export function newDynamicFencedBlockReader<
  T extends TFencedBlockToken = TFencedBlockToken,
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

      let children: TToken[] | undefined;
      while (ctx.i < ctx.length) {
        endToken = readEnd?.(ctx);
        if (endToken) {
          ctx.i = endToken.end;
          break;
        }
        if (fences.isFenceBoundary()) {
          break;
        }
        const token = readToken(ctx);
        if (token) {
          if (!children) children = [];
          children.push(token);
          ctx.i = token.end;
        } else {
          ctx.i++;
        }
      }
      const end = ctx.i;
      const result = {
        type,
        start,
        end,
        startToken,
        value: ctx.substring(start, end),
      } as T;
      if (endToken) result.endToken = endToken;
      if (children) result.children = children;
      return result;
    });
}

/**
 * This function returns a reader producing tokens if the initial sequence
 * is found. Starting from the start token this method consumes all characters
 * until a fence or a end token is found. All tokens returned by the readToken
 * method are added to the children array of the resulting token.
 *
 * @param type the type of returned tokens
 * @param readStart the token reader for the start of the block
 * @param readToken optional token reader for the content of the block;
 * tokens returned by this method are added to the children array
 * of the returned token
 * @param readEnd optional token reader for the end of the block
 * @returns a tokenizer method consuming all characters until
 * the end of the block or a fence is found
 */
export function newFencedBlockReader<
  T extends TFencedBlockToken = TFencedBlockToken,
>(
  type: string,
  readStart: TTokenizerMethod,
  readToken?: TTokenizerMethod,
  readEnd?: TTokenizerMethod
): TTokenizerMethod<T> {
  return newDynamicFencedBlockReader(
    type,
    readStart,
    () => readToken,
    () => readEnd
  );
}

/**
 * This function returns a reader consuming all characters until
 * a fence is found. All tokens returned by the readToken method
 * are added to the children array.
 * @param type the type of the token to create
 * @param readToken the method to read the tokens
 * @returns a tokenizer method consuming all characters until
 * a fence is found
 */
export function newBlockReader(
  type: string,
  readToken: TTokenizerMethod
): TTokenizerMethod {
  return (ctx: TokenizerContext): TToken | undefined =>
    ctx.guard((fences) => {
      const start = ctx.i;
      const len = ctx.length;
      let children: TToken[] | undefined;
      while (ctx.i < len) {
        if (fences.isFenceBoundary()) {
          break;
        }
        const token = readToken(ctx);
        if (token) {
          if (!children) children = [];
          children.push(token);
        } else {
          ctx.i++;
        }
      }
      const end = ctx.i;
      if (end === start) return;
      const result: TToken = {
        type,
        start,
        end,
        value: ctx.substring(start, end),
      };
      if (children) result.children = children;
      return result;
    });
}
