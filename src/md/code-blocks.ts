import {
  type TToken,
  type TTokenizerMethod,
  type TokenizerContext,
  isEol,
  isSpace,
  isSpaceOrEol,
  newCharsReader,
  newCompositeTokenizer,
  newDynamicFencedBlockReader,
} from "../base/index.ts";

// -----------------------------------
interface TMdCodeBlockStartToken extends TToken {
  type: "MdCodeBlockStart";
  meta: string;
}
function isMdCodeBlockStart(token?: TToken): token is TMdCodeBlockStartToken {
  return token?.type === "MdCodeBlockStart";
}
function newMdCodeBlockStartReader(): TTokenizerMethod<TMdCodeBlockStartToken> {
  const readBlockType = newCharsReader(
    "AlphaNum",
    (char) => !!char.match(/\S/u)
  );
  return (ctx: TokenizerContext) => {
    return ctx.guard(() => {
      const start = ctx.i;
      if (ctx.i > 0 && !isEol(ctx.getChar(0))) return;
      ctx.skipWhile(isSpaceOrEol);
      if (
        ctx.getChar(+0) !== "`" ||
        ctx.getChar(+1) !== "`" ||
        ctx.getChar(+2) !== "`"
      ) {
        return;
      }
      ctx.i += 3;
      ctx.skipWhile(isSpace);
      const token = readBlockType(ctx);
      ctx.skipWhile(isSpace);
      const meta = token?.value;
      const end = ctx.i;
      const result = {
        type: "MdCodeBlockStart",
        start,
        end,
        value: ctx.substring(start, end),
      } as TMdCodeBlockStartToken;
      if (meta) result.meta = meta;
      return result;
    });
  };
}

// --------------------------------------------------
interface TMdCodeBlockEndToken extends TToken {
  type: "MdCodeBlockEnd";
}
function newMdCodeBlockEndReader(
  readStart: TTokenizerMethod,
  blockType: string | undefined
): TTokenizerMethod<TMdCodeBlockEndToken> {
  const readEmptyLines = newCharsReader("Eol", (char) => !!char.match(/\s/u));
  return (ctx: TokenizerContext) => {
    return ctx.guard(() => {
      const start = ctx.i;
      const fenceToken = readStart(ctx);
      const meta = fenceToken?.meta;
      console.log("???", fenceToken, ctx.substring(ctx.i));
      // Accept blocks of other types as embedded blocks
      // if (meta) return ;
      if (blockType && meta && meta !== blockType) return;

      const end = (ctx.i = start);
      if (fenceToken) {
        // end = fenceToken.start;
      } else {
        const eols = readEmptyLines(ctx);
        if (!eols) return;
        // end = eols.start;
      }
      // Generate an empty token, just before the found delimiter
      const result = {
        type: "MdCodeBlockEnd",
        start,
        end,
        value: ctx.substring(start, end),
      } as TMdCodeBlockEndToken;
      // if (fenceToken && !meta) result.children = [fenceToken];
      return result;
    });
  };
}

// --------------------------------------------------

export interface TMdCodeBlockToken extends TToken {
  type: "MdCodeBlock";
  meta: string;
}
export function isMdCodeBlockToken(token?: TToken): token is TMdCodeBlockToken {
  if (!token) return false;
  return token.type === "MdCodeBlock";
}

export type TMdCodeBlockTokenizers = {
  readMdCodeBlockTokens?: TTokenizerMethod;
  meta?: string;
};

export function newMdCodeBlocksReader({
  readMdCodeBlockTokens,
}: TMdCodeBlockTokenizers = {}): TTokenizerMethod<TMdCodeBlockToken> {
  const list: TTokenizerMethod[] = [];
  readMdCodeBlockTokens && list.push(readMdCodeBlockTokens);
  const compositeReader = newCompositeTokenizer(list);
  const readMdCodeBlockStart = newMdCodeBlockStartReader();
  const readMdCodeBlock = newDynamicFencedBlockReader(
    "MdCodeBlock",
    readMdCodeBlockStart,
    () => compositeReader,
    (token: TToken): TTokenizerMethod | undefined => {
      const meta = isMdCodeBlockStart(token) ? token.meta : undefined;
      return newMdCodeBlockEndReader(readMdCodeBlockStart, meta);
    }
  );
  // Allow to read code blocks recursively
  list.unshift(readMdCodeBlock);

  return (ctx: TokenizerContext): TMdCodeBlockToken | undefined =>
    ctx.guard<TMdCodeBlockToken>(() => {
      const token = readMdCodeBlock(ctx) as TMdCodeBlockToken;
      if (!token) return;
      const startToken = token.children?.[0];
      if (isMdCodeBlockStart(startToken) && startToken.meta) {
        token.meta = startToken.meta;
      }
      return token;
    });
}
