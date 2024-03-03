import { describe, it } from "../deps.ts";
import { newBlockTest } from "../newBlockTest.ts";
import { testData } from "./headers.data.ts";
import { newCodeReader } from "../../src/index.ts";
import { newMdHeaderReader } from "../../src/md/index.ts";

describe("newMdHeaderReader", () => {
  const readCode = newCodeReader();
  const readToken = newMdHeaderReader(readCode);
  const test = newBlockTest(readToken);
  testData.forEach((data) => {
    it(data.description, () => {
      test(data.input, data.expected);
    });
  });
});
