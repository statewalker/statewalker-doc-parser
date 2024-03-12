import { newCharReader, newFencedBlockReader } from "../../src/base/index.ts";
import { newCharsReader, newCompositeTokenizer } from "../../src/base/index.ts";
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

  const readContent = newCompositeTokenizer(tokenizers);

  // This tokenizer reads the content of blocks between paranthesis.
  const readParanthesis = newFencedBlockReader(
    "Paranthesis",
    newCharReader("OpenParathesis", (char) => char === "("),
    readContent,
    newCharReader("CloseParathesis", (char) => char === ")")
  );
  // Add this tokenizer to the content reader.
  tokenizers.unshift(readParanthesis);

  // This tokenizer reads the content of blocks between brackets.
  const readBrackets = newFencedBlockReader(
    "Brackets",
    newCharReader("OpenBrackets", (char) => char === "["),
    readContent,
    newCharReader("CloseBrackets", (char) => char === "]")
  );
  // Add this tokenizer to the content reader.
  tokenizers.unshift(readBrackets);

  // This tokenizer reads the content of blocks between curly brackets.
  const readCurlyBrackets = newFencedBlockReader(
    "CurlyBrackets",
    newCharReader("OpenCurlyBrackets", (char) => char === "{"),
    readContent,
    newCharReader("CloseCurlyBrackets", (char) => char === "}")
  );
  // Add this tokenizer to the content reader.
  tokenizers.unshift(readCurlyBrackets);

  const runTests = newTestRunner(newTokenizerTest(readContent));
  runTests(`${import.meta.dirname}/data/fences-with-content`);
}
