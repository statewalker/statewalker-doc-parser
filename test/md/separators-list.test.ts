import type { TTokenizerMethod } from "../../src/index.ts";
import {
  isolate,
  newBlocksSequenceReader,
  newCodeReader,
  newCompositeTokenizer,
  newEmptyLinesReader,
  newMdListReader,
  newMdSectionReader,
} from "../../src/index.ts";
import { newMdFencedBlocksReader } from "../../src/md/fenced-blocks.ts";
import { newTestRunner } from "../utils/newTestRunner.ts";
import { newTokenizerTest } from "../utils/newTokenizerTest.ts";

Promise.resolve().then(main).catch(console.error);

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

  const readListToken = newMdListReader({
    readListItemContent: readBlockContent,
  });
  blockTokenizers.push(readListToken);

  const readFencedContent = newMdFencedBlocksReader({
    readFencedContent: readBlockContent,
    readFencedAttributes: readCode,
  });
  blockTokenizers.push(readFencedContent);

  const readMdTextBlocks = newSeparateBlocksReader(readBlockContent);

  const readMdSections = newMdSectionReader({
    readHeaderTokens: isolate(readInlineContent),
    readSectionTokens: isolate(readMdTextBlocks),
  });
  const readToken = newCompositeTokenizer([readMdSections, readMdTextBlocks]);
  const runTests = newTestRunner(newTokenizerTest(readToken));
  runTests(`${import.meta.dirname}/data/separators-lists`);
}
