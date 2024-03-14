import type {
  TToken,
  TTokenizerMethod,
  TokenizerContext,
} from "../../src/index.ts";
import {
  isEol,
  isSpace,
  isolate,
  newBlockReader,
  newBlocksSequenceReader,
  newCharReader,
  newCodeReader,
  newCompositeTokenizer,
  newFencedBlockReader,
  newMdListReader,
  newMdSectionReader,
  newTokensSequenceReader,
} from "../../src/index.ts";
import {
  newMdFencedBlocksReader,
  newMdFencesReader,
} from "../../src/md/fenced-blocks.ts";
import { newTestRunner } from "../utils/newTestRunner.ts";
import { newTokenizerTest } from "../utils/newTokenizerTest.ts";

Promise.resolve().then(main).catch(console.error);

function readMdListItemMarker(ctx: TokenizerContext): TToken | undefined {
  return ctx.guard(() => {
    const start = ctx.i;
    if (ctx.skipWhile(isEol, 1) === start && start > 0) return;

    const markerStart = ctx.i;
    ctx.skipWhile(isSpace); // Skip whitespaces at the begining of the line
    const prefixEnd = ctx.i;
    let markerEnd = ctx.skipWhile((char) => !!char.match(/[-*>]/u));
    if (markerEnd === prefixEnd) {
      markerEnd = ctx.skipWhile((char) => !!char.match(/\d/u));
      if (markerEnd === prefixEnd || ctx.getChar() !== ".") return;
      ctx.i++;
    }
    if (markerEnd === prefixEnd) return; // No list item symbols found
    if (ctx.skipWhile(isSpace) === markerEnd) return; // No spaces after the "*"

    const marker = ctx.substring(markerStart, markerEnd);
    const depth = prefixEnd - markerStart;
    const end = ctx.i;
    return {
      type: "MdListItemMarker",
      start,
      end,
      value: ctx.substring(start, end),
      depth,
      marker,
    } as TToken;
  });
}

// function newListItemReader(readToken: TTokenizerMethod): TTokenizerMethod {
//   return newBlocksSequenceReader("MdListItem", readMdListItemMarker, readToken);
// }

function newListReader(readToken: TTokenizerMethod): TTokenizerMethod {
  // const readListItem = newListItemReader(readToken);
  const readEmptyLines = newEmptyLinesReader();
  const readEndOfList = newCompositeTokenizer([
    readEmptyLines,
    readMdListItemMarker,
  ]);
  const readListItem = newFencedBlockReader(
    "MdListItem",
    readMdListItemMarker,
    readToken,
    readMdListItemMarker
  );
  return newBlockReader("MdList", readListItem);
}

function newEmptyLinesReader(count: number = 1) {
  const readEol = newCharReader(
    "Eol",
    (char) => char === "\n" || char === "\r"
  );
  const readEmptyLines = newTokensSequenceReader(
    "EmptyLines",
    readEol,
    1 + count
  );
  return readEmptyLines;
}

function newSeparateBlocksReader(
  readToken: TTokenizerMethod
): TTokenizerMethod {
  const readEmptyLines = newEmptyLinesReader();
  return newBlocksSequenceReader("MdTextBlock", readEmptyLines, readToken);
}

async function main() {
  const inlineTokenizers: TTokenizerMethod[] = [];
  const readInlineContent = newCompositeTokenizer(inlineTokenizers);

  const blockTokenizers: TTokenizerMethod[] = [];
  const readBlockContent = newCompositeTokenizer(blockTokenizers);

  const readCode = newCodeReader();
  inlineTokenizers.push(readCode);
  blockTokenizers.push(isolate(readCode));

  // const readListToken = newListReader(readInlineContent);
  const readListToken = newMdListReader({
    readListItemContent: readBlockContent,
  });
  blockTokenizers.push(readListToken);

  const readFencedContent = newMdFencedBlocksReader({
    readFencedContent: readBlockContent,
    readFencedAttributes: readCode,
  });
  blockTokenizers.push(readFencedContent);

  const readTextBlocks = newSeparateBlocksReader(readBlockContent);

  const readMdSections = newMdSectionReader({
    readHeaderTokens: isolate(readInlineContent),
    readSectionTokens: isolate(readTextBlocks),
  });
  // blockTokenizers.push(readMdSections);
  const readToken = newCompositeTokenizer([readMdSections, readTextBlocks]);
  const runTests = newTestRunner(newTokenizerTest(readToken));
  runTests(`${import.meta.dirname}/data/separators-lists`);
}
