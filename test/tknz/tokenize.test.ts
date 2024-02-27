import { describe, expect, it, beforeEach } from "../deps.ts";
import {
  TToken,
  TTokenLevel,
  Tokenizer,
  TokenizerContext,
} from "./tokenizer.ts";
import {
  readEols,
  readSpaces,
  readDigits,
  readText,
} from "./tokenizer-sequence.ts";
import { readCode } from "./tokenizer-code.ts";
import { blockTestData } from "./data.block.ts";
import { gramTestData } from "./data.gram.ts";

function readParagraph(ctx: TokenizerContext): TToken | undefined {
  const currentLevel = TTokenLevel.block;
  let list: TToken[] = [];
  let token: TToken | undefined;
  while ((token = ctx.tokenizer.gram(ctx))) {
    if (token.level >= currentLevel) {
      // ctx.resetTo(token);
      break;
    }
    if (token.type === "Eol" && token.value.length > 1) {
      ctx.resetTo(token);
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
}

function newContext(str: string, i: number = 0) {
  const tokenizer = new Tokenizer()
    .add(TTokenLevel.gram, readCode, readEols, readSpaces, readDigits, readText)
    .add(TTokenLevel.block, readParagraph);
  const ctx = new TokenizerContext(tokenizer, str, i);
  return ctx;
}

describe("Tokenizer.gram", () => {
  function testGram(
    str: string,
    before: string,
    after: string,
    control: TToken & Record<string, any>
  ) {
    const ctx = newContext(str, before.length);
    const result = ctx.tokenizer.gram(ctx);
    expect(result !== undefined).toBe(true);
    try {
      const token: TToken = result as TToken;
      expect(token).to.eql(control);
      expect(str.substring(0, token.start)).to.eql(before);
      expect(str.substring(token.end)).to.eql(after);
    } catch (error) {
      console.log(JSON.stringify(result, null, 2));
      throw error;
    }
  }
  gramTestData.forEach((data) => {
    it(data.description, () => {
      testGram(data.input, data.before, data.after, data.expected);
    });
  })
});

describe("Tokenizer.block", () => {
  function testPara(str: string, control: TToken) {
    const ctx = newContext(str);
    const result = ctx.tokenizer.block(ctx);
    try {
      expect(result !== undefined).toEqual(true);
      const token: TToken = result as TToken;
      expect(token).to.eql(control);
      expect(token.start).toEqual(0);
      expect(token.value).toEqual(str.substring(token.start, token.end));
    } catch (error) {
      console.log(JSON.stringify(result, null, 2));
      throw error;
    }
  }

  blockTestData.forEach((data) => {
    it(data.description, () => {
      testPara(data.input, data.expected);
    });
  });
});
