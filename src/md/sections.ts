import {
  TToken,
  TTokenizerMethod,
  TokenizerContext,
  newCompositeTokenizer,
  newDynamicFencedBlockReader,
} from "../base/index.ts";
import {
  isMdHeaderToken,
  newMdHeaderReader,
  readMdHeaderStart,
} from "./headers";

export interface TMdSectionToken extends TToken {
  type: "MdSection";
  level: number;
}
export function isMdSectionToken(token?: TToken): token is TMdSectionToken {
  if (!token) return false;
  return token.type === "MdSection";
}
export function newMdSectionReader(
  readToken?: TTokenizerMethod
): TTokenizerMethod<TMdSectionToken> {
  const list: TTokenizerMethod[] = [];
  readToken && list.push(readToken);
  const compositeReader = newCompositeTokenizer(list);
  const readMdHeader = newMdHeaderReader(readToken);
  const readSection = newDynamicFencedBlockReader(
    "MdSection",
    readMdHeader,
    () => compositeReader,
    (token: TToken): TTokenizerMethod | undefined => {
      const level = isMdHeaderToken(token) ? token.level : 0;
      return (ctx: TokenizerContext) => {
        return ctx.guard(() => {
          const token = readMdHeaderStart(ctx);
          if (!token || token.level > level) return;
          const end = (ctx.i = token.start);
          return {
            type: "MdSectionEnd",
            start: token.start,
            end,
            value: ctx.substring(token.start, ctx.i),
          };
        });
      };
    }
  );

  list.unshift(
    // readMdHeader,
    readSection
  );
  return (ctx: TokenizerContext): TMdSectionToken | undefined =>
    ctx.guard<TMdSectionToken>(() => {
      const token = readSection(ctx) as TMdSectionToken;
      if (!token) return;
      const startToken = token.children?.[0];
      if (!isMdHeaderToken(startToken)) return;
      token.level = startToken.level;
      return token;
    });
}
