import { describe, expect, it } from "../../deps.ts";
import {
  TToken,
  TokenizerContext,
  newBlockReader,
  newCharsReader,
  newCompositeTokenizer,
  newCodeReader,
} from "../../../src/tknz/index.ts";
import { testData } from "./code.data.ts";

describe("newBlockReader", () => {
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
    // This tokenizer reads individual tokens. It uses individual
    // tokenizers from the given array.
    const readContent = newCompositeTokenizer(tokenizers);

    // Code tokenizer reads the content of the code block.
    // To interpret the content of the code block, it uses the
    // content tokenizer. So the content of each code block
    // will also be tokenized.
    const readCode = newCodeReader(readContent);
    // We add the code tokenizer to the beginning of the tokenizers array.
    tokenizers.unshift(readCode);

    // The main block reader will
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
