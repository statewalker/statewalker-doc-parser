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
function readListItemMarker(
  ctx: TokenizerContext
): TMdListItemMarker | undefined {
  return ctx.guard(() => {
    const start = ctx.i;
    ctx.skipWhile(isEol);
    if (ctx.i > 0 && ctx.i === start) return;
    const markerStart = ctx.i;
    ctx.skipWhile(isSpace);
    const prev = ctx.i;
    ctx.skipWhile((char) => !!char.match(/[-*\d]/u));
    if (ctx.i === prev) return;
    const markerEnd = ctx.i;
    ctx.skipWhile(isSpace);
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

const readEmptyLines = newCharsReader("Eol", (char) => !!char.match(/\s/u));
function newMdListReader(readContent?: TTokenizerMethod) {
  const list: TTokenizerMethod[] = [];
  readContent && list.push(readContent);
  const compositeReader = newCompositeTokenizer(list);
  const readToken = newBlockReader("MdList", compositeReader);
  list.unshift(
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
            const end = start;
            const endMarker = readListItemMarker(ctx);
            if (endMarker) {
              console.log(`***\n[${startMarker.marker}]\n[${endMarker.marker}]`);
              if (startMarker.marker.length < endMarker.marker.length) return;
            } else {
              // const eol = readEmptyLines(ctx);
              // if (!eol || eol.value.length < 2) return;
              return ;
            }
            // Embedded list item
            // if (startMarker.marker === endMarker.marker) return endMarker;
            return {
              // ...endMarker,
              type: "MdListItemEnd",
              start,
              end,
              value: ctx.substring(start, end),
            };
          });
      }
    )
  );
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
