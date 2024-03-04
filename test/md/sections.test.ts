import { newCodeReader } from "../../src/index.ts";
import { newMdSectionReader } from "../../src/md/index.ts";
import { describe, it } from "../deps.ts";
import { newBlockTest } from "../newBlockTest.ts";
import { testData } from "./sections.data.ts";

describe("newMdSectionsReader", () => {
  const readCode = newCodeReader();
  const readToken = newMdSectionReader({
    readHeaderTokens: readCode,
    readSectionTokens: readCode,
  });
  const test = newBlockTest(readToken);
  testData.forEach((data) => {
    it(data.description, () => {
      test(data.input, data.expected);
    });
  });
});
