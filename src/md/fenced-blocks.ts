import type { TToken, TTokenizerMethod, TokenizerContext } from "../index.ts";
import {
  isEol,
  isSpace,
  newBlockReader,
  newHtmlAttributeReader,
  newMdListReader,
  readNewLines,
} from "../index.ts";

export function newMdFencesReader(readToken?: TTokenizerMethod) {
  const readAttributePair = newHtmlAttributeReader(readToken);
  const readAttributes = newBlockReader("MdFenceAttributes", readAttributePair);
  const readEol = (ctx: TokenizerContext) => readNewLines(ctx, 1);
  return (ctx: TokenizerContext): TToken | undefined => {
    return ctx.guard(() => {
      const start = ctx.i;
      if (ctx.skipWhile(isEol, 1) === start && start > 0) return;

      const markerStart = ctx.i;
      ctx.skipWhile(isSpace); // Skip whitespaces at the begining of the line
      const prefixEnd = ctx.i;
      const markerEnd = ctx.skipWhile((char) => !!char.match(/:/u));
      if (markerEnd - prefixEnd < 3) return;
      if (markerEnd === prefixEnd) return; // No list item symbols found
      ctx.skipWhile(isSpace);
      const attributesToken = ctx.guard((fences) => {
        fences.addFence(readEol);
        return readAttributes(ctx);
      });

      const marker = ctx.substring(markerStart, markerEnd);
      const depth = prefixEnd - markerStart;
      const end = ctx.i;
      const token: TToken = {
        type: "MdFencedItemMarker",
        start,
        end,
        value: ctx.substring(start, end),
        depth,
        marker,
      };
      if (attributesToken) {
        token.children = attributesToken.children;
      }
      return token;
    });
  };
}

export interface TMdFencedBlockTokenizers {
  readFencedContent?: TTokenizerMethod;
  readFencedAttributes?: TTokenizerMethod;
}

export function newMdFencedBlocksReader({
  readFencedContent = () => undefined,
  readFencedAttributes = () => undefined,
}: TMdFencedBlockTokenizers = {}) {
  const readFenceMarker = newMdFencesReader(readFencedAttributes);
  const readList = newMdListReader({
    readListItemMarker: readFenceMarker,
    readListItemContent: readFencedContent,
    listTokenNames: {
      List: "MdFencedBlock",
      ListItem: "MdFencedSection",
      ListItemStart: "MdFencedSectionStart",
      ListItemContent: "MdFencedSectionContent",
      // ListItemEnd: "MdFencedSectionEnd",
    },
  });
  return readList;
}
