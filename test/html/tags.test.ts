import { newCharsReader, newCompositeTokenizer } from "../../src/base/index.ts";
import { newCodeReader } from "../../src/code/index.ts";
import { newHtmlOpenTagReader } from "../../src/html/index.ts";
import { describe, it } from "../deps.ts";
import { newBlockTest } from "./newBlockTest.ts";
import { testData } from "./tags.data.ts";

describe("readHtmlTag", () => {
  const readCode = newCodeReader();
  const readToken = newHtmlOpenTagReader(readCode);
  const readEol = newCharsReader("Eol", (ch) => ch === "\n" || ch === "\r");
  const test = newBlockTest(newCompositeTokenizer([readEol, readToken]));

  testData.forEach((data) => {
    it(data.description, () => {
      test(data.input, data.expected);
    });
  });
});
