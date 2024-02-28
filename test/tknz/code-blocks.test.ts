import { describe, expect, it } from "../deps.ts";
import {
  TToken,
  TTokenLevel,
  TTokenizerMethod,
  TokenizerContext,
} from "../../src/tknz/tokenizer.ts";
import { testData } from "./code-blocks.data.ts";
import { newNgramsWithCode } from "../../src/tknz/blocks.ts";

function newBlockReader(nextToken: TTokenizerMethod): TTokenizerMethod {
  return (ctx: TokenizerContext): TToken | undefined => {
    const currentLevel = TTokenLevel.block;
    let list: TToken[] = [];
    let token: TToken | undefined;
    while ((token = nextToken(ctx))) {
      if (token.level >= currentLevel) {
        break;
      }
      if (token.type === "Eol" && token.value.length > 1) {
        ctx.i = token.start;
        break;
      }
      list.push(token);
    }
    if (!list.length) return;
    const start = list[0].start;
    const end = list[list.length - 1].end;
    return {
      level: currentLevel,
      type: "Block",
      start,
      end,
      value: ctx.substring(start, end),
      children: list,
    };
  };
}

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
