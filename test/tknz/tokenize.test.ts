import { describe, expect, it, beforeEach } from "../deps.ts";
import {
  TToken,
  TTokenLevel,
  TTokenizerMethod,
  TokenizerContext,
  newCompositeTokenizer,
} from "./tokenizer.ts";
import { newNgramsReader } from "./tokenizer-sequence.ts";
import { newCodeReader } from "./tokenizer-code.ts";
import { blockTestData } from "./data.block.ts";
import { gramTestData } from "./data.gram.ts";

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

function newNgramsWithCode() {
  const readNgrams = newNgramsReader();
  const readCode = newCodeReader(readNgrams);
  return newCompositeTokenizer(readCode, readNgrams);
}

describe("Tokenizer.gram", () => {
  function testGram(
    str: string,
    before: string,
    after: string,
    control: TToken & Record<string, any>
  ) {
    const ctx = new TokenizerContext(str, before.length);
    const readToken = newNgramsWithCode();
    const result = readToken(ctx);
    expect(result !== undefined).toBe(true);
    try {
      const token: TToken = result as TToken;
      expect(token).to.eql(control);
      expect(str.substring(0, token.start)).to.eql(before);
      expect(str.substring(token.end)).to.eql(after);
    } catch (error) {
      console.log(JSON.stringify(result));
      // console.log(JSON.stringify(result, null, 2));
      throw error;
    }
  }
  gramTestData.forEach((data) => {
    it(data.description, () => {
      testGram(data.input, data.before, data.after, data.expected);
    });
  });
});

describe("Tokenizer.block", () => {
  function testPara(str: string, control: TToken) {
    const ctx = new TokenizerContext(str);
    const readNgramsWithCode = newNgramsWithCode();
    const readToken = newBlockReader(readNgramsWithCode);
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

  blockTestData.forEach((data) => {
    it(data.description, () => {
      testPara(data.input, data.expected);
    });
  });
});
