import { newCodeReader } from "../../src/code/index.ts";
import { newHtmlReader } from "../../src/html/index.ts";
import { newTestRunner } from "../utils/newTestRunner.ts";
import { newTokenizerTest } from "../utils/newTokenizerTest.ts";

Promise.resolve().then(main).catch(console.error);

async function main() {
  const readCode = newCodeReader();
  const readToken = newHtmlReader({
    readOpenTagTokens: readCode,
    readInstructionsTokens: readCode,
    readTagContentTokens: readCode,
  });
  const runTests = newTestRunner(newTokenizerTest(readToken));
  runTests(`${import.meta.dirname}/data/html`);
}
