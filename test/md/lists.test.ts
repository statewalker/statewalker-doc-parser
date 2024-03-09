import { newMdListReader, readMdListItemMarker } from "../../src/index.ts";
import { describe, it } from "../deps.ts";
import { newBlockTest } from "../newBlockTest.ts";

import { testData } from "./lists.data.ts";

describe("newMdListReader", () => {
  const readToken = newMdListReader({
    readListItemMarker: readMdListItemMarker,
  });
  const test = newBlockTest(readToken);
  testData.forEach((data) => {
    it(data.description, () => {
      test(data.input, data.expected);
    });
  });
});
