import { describe, expect, it } from "../deps.ts";
import {
  type TToken,
  TokenizerContext,
  newBlockReader,
} from "../../src/base/index.ts";

describe("newBlockReader", () => {
  // Recognize emojis like :-), :-(, :-|, :-], :-[, ;-), ;-(
  function readEmojis(ctx: TokenizerContext) {
    return ctx.guard(() => {
      const start = ctx.i;
      if ([":", ";"].indexOf(ctx.getChar(+0)) < 0) return;
      if (ctx.getChar(+1) !== "-") return;
      if ([")", "(", "]", "[", "|"].indexOf(ctx.getChar(+2)) < 0) return;
      ctx.i += 3;
      const end = ctx.i;
      return {
        type: "Emoji",
        start,
        end,
        value: ctx.str.substring(start, end),
      };
    });
  }

  function test(str: string, control: TToken) {
    const ctx = new TokenizerContext(str);
    const readToken = newBlockReader("Block", readEmojis);
    const result = readToken(ctx);
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

  it(`should read the text and recognize emojis`, () => {
    test("Hello World :-)!", {
      type: "Block",
      start: 0,
      end: 16,
      value: "Hello World :-)!",
      children: [{ type: "Emoji", start: 12, end: 15, value: ":-)" }],
    });
  });

  it(`should read the text and recognize multiple emojis`, () => {
    test("A:-)B:-|C:-(D", {
      type: "Block",
      start: 0,
      end: 13,
      value: "A:-)B:-|C:-(D",
      children: [
        { type: "Emoji", start: 1, end: 4, value: ":-)" },
        { type: "Emoji", start: 5, end: 8, value: ":-|" },
        { type: "Emoji", start: 9, end: 12, value: ":-(" },
      ],
    });
  });
});
