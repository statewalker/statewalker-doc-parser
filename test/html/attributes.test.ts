import { newCharsReader, newCompositeTokenizer } from "../../src/base/index.ts";
import { newCodeReader } from "../../src/code/index.ts";
import { newHtmlAttributeReader } from "../../src/html/index.ts";
import { newTestRunner } from "../utils/newTestRunner.ts";
import { newTokenizerTest } from "../utils/newTokenizerTest.ts";

Promise.resolve().then(main).catch(console.error);

async function main() {
  const readCode = newCodeReader();
  const readAttribute = newHtmlAttributeReader(readCode);
  const readEol = newCharsReader("Eol", (ch) => ch === "\n" || ch === "\r");
  const readToken = newCompositeTokenizer([readEol, readAttribute]);
  const runTests = newTestRunner(newTokenizerTest(readToken));
  runTests(`${import.meta.dirname}/data/attributes`);
}
