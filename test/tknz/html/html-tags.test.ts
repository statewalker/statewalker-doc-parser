import { TokenizerContext } from "../../../src/tknz/base/index.ts";
import { newCodeReader } from "../../../src/tknz/code/index.ts";
import { newHtmlOpenTagReader } from "../../../src/tknz/html/index.ts";
import { describe, expect, it } from "../../deps.ts";
import { newBlockTest } from "./newBlockTest.ts";
import { testData } from "./html-tags.data.ts";

describe("readHtmlTag", () => {
  const readCode = newCodeReader();
  const readToken = newHtmlOpenTagReader(readCode);
  const test = newBlockTest(readToken);

  testData.forEach((data) => {
    it(data.description, () => {
      test(data.input, data.expected);
    });
  });
  
});
