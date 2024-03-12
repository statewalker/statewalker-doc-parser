import { newCharsReader, newCompositeTokenizer } from "../../src/base/index.ts";
import { newCodeReader } from "../../src/index.ts";
import { newTestRunner } from "../utils/newTestRunner.ts";
import { newTokenizerTest } from "../utils/newTokenizerTest.ts";

Promise.resolve().then(main).catch(console.error);

async function main() {
  const tokenizers = [
    newCharsReader("Punctuation", (char) => !!char.match(/\p{P}/u)),
    newCharsReader("Digits", (char) => !!char.match(/[0-9]/u)),
    newCharsReader("Word", (char) => !!char.match(/\w/u)),
    newCharsReader("Eol", (char) => !!char.match(/[\r\n]/u)),
    newCharsReader(
      "Spaces",
      (char) => !!char.match(/\s/u) && !char.match(/[\r\n]/u)
    ),
  ];
  // This tokenizer reads individual tokens. It uses individual
  // tokenizers from the given array.
  const readToken = newCompositeTokenizer(tokenizers);

  // Code tokenizer reads the content of the code block.
  // To interpret the content of the code block, it uses the
  // content tokenizer. So the content of each code block
  // will also be tokenized.
  const readCode = newCodeReader(readToken);
  // We add the code tokenizer to the beginning of the tokenizers array.
  tokenizers.unshift(readCode);

  const runTests = newTestRunner(newTokenizerTest(readToken));
  runTests(`${import.meta.dirname}/data/code`);
}
