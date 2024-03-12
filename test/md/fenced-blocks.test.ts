import { newMdFencedBlocksReader } from "../../src/md/fenced-blocks.ts";
import { newTestRunner } from "../utils/newTestRunner.ts";
import { newTokenizerTest } from "../utils/newTokenizerTest.ts";

Promise.resolve().then(main).catch(console.error);

async function main() {
  const readToken = newMdFencedBlocksReader();

  const runTests = newTestRunner(newTokenizerTest(readToken));
  runTests(`${import.meta.dirname}/data/fenced-blocks`);
}
