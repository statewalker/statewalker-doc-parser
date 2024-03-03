import { newCodeReader } from "../../src/code/index.ts";
import { newHtmlReader } from "../../src/html/index.ts";
import { describe, it } from "../deps.ts";
import { newBlockTest } from "../newBlockTest.ts";
import { testData } from "./html.data.ts";

describe("newHtmlReader", () => {
  const readCode = newCodeReader();
  const test = newBlockTest(newHtmlReader(readCode));
  testData.forEach((data) => {
    it(data.description, () => {
      test(data.input, data.expected);
    });
  });
});
