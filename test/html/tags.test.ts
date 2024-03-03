import {
  isEol,
  newCharsReader,
  newCompositeTokenizer,
} from "../../src/base/index.ts";
import { newCodeReader } from "../../src/code/index.ts";
import {
  newHtmlCloseTagReader,
  newHtmlOpenTagReader,
} from "../../src/html/index.ts";
import { describe, it } from "../deps.ts";
import { newBlockTest } from "../newBlockTest.ts";
import { testData } from "./tags.data.ts";

describe("readHtmlTag", () => {
  const readCode = newCodeReader();
  const test = newBlockTest(
    newCompositeTokenizer([
      newCharsReader("Eol", isEol),
      newHtmlOpenTagReader(readCode),
      newHtmlCloseTagReader(),
    ])
  );

  testData.forEach((data) => {
    it(data.description, () => {
      test(data.input, data.expected);
    });
  });
});
