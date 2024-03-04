import {
  type TToken,
  TokenizerContext,
  newBlockReader,
  newCharReader,
  newCharsReader,
  newCompositeTokenizer,
  newFencedBlockReader,
} from "../../src/base/index.ts";
import { describe, expect, it } from "../deps.ts";
import { testData } from "./fences-with-content.data.ts";

/**
 * This test suite is testing hierarchical blocks creation using
 * newFencedBlockReader and newBlockReader.
 */
describe("newFencedBlockReader", () => {
  function testPara(str: string, control: TToken) {
    const ctx = new TokenizerContext(str);
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

    // Now we can create the main block reader.
    // It will recognize the paranthesis, brackets and curly brackets blocks.
    const readToken = newBlockReader("Block", readContent);
    const result = readToken(ctx);
    try {
      expect(result !== undefined).toEqual(true);
      const token: TToken = result as TToken;
      expect(token).to.eql(control);
      expect(token.start).toEqual(0);
      expect(token.value).toEqual(str.substring(token.start, token.end));
    } catch (error) {
      console.log(JSON.stringify(result));
      // console.log(JSON.stringify(result, null, 2));
      throw error;
    }
  }

  testData.forEach((data) => {
    it(data.description, () => {
      testPara(data.input, data.expected);
    });
  });
});
