import {
  isEol,
  newCharsReader,
  newCompositeTokenizer,
} from "../../src/base/index.ts";
import {
  newHtmlCloseTagReader,
  newHtmlOpenTagReader,
} from "../../src/html/index.ts";
import { newCodeReader } from "../../src/index.ts";

import { newTestRunner } from "../utils/newTestRunner.ts";
import { newTokenizerTest } from "../utils/newTokenizerTest.ts";

Promise.resolve().then(main).catch(console.error);

async function main() {
  const readCode = newCodeReader();
  const readToken = newCompositeTokenizer([
    newCharsReader("Eol", isEol),
    newHtmlOpenTagReader(readCode),
    newHtmlCloseTagReader(),
  ]);
  const runTests = newTestRunner(newTokenizerTest(readToken));
  runTests(`${import.meta.dirname}/data/tags`);
}
