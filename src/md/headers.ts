import {
  TFencedBlockToken,
  TToken,
  TTokenizerMethod,
  TokenizerContext,
  isEol,
  isSpace,
  newFencedBlockReader,
  readNewLines,
} from "../base";

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

    ctx.skipWhile(isSpace);
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

export interface TMdHeaderToken extends TFencedBlockToken {
  type: "MdHeader";
}
export function newMdHeaderReader(readToken: TTokenizerMethod) : TTokenizerMethod<TMdHeaderToken> {
  return newFencedBlockReader(
    "MdHeader",
    readMdHeaderStart,
    readToken,
    readMdHeaderEnd
  );
}
