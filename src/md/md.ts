import {
  type TTokenizerMethod,
  isolate,
  newCompositeTokenizer,
} from "../base/index.ts";
import { type THtmlTokenizers, newHtmlReader } from "../html/index.ts";
import { newMdListReader } from "./lists.ts";
import { type TMdSectionTokenizers, newMdSectionReader } from "./sections.ts";

export type TMdTokenizers = {
  html?: THtmlTokenizers;
  md?: TMdSectionTokenizers;
  readContent: TTokenizerMethod;
};

export function newMdReader(readers: TMdTokenizers): TTokenizerMethod {
  const tagContentTokenizers: TTokenizerMethod[] = [];
  const readTagContent = newCompositeTokenizer(tagContentTokenizers);

  // const readMarkdown = newMdSectionReader(readers.md);
  const readHtml = newHtmlReader({
    ...readers.html,
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

  const readMdLists = newMdListReader(readBlockTokens);
  const readMdSections = newMdSectionReader({
    ...readers.md,
    readHeaderTokens: isolate(readInlineTokens),
    readSectionTokens: isolate(readBlockTokens),
  });

  if (readers.readContent) tagContentTokenizers.push(readers.readContent);
  tagContentTokenizers.push(readMdSections);
  tagContentTokenizers.push(readMdLists);

  // Add all tagContentTokenizers to blockTokenizers
  blockTokenizers.push(...tagContentTokenizers);

  return readBlockTokens;
}
