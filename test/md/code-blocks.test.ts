import { newCodeReader } from "../../src/index.ts";
import { newMdCodeBlockReader } from "../../src/md/code-blocks.ts";
import { newTestRunner } from "../utils/newTestRunner.ts";
import { newTokenizerTest } from "../utils/newTokenizerTest.ts";

Promise.resolve().then(main).catch(console.error);

async function main() {
  const readContent = newCodeReader();
  const readToken = newMdCodeBlockReader({
    readCodeBlockContent: readContent,
  });
  const runTests = newTestRunner(newTokenizerTest(readToken));
  runTests(`${import.meta.dirname}/data/code-blocks`);
}
