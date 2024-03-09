import { newCodeReader } from "../../src/index.ts";
import { newMdReader } from "../../src/md/index.ts";
import { describe } from "../deps.ts";
import { newBlockTest, runBlockTests } from "../newBlockTest.ts";
import { testData } from "./md.data.ts";

describe("newMdReader", async () => {
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
  runBlockTests(test, testData);
});
