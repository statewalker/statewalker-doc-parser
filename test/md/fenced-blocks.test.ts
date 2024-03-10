import { newMdFencedBlocksReader } from "../../src/md/fenced-blocks.ts";
import { describe } from "../deps.ts";
import { newBlockTest, runBlockTests } from "../newBlockTest.ts";

import { testData } from "./fenced-blocks.data.ts";

describe("newMdFencedList", () => {
  const readToken = newMdFencedBlocksReader();
  const test = newBlockTest(readToken);
  runBlockTests(test, testData);
  // testData.forEach((data) => {
  //   it(data.description, () => {
  //     test(data.input, data.expected);
  //   });
  // });
});
