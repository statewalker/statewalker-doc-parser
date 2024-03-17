import { newCodeReader } from "../../src/index.ts";
import { newMdTableReader } from "../../src/md/tables.ts";
import { newTestRunner } from "../utils/newTestRunner.ts";
import { newTokenizerTest } from "../utils/newTokenizerTest.ts";

Promise.resolve().then(main).catch(console.error);

async function main() {
  const readTableCellContent = newCodeReader();
  const readToken = newMdTableReader({
    readTableCellContent,
  });
  const runTests = newTestRunner(newTokenizerTest(readToken));
  runTests(`${import.meta.dirname}/data/tables`);
}
