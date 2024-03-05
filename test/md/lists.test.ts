import {
  type TToken,
  type TTokenizerMethod,
  type TokenizerContext,
  isEol,
  isSpace,
  newCompositeTokenizer,
  newDynamicFencedBlockReader,
  newBlockReader,
  newCharsReader,
  newCharReader,
  isSpaceOrEol,
} from "../../src/index.ts";
import { describe, it } from "../deps.ts";
import { newBlockTest } from "../newBlockTest.ts";

import { testData } from "./lists.data.ts";

// const isAlphaNum = (char: string[0]) => !!char.match(/\S/u);
interface TMdListItemMarker extends TToken {
  type: "MdListItemMarker";
  marker: string;
}
// function isEndListMarker(marker?: TToken): marker is TMdListItemMarker {
//   return marker?.type === "MdListItemMarker";
// }
function newEmptyLineReader() {
  // Read one line
  const readEol = newCharReader("NL", (char) => !!char.match(/\s/u));
  return (ctx: TokenizerContext): TToken | undefined => {
    const start = ctx.i;
    if (ctx.i > 0 && !readEol(ctx)) return;
    const end = ctx.i;
    return {
      type: "NL",
      start,
      end,
      value: ctx.substring(start, end),
    };
  };
}

function readListItemMarker(
  ctx: TokenizerContext
): TMdListItemMarker | undefined {
  // const readEmptyLine = newEmptyLineReader();
  return ctx.guard(() => {
    const start = ctx.i;
    ctx.skipWhile(isEol);
    if (ctx.i > 0 && ctx.i === start) return;
    const markerStart = ctx.i;
    ctx.skipWhile(isSpace); // Skip whitespaces at the begining of the line
    const prevPos = ctx.i;
    ctx.skipWhile((char) => !!char.match(/[-*\d]/u));
    const markerEnd = ctx.i;
    if (markerEnd === prevPos) return; // No list item symbols found
    ctx.skipWhile(isSpace); // Skip spaces after the list item symbols
    if (ctx.i === markerEnd) return; // No spaces after the "*"

    const marker = ctx.substring(markerStart, markerEnd);
    const end = ctx.i;
    return {
      type: "MdListItemMarker",
      start,
      end,
      value: ctx.substring(start, end),
      marker,
    } as TMdListItemMarker;
  });
}

function newMdListReader(readContent?: TTokenizerMethod) {
  const tokenizers: TTokenizerMethod[] = [];
  const readEols = newCharsReader("Eol", isEol);
  const compositeReader = newCompositeTokenizer(tokenizers);
  const readListItemContent = newBlockReader(
    "MdListItemContent",
    compositeReader
  );
  const readListItem = newDynamicFencedBlockReader(
    "MdListItem",
    (ctx: TokenizerContext): TToken | undefined =>
      ctx.guard(() => {
        const token = readListItemMarker(ctx);
        if (!token) return;
        (token as TToken).type = "MdListItemStart";
        return token;
      }),
    () => readListItemContent,
    (token: TToken) => {
      const startMarker = token as TMdListItemMarker;
      return (ctx: TokenizerContext): TToken | undefined =>
        ctx.guard(() => {
          const start = ctx.i;
          const eols = readEols(ctx);
          if (!eols || ctx.i - start < 2) {
            ctx.i = start;
            const endMarker = readListItemMarker(ctx);
            if (!endMarker) return;
            // Embedded list item
            if (startMarker.marker.length < endMarker.marker.length) return;
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
    ctx.guard(() => {
      const start = ctx.i;
      const listItemMarker = readListItemMarker(ctx);
      ctx.i = start;
      if (!listItemMarker) return;
      const token = readListToken(ctx);
      if (!token || !token.children) return ;
      return token;
      // const start = ctx.i;
      // let children: TToken[] | undefined;
      // while (ctx.i < ctx.length) {
      //   const item = readListItem(ctx);
      //   if (!item) break;
      //   children = children || [];
      //   children.push(item);
      // }
      // const end = ctx.i;
      // if (!children) return;
      // return {
      //   type: "MdList",
      //   start,
      //   end,
      //   value: ctx.substring(start, end),
      //   children,
      // };

      //   const token = readListToken(ctx);
      //   if (!token || !token.children) return;
      //   return token;
    });
  tokenizers.push(readList);
  // tokenizers.push(readListItem);
  readContent && tokenizers.push(readContent);
  return readList;
}

describe("newMdListsReader", () => {
  const readToken = newMdListReader();
  const test = newBlockTest(readToken);
  testData.forEach((data) => {
    it(data.description, () => {
      test(data.input, data.expected);
    });
  });
});
