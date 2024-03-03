import {
  TFencedBlockToken,
  TToken,
  TTokenizerMethod,
  TokenizerContext,
  newBlockReader,
  newCharsReader,
  newCompositeTokenizer,
  newDynamicFencedBlockReader,
} from "../base";
import { newMdHeaderReader, readMdHeaderStart } from "./headers";

export interface TMdSectionToken extends TToken {
  type: "MdSection";
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
      const level = token.startToken.level;
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
  return readSection as TTokenizerMethod<TMdSectionToken>;
}
