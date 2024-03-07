import { newCodeReader } from "../../src/index.ts";
import { newMdReader } from "../../src/md/index.ts";
import { describe, it } from "../deps.ts";
import { newBlockTest } from "../newBlockTest.ts";
import { testData } from "./md.data.ts";

describe("newMdReader", () => {
  const readCode = newCodeReader();
  // const contentTokenizers: TTokenizerMethod[] = [readCode];
  // const readContent = newCompositeTokenizer(contentTokenizers);

  const readers = {
    // html:
    //   readOpenTagTokens: readCode,
    //   readInstructionsTokens: readCode,
    //   // readTagContentTokens: readContent,

    // md:
    //   readHeaderTokens: readCode,
    //   // readSectionTokens: readContent,
    // },
    readContent: readCode,
  };

  const readToken = newMdReader(readers);
  // contentTokenizers.push(readToken);
  const test = newBlockTest(readToken);
  testData.forEach((data) => {
    it(data.description, () => {
      test(data.input, data.expected);
    });
  });
});
