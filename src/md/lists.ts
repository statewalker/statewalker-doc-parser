import type { TTokenizerMethod } from "../base/index.ts";
import {
  type TToken,
  type TokenizerContext,
  isEol,
  isSpace,
  newBlockReader,
  newCompositeTokenizer,
  newDynamicFencedBlockReader,
  readEmptyLine,
} from "../base/index.ts";

export function readMdListItemMarker(
  ctx: TokenizerContext
): TToken | undefined {
  return ctx.guard(() => {
    const start = ctx.i;
    if (ctx.skipWhile(isEol, 1) === start && start > 0) return;

    const markerStart = ctx.i;
    ctx.skipWhile(isSpace); // Skip whitespaces at the begining of the line
    const prevPos = ctx.i;
    const markerEnd = ctx.skipWhile((char) => !!char.match(/[-*\d>]/u));
    if (markerEnd === prevPos) return; // No list item symbols found
    if (ctx.skipWhile(isSpace) === markerEnd) return; // No spaces after the "*"

    const marker = ctx.substring(markerStart, markerEnd);
    const end = ctx.i;
    return {
      type: "MdListItemMarker",
      start,
      end,
      value: ctx.substring(start, end),
      marker,
    } as TToken;
  });
}

export type TMdListTokenizers = {
  readListItemMarker: TTokenizerMethod;
  readListItemContent?: TTokenizerMethod;
  compareListItemMarkers?: (startMarker: TToken, endMarker: TToken) => number;
};
export function newMdListReader({
  readListItemMarker = readMdListItemMarker,
  readListItemContent,
  compareListItemMarkers = (startMarker, endMarker) => {
    return startMarker.marker.length < endMarker.marker.length ? -1 : 1;
  },
}: TMdListTokenizers) {
  const tokenizers: TTokenizerMethod[] = [];
  const compositeReader = newCompositeTokenizer(tokenizers);
  const readContent = newBlockReader("MdListItemContent", compositeReader);
  const readListItem = newDynamicFencedBlockReader(
    "MdListItem",
    (ctx: TokenizerContext): TToken | undefined =>
      ctx.guard(() => {
        const token = readListItemMarker(ctx);
        if (!token) return;
        (token as TToken).type = "MdListItemStart";
        return token;
      }),
    () => readContent,
    (token: TToken) => {
      const startMarker = token as TToken;
      return (ctx: TokenizerContext): TToken | undefined =>
        ctx.guard(() => {
          const start = ctx.i;
          const emptyLine = readEmptyLine(ctx);
          if (!emptyLine) {
            ctx.i = start;
            const endMarker = readListItemMarker(ctx);
            if (!endMarker) return;
            // Embedded list item
            if (compareListItemMarkers(startMarker, endMarker) < 0) return;
          }
          const end = (ctx.i = start);
          return {
            type: "MdListItemEnd",
            start,
            end,
            value: ctx.substring(start, end),
          };
        });
    }
  );

  const readListToken = newBlockReader("MdList", readListItem);
  const readList = (ctx: TokenizerContext): TToken | undefined =>
    ctx.guard((fences) => {
      const start = ctx.i;
      fences.addFence(readEmptyLine);

      const listItemMarker = readListItemMarker(ctx);
      ctx.i = start;
      if (!listItemMarker) return;

      const token = readListToken(ctx);

      if (!token || !token.children) return;
      return token;
    });
  tokenizers.push(readList);
  readListItemContent && tokenizers.push(readListItemContent);
  return readList;
}
