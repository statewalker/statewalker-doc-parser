import {
  isolate,
  newCompositeTokenizer,
  type TTokenizerMethod,
} from "../base/index.ts";
import { THtmlTokenizers, newHtmlReader } from "../html/index.ts";
import { TMdSectionTokenizers, newMdSectionReader } from "./sections.ts";

export type TMdTokenizers = {
  html: THtmlTokenizers;
  md: TMdSectionTokenizers;
  readContent: TTokenizerMethod;
};

export function newMdReader(readers: TMdTokenizers): TTokenizerMethod {
  const tokenizers: TTokenizerMethod[] = [];
  if (readers.readContent) tokenizers.push(readers.readContent);
  const readTagContent = newCompositeTokenizer(tokenizers);

  // const readMarkdown = newMdSectionReader(readers.md);
  const readHtml = newHtmlReader({
    ...readers.html,
    readTagContentTokens: readTagContent,
  });

  //
  const readMd = newMdSectionReader({
    ...readers.md,
    readHeaderTokens: isolate(readHtml),
    readSectionTokens: isolate(readHtml),
  });
  tokenizers.push(readMd);

  return newCompositeTokenizer([readMd, readHtml]);
}
