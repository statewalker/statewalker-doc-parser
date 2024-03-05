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
  const list: TTokenizerMethod[] = [];
  const compositeReader = newCompositeTokenizer(list);
  const readToken = newBlockReader("MdList", compositeReader);
  const readEols = newCharsReader("Eol", isEol);
  list.push(
    newDynamicFencedBlockReader(
      "MdListItem",
      (ctx: TokenizerContext): TToken | undefined =>
        ctx.guard(() => {
          const token = readListItemMarker(ctx);
          return token;
        }),
      () => readToken,
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
    )
  );
  readContent && list.push(readContent);
  return readToken;
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
