import {
  type TTokenizerMethod,
  isolate,
  newBlocksSequenceReader,
  newCompositeTokenizer,
  newEmptyLinesReader,
} from "../base/index.ts";
import { type THtmlTokenizers, newHtmlReader } from "../html/index.ts";

import type { TMdCodeBlockTokenizers } from "./code-blocks.ts";
import { newMdCodeBlockReader } from "./code-blocks.ts";

import type { TMdFencedBlockTokenizers } from "./fenced-blocks.ts";
import { newMdFencedBlocksReader } from "./fenced-blocks.ts";
import type { TMdListTokenizers } from "./lists.ts";
import { newMdListReader } from "./lists.ts";
import { type TMdSectionTokenizers, newMdSectionReader } from "./sections.ts";

export type TMdTokenizers = THtmlTokenizers &
  TMdSectionTokenizers &
  TMdCodeBlockTokenizers &
  (Omit<TMdListTokenizers, "readListItemMarker"> & {
    readListItemMarker?: TTokenizerMethod;
  }) &
  TMdFencedBlockTokenizers & {
    readInlineCode?: TTokenizerMethod;
    readBlockCode?: TTokenizerMethod;

    readInlineContent?: TTokenizerMethod;
    readBlockContent?: TTokenizerMethod;
    readContent?: TTokenizerMethod;
  };

export function newMdReader(readers: TMdTokenizers = {}): TTokenizerMethod {
  // readers.readInlineContent = readers.readInlineContent || readers.readContent;
  readers.readBlockContent = readers.readBlockContent || readers.readContent;

  const inlineTokenizers: TTokenizerMethod[] = [];
  const readInlineContent = newCompositeTokenizer(inlineTokenizers);
  readers.readInlineCode && inlineTokenizers.push(readers.readInlineCode);
  readers.readInlineContent && inlineTokenizers.push(readers.readInlineContent);

  const blockTokenizers: TTokenizerMethod[] = [];
  const readBlockContent = newCompositeTokenizer(blockTokenizers);
  readers.readBlockContent && blockTokenizers.push(readers.readBlockContent);
  readers.readBlockCode && blockTokenizers.push(readers.readBlockCode);

  // -------------------------------------------------------

  const readMdFencedBlocks = newMdFencedBlocksReader({
    ...readers,
    // Allow to add the list content reading markers
    readFencedContent: readBlockContent,
    readFencedAttributes: readers.readInlineCode,
  });
  blockTokenizers.push(readMdFencedBlocks);

  // -------------------------------------------------------

  const readMdCodeBlocks = newMdCodeBlockReader({
    ...readers,
    readCodeBlockContent: readers.readCodeBlockContent,
  });
  blockTokenizers.push(readMdCodeBlocks);

  // -------------------------------------------------------

  const readMdLists = newMdListReader({
    readListItemContent: readBlockContent,
    // readListItemMarker: readMdListItemMarker,

    // ------
    // // Allow to override the list markers
    // ...readers,
    // // Allow to add the list content reading markers
    // readListItemContent: composeReaders(
    //   readers.readListItemContent,
    //   readBlockContent
    // ),
  });
  blockTokenizers.push(readMdLists);

  // -------------------------------------------------------

  const readInlineTags = newHtmlReader({
    ...readers,
    readTagContentTokens: composeReaders(
      readers.readTagContentTokens,
      readInlineContent
    ),
  });
  inlineTokenizers.push(isolate(readInlineTags));

  // -------------------------------------------------------

  const readBlockTags = newHtmlReader({
    ...readers,
    readTagContentTokens: composeReaders(
      readers.readTagContentTokens,
      readBlockContent
    ),
  });
  blockTokenizers.push(isolate(readBlockTags));

  // -------------------------------------------------------

  const readEmptyLines = newEmptyLinesReader();
  const readMdTextBlocks = newBlocksSequenceReader(
    "MdTextBlock",
    readEmptyLines,
    readBlockContent
  );
  const readMdSections = newMdSectionReader({
    readHeaderTokens: readInlineContent,
    readSectionTokens: readMdTextBlocks,
  });
  blockTokenizers.push(readMdSections);

  return readBlockContent;
  // -------------------------------------------------------
}

function composeReaders(
  ...tokenizers: (TTokenizerMethod | undefined)[]
): TTokenizerMethod {
  const list = tokenizers.filter(Boolean) as TTokenizerMethod[];
  return list.length !== 1 ? newCompositeTokenizer(list) : list[0];
}
