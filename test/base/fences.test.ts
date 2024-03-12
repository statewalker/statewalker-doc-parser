import {
  type TTokenizerMethod,
  newCharReader,
  newCompositeTokenizer,
  newFencedBlockReader,
} from "../../src/base/index.ts";
import { newTestRunner } from "../utils/newTestRunner.ts";
import { newTokenizerTest } from "../utils/newTokenizerTest.ts";

Promise.resolve().then(main).catch(console.error);

async function main() {
  const tokenizers: TTokenizerMethod[] = [];
  const readToken = newCompositeTokenizer(tokenizers);

  // This tokenizer reads the content of blocks between paranthesis.
  const readParanthesis = newFencedBlockReader(
    "Paranthesis",
    newCharReader("OpenParathesis", (char) => char === "("),
    readToken,
    newCharReader("CloseParathesis", (char) => char === ")")
  );
  // Add this tokenizer to the content reader.
  tokenizers.unshift(readParanthesis);

  // This tokenizer reads the content of blocks between brackets.
  const readBrackets = newFencedBlockReader(
    "Brackets",
    newCharReader("OpenBrackets", (char) => char === "["),
    readToken,
    newCharReader("CloseBrackets", (char) => char === "]")
  );
  // Add this tokenizer to the content reader.
  tokenizers.unshift(readBrackets);

  // This tokenizer reads the content of blocks between curly brackets.
  const readCurlyBrackets = newFencedBlockReader(
    "CurlyBrackets",
    newCharReader("OpenCurlyBrackets", (char) => char === "{"),
    readToken,
    newCharReader("CloseCurlyBrackets", (char) => char === "}")
  );
  // Add this tokenizer to the content reader.
  tokenizers.unshift(readCurlyBrackets);

  const runTests = newTestRunner(newTokenizerTest(readToken));
  runTests(`${import.meta.dirname}/data/fences`);
}
