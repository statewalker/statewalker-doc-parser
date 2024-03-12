import { newCharsReader, newCompositeTokenizer } from "../../src/base/index.ts";
import { newTestRunner } from "../utils/newTestRunner.ts";
import { newTokenizerTest } from "../utils/newTokenizerTest.ts";

Promise.resolve().then(main).catch(console.error);

async function main() {
  /**
   * This tokenizer reads individual tokens.
   * It utilizes tokenizers from the given array.
   * If some characters are not recognized by any of the tokenizers,
   * they will be skipped, resulting in the token covering
   * the entire string with found tokens as its children.
   */
  const readToken = newCompositeTokenizer([
    newCharsReader("Punctuation", (char) => !!char.match(/\p{P}/u)),
    newCharsReader("Digits", (char) => !!char.match(/[0-9]/u)),
    newCharsReader("Word", (char) => !!char.match(/\w/u)),
    newCharsReader("Eol", (char) => !!char.match(/[\r\n]/u)),
    newCharsReader(
      "Spaces",
      (char) => !!char.match(/\s/u) && !char.match(/[\r\n]/u)
    ),
  ]);
  const runTests = newTestRunner(newTokenizerTest(readToken));
  runTests(`${import.meta.dirname}/data/blocks-with-content`);
}
