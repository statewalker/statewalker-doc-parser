import {
  newCharsReader,
  newCompositeTokenizer,
} from "../../../src/tknz/base/index.ts";
import { newCodeReader } from "../../../src/tknz/code/index.ts";
import { newHtmlAttributeReader, newHtmlOpenTagReader } from "../../../src/tknz/html/index.ts";
import { describe, it } from "../../deps.ts";
import { newBlockTest } from "./newBlockTest.ts";
import { testData } from "./attributes.data.ts";

describe("readHtmlTag", () => {
  const readCode = newCodeReader();
  const readToken = newHtmlAttributeReader(readCode);
  const readEol = newCharsReader("Eol", (ch) => ch === "\n" || ch === "\r");
  const test = newBlockTest(newCompositeTokenizer([readEol, readToken]));

  testData.forEach((data) => {
    it(data.description, () => {
      test(data.input, data.expected);
    });
  });
});
