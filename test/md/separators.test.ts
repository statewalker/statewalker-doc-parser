import type {
  TToken,
  TTokenizerMethod,
  TokenizerContext,
} from "../../src/index.ts";
import {
  isolate,
  newBlocksSequenceReader,
  newCharReader,
  newCodeReader,
  newTokensSequenceReader,
} from "../../src/index.ts";
import { newTestRunner } from "../utils/newTestRunner.ts";
import { newTokenizerTest } from "../utils/newTokenizerTest.ts";

Promise.resolve().then(main).catch(console.error);

function newSeparateBlocksReader(
  readToken: TTokenizerMethod
): TTokenizerMethod {
  const readEol = newCharReader(
    "Eol",
    (char) => char === "\n" || char === "\r"
  );
  const readEmptyLines = newTokensSequenceReader("EmptyLines", readEol, 2);
  return newBlocksSequenceReader("TextBlock", readEmptyLines, readToken);
}

async function main() {
  const readContent = isolate(newCodeReader());
  const readToken = newSeparateBlocksReader(readContent);
  const runTests = newTestRunner(newTokenizerTest(readToken));
  runTests(`${import.meta.dirname}/data/separators`);
}
