import { describe, expect, it } from "../../deps.ts";
import { TToken, TokenizerContext } from "../../../src/tknz/base/index.ts";
import { newNgramsWithCode } from "./newNgramsWithCode.ts";
import { testData } from "./ngrams-code-blocks.data.ts";

function test(str: string, control: TToken) {
  const ctx = new TokenizerContext(str);
  const readToken = newNgramsWithCode();
  let result: TToken[] = [];
  try {
    let token: TToken | undefined;
    while ((token = readToken(ctx))) {
      result.push(token);
    }
    expect(result !== undefined).toEqual(true);
    expect(result).to.eql(control);
  } catch (error) {
    console.log(JSON.stringify(result));
    // console.log(JSON.stringify(result, null, 2));
    throw error;
  }
}

describe("code.block", () => {
  testData.forEach((data) => {
    it(data.description, () => {
      test(data.input, data.expected);
    });
  });
});
