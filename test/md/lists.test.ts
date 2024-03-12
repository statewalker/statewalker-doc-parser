import { newMdListReader, readMdListItemMarker } from "../../src/index.ts";
import { newTestRunner } from "../utils/newTestRunner.ts";
import { newTokenizerTest } from "../utils/newTokenizerTest.ts";

Promise.resolve().then(main).catch(console.error);

async function main() {
  const readToken = newMdListReader({
    readListItemMarker: readMdListItemMarker,
  });
  const runTests = newTestRunner(newTokenizerTest(readToken));
  runTests(`${import.meta.dirname}/data/lists`);
}