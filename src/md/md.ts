import {
  type TTokenizerMethod,
  isolate,
  newCompositeTokenizer,
} from "../base/index.ts";
import { type THtmlTokenizers, newHtmlReader } from "../html/index.ts";
import {
  newMdCodeBlockReader,
  type TMdCodeBlockTokenizers,
} from "./code-blocks.ts";
import type { TMdListTokenizers } from "./lists.ts";
import { newMdListReader, readListItemMarker } from "./lists.ts";
import { type TMdSectionTokenizers, newMdSectionReader } from "./sections.ts";

export type TMdTokenizers = THtmlTokenizers &
  TMdSectionTokenizers &
  TMdCodeBlockTokenizers &
  (Omit<TMdListTokenizers, "readListItemMarker"> & {
    readListItemMarker?: TTokenizerMethod;
  }) & {
    readContent?: TTokenizerMethod;
  };

export function newMdReader(readers: TMdTokenizers = {}): TTokenizerMethod {
  const tagContentTokenizers: TTokenizerMethod[] = [];
  const readTagContent = newCompositeTokenizer(tagContentTokenizers);

  // const readMarkdown = newMdSectionReader(readers.md);
  const readHtml = newHtmlReader({
    ...readers,
    readTagContentTokens: readTagContent,
  });

  //
  const inlineTokenizers = [readHtml];
  const readInlineTokens = newCompositeTokenizer(inlineTokenizers);
  if (readers.readContent) {
    inlineTokenizers.push(readers.readContent);
  }

  const blockTokenizers = [readHtml];
  const readBlockTokens = newCompositeTokenizer(blockTokenizers);

  const readMdLists = newMdListReader({
    readListItemMarker,
    // Allow to override the list markers
    ...readers,
    // Allow to add the list content reading markers
    readListItemContent: readers.readListItemContent
      ? newCompositeTokenizer([readers.readListItemContent, readBlockTokens])
      : readBlockTokens,
  });

  const readMdCodeBlocks = newMdCodeBlockReader({
    ...readers,
    readCodeBlockContent: readers.readCodeBlockContent || readers.readContent,
  });

  const readMdSections = newMdSectionReader({
    ...readers,
    readHeaderTokens: isolate(readInlineTokens),
    readSectionTokens: isolate(readBlockTokens),
  });

  if (readers.readContent) tagContentTokenizers.push(readers.readContent);
  tagContentTokenizers.push(readMdSections);
  tagContentTokenizers.push(readMdCodeBlocks);
  tagContentTokenizers.push(readMdLists);

  // Add all tagContentTokenizers to blockTokenizers
  blockTokenizers.push(...tagContentTokenizers);

  return readBlockTokens;
}
