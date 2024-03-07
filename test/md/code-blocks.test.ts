import { newCodeReader } from "../../src/index.ts";
import { newMdCodeBlockReader } from "../../src/md/code-blocks.ts";
import { describe, it } from "../deps.ts";
import { newBlockTest } from "../newBlockTest.ts";

import { testData } from "./code-blocks.data.ts";

describe("newMdCodeBlocksReader", () => {
  const readContent = newCodeReader();
  const readToken = newMdCodeBlockReader({
    readCodeBlockContent: readContent,
  });
  const test = newBlockTest(readToken);
  testData.forEach((data) => {
    it(data.description, () => {
      test(data.input, data.expected);
    });
  });
});
