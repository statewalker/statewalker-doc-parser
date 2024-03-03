import {
  TToken,
  TTokenizerMethod,
  TokenizerContext,
  isEol,
  isSpace,
  isSpaceOrEol,
  newFencedBlockReader,
  readNewLines,
} from "../base/index.ts";

export interface TMdHeaderStartToken extends TToken {
  type: "MdHeaderStart";
  level: number;
}

export function readMdHeaderStart(
  ctx: TokenizerContext
): TMdHeaderStartToken | undefined {
  return ctx.guard(() => {
    const start = ctx.i;
    const eolPos = ctx.skipWhile(isEol);
    if (start > 0 && eolPos === start) return;

    ctx.skipWhile(isSpaceOrEol);
    let level = 0;
    for (level = 0; level <= 6; level++) {
      if (ctx.getChar(level) !== "#") break;
    }
    if (level === 0) return;
    ctx.i += level;
    if (ctx.getChar() !== " ") return;
    ctx.i++;
    const end = ctx.i;
    return {
      type: "MdHeaderStart",
      start,
      end,
      value: ctx.substring(start, end),
      level,
    };
  });
}

export interface TMdHeaderEndToken extends TToken {
  type: "MdHeaderEnd";
}
export function readMdHeaderEnd(
  ctx: TokenizerContext
): TMdHeaderEndToken | undefined {
  return ctx.guard(() => {
    const start = ctx.i;
    const token = readMdHeaderStart(ctx) || readNewLines(ctx);
    if (!token) return;
    const end = token.start;
    ctx.i = end;
    return {
      type: "MdHeaderEnd",
      start,
      end,
      value: ctx.substring(start, end),
    };
  });
}

export interface TMdHeaderToken extends TToken {
  type: "MdHeader";
  level: number;
}
export function isMdHeaderToken(token?: TToken): token is TMdHeaderToken {
  if (!token) return false;
  return token.type === "MdHeader";
}
export function newMdHeaderReader(
  readToken?: TTokenizerMethod
): TTokenizerMethod<TMdHeaderToken> {
  const readHeader = newFencedBlockReader(
    "MdHeader",
    readMdHeaderStart,
    readToken,
    readMdHeaderEnd
  );
  return (ctx: TokenizerContext): TMdHeaderToken | undefined =>
    ctx.guard<TMdHeaderToken>(() => {
      const token = readHeader(ctx) as TMdHeaderToken;
      if (!token) return;
      const startToken = token.children?.[0] as TMdHeaderStartToken;
      if (!startToken) return;
      token.level = startToken.level;
      return token;
    });
}
