import { describe, expect, it } from "../../deps.ts";
import {
  type TToken,
  TokenizerContext,
  newBlockReader,
  newCharsReader,
  newCompositeTokenizer,
} from "../../../src/tknz/base/index.ts";
import { testData } from "./block.data.ts";

describe("newBlockReader", () => {
  function testPara(str: string, control: TToken) {
    const ctx = new TokenizerContext(str);
    /**
     * This tokenizer reads individual tokens.
     * It utilizes tokenizers from the given array.
     * If some characters are not recognized by any of the tokenizers,
     * they will be skipped, resulting in the token covering
     * the entire string with found tokens as its children.
     */
    const readToken = newBlockReader(
      "Block",
      newCompositeTokenizer([
        newCharsReader("Punctuation", (char) => !!char.match(/\p{P}/u)),
        newCharsReader("Digits", (char) => !!char.match(/[0-9]/u)),
        newCharsReader("Word", (char) => !!char.match(/\w/u)),
        newCharsReader("Eol", (char) => !!char.match(/[\r\n]/u)),
        newCharsReader("Spaces", (char) => !!char.match(/\s/u)),
      ])
    );
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
