import {
  type TTokenizerMethod,
  isolate,
  newCompositeTokenizer,
} from "../base/index.ts";
import { type THtmlTokenizers, newHtmlReader } from "../html/index.ts";
import {
  type TMdCodeBlockTokenizers,
  newMdCodeBlockReader,
} from "./code-blocks.ts";
import type { TMdFencedBlockTokenizers } from "./fenced-blocks.ts";
import { newMdFencedBlocksReader } from "./fenced-blocks.ts";
import type { TMdListTokenizers } from "./lists.ts";
import { newMdListReader, readMdListItemMarker } from "./lists.ts";
import { type TMdSectionTokenizers, newMdSectionReader } from "./sections.ts";

export type TMdTokenizers = THtmlTokenizers &
  TMdSectionTokenizers &
  TMdCodeBlockTokenizers &
  (Omit<TMdListTokenizers, "readListItemMarker"> & {
    readListItemMarker?: TTokenizerMethod;
  }) &
  TMdFencedBlockTokenizers & {
    readContent?: TTokenizerMethod;
  };

export function newMdReader(readers: TMdTokenizers = {}): TTokenizerMethod {
  const tagContentTokenizers: TTokenizerMethod[] = [];
  if (readers.readContent) tagContentTokenizers.push(readers.readContent);

  const readTagContent = newCompositeTokenizer(tagContentTokenizers);

  // const readMarkdown = newMdSectionReader(readers.md);
  const readHtml = newHtmlReader({
    ...readers,
    readTagContentTokens: readTagContent,
  });

  // -------------------------------------------------------

  const inlineTokenizers = [readHtml];
  const readInlineTokens = newCompositeTokenizer(inlineTokenizers);
  if (readers.readContent) {
    inlineTokenizers.push(readers.readContent);
  }

  const blockTokenizers = [readHtml];
  const readBlockTokens = newCompositeTokenizer(blockTokenizers);

  // -------------------------------------------------------

  const readMdSections = newMdSectionReader({
    ...readers,
    readHeaderTokens: isolate(readInlineTokens),
    readSectionTokens: isolate(readBlockTokens),
  });
  tagContentTokenizers.push(readMdSections);

  // -------------------------------------------------------

  const readMdFencedBlocks = newMdFencedBlocksReader({
    ...readers,
    // Allow to add the list content reading markers
    readFencedContent: composeReaders(
      readers.readFencedContent,
      readBlockTokens
    ),
    readFencedAttributes: composeReaders(
      readers.readFencedAttributes,
      readBlockTokens // FIXME: It should be a code reader
    ),
  });
  tagContentTokenizers.push(readMdFencedBlocks);

  // -------------------------------------------------------

  const readMdLists = newMdListReader({
    readListItemMarker: readMdListItemMarker,
    // Allow to override the list markers
    ...readers,
    // Allow to add the list content reading markers
    readListItemContent: composeReaders(
      readers.readListItemContent,
      readBlockTokens
    ),
  });
  tagContentTokenizers.push(readMdLists);

  // -------------------------------------------------------

  const readMdCodeBlocks = newMdCodeBlockReader({
    ...readers,
    readCodeBlockContent: readers.readCodeBlockContent || readers.readContent,
  });
  tagContentTokenizers.push(readMdCodeBlocks);

  // -------------------------------------------------------

  // Add all tagContentTokenizers to blockTokenizers
  blockTokenizers.push(...tagContentTokenizers);

  return readBlockTokens;
}

function composeReaders(
  ...tokenizers: (TTokenizerMethod | undefined)[]
): TTokenizerMethod {
  const list = tokenizers.filter(Boolean) as TTokenizerMethod[];
  return list.length !== 1 ? newCompositeTokenizer(list) : list[0];
}
