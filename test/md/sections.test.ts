import { newCodeReader } from "../../src/index.ts";
import { newMdSectionReader } from "../../src/md/index.ts";
import { newTestRunner } from "../utils/newTestRunner.ts";
import { newTokenizerTest } from "../utils/newTokenizerTest.ts";

Promise.resolve().then(main).catch(console.error);

async function main() {
  const readCode = newCodeReader();
  const readToken = newMdSectionReader({
    readHeaderTokens: readCode,
    readSectionTokens: readCode,
  });
  const runTests = newTestRunner(newTokenizerTest(readToken));
  runTests(`${import.meta.dirname}/data/sections`);
}
