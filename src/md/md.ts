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
  if (readers.readContent) tagContentTokenizers.push(readers.readContent);
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
  if (readers.readContent) {
    blockTokenizers.push(readers.readContent);
  }

  const readMdSections = newMdSectionReader({
    ...readers.md,
    readHeaderTokens: isolate(readInlineTokens),
    readSectionTokens: isolate(readBlockTokens),
  });
  tagContentTokenizers.push(readMdSections);
  blockTokenizers.push(readMdSections);
  blockTokenizers.push(newMdListReader(readBlockTokens));

  const mainTokenizers = [readMdSections, readHtml];
  const readTokens = newCompositeTokenizer(mainTokenizers);
  return readTokens;
}
