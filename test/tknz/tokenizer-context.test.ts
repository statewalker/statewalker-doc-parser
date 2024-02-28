import { describe, expect, it } from "../deps.ts";
import {
  TToken,
  TTokenizerMethod,
  TokenizerContext,
  newCompositeTokenizer,
} from "../../src/tknz/tokenizer.ts";
import {
  CHAR_ANY,
  CHAR_EOL,
  CHAR_PUNCTUATION,
  CHAR_SPACE,
} from "../../src/tknz/chars.ts";
import { readHtmlName } from "../../src/tknz/html-names.ts";
import { newBlockReader, newFencedBlockReader } from "../../src/tknz/blocks.ts";

function readCodeStart(ctx: TokenizerContext): TToken | undefined {
  if (ctx.getChar(+0) !== "$" || ctx.getChar(+1) !== "{") return;
  const start = ctx.i;
  ctx.i += 2;
  const end = ctx.i;
  return {
    type: "CodeStart",
    start,
    end,
    value: ctx.substring(start, end),
  };
}

function readCodeEnd(ctx: TokenizerContext): TToken | undefined {
  if (ctx.getChar() !== "}") return;
  const start = ctx.i;
  ctx.i++;
  const end = ctx.i;
  return {
    type: "CodeEnd",
    start,
    end,
    value: ctx.substring(start, end),
  };
}

function readTagStart(ctx: TokenizerContext): TToken | undefined {
  return ctx.guard(() => {
    const start = ctx.i;
    if (ctx.getChar(+0) !== "<") return;
    ctx.i++;
    const nameToken = readHtmlName(ctx);
    if (!nameToken) return;
    ctx.skipWhile(CHAR_EOL | CHAR_SPACE);
    if (ctx.getChar() !== ">") return;
    ctx.i++;
    const end = ctx.i;
    return {
      type: "TagStart",
      start,
      end,
      value: ctx.substring(start, end),
    };
  });
}

function readTagEnd(ctx: TokenizerContext): TToken | undefined {
  return ctx.guard(() => {
    const start = ctx.i;
    if (ctx.getChar(+0) !== "<" || ctx.getChar(+1) !== "/") return;
    ctx.i += 2;
    const nameToken = readHtmlName(ctx);
    if (!nameToken) return;
    ctx.skipWhile(CHAR_EOL | CHAR_SPACE);
    if (ctx.getChar() !== ">") return;
    ctx.i++;
    const end = ctx.i;
    return {
      type: "TagEnd",
      start,
      end,
      value: ctx.substring(start, end),
    };
  });
}

function readWord(ctx: TokenizerContext): TToken | undefined {
  const start = ctx.i;
  let end = ctx.skipWhile(CHAR_ANY);
  if (end === start) return;
  return {
    type: "Word",
    start,
    end,
    value: ctx.substring(start, end),
  };
}
function readPunctuation(ctx: TokenizerContext): TToken | undefined {
  const start = ctx.i;
  let end = ctx.skipWhile(CHAR_PUNCTUATION);
  if (end === start) return;
  return {
    type: "Punctuation",
    start,
    end,
    value: ctx.substring(start, end),
  };
}

function test(
  readToken: TTokenizerMethod,
  str: string,
  control: Record<string, any>
) {
  const ctx = new TokenizerContext(str);
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

describe("TokenizerContext", () => {
  it("should tokenize a list of words", () => {
    const readToken = newBlockReader(
      "Text",
      newCompositeTokenizer([readWord, readPunctuation])
    );
    test(readToken, "hello world", {
      type: "Text",
      start: 0,
      end: 11,
      value: "hello world",
      children: [
        { type: "Word", start: 0, end: 5, value: "hello" },
        { type: "Word", start: 6, end: 11, value: "world" },
      ],
    });
    test(readToken, "hello - world!", {
      type: "Text",
      start: 0,
      end: 14,
      value: "hello - world!",
      children: [
        { type: "Word", start: 0, end: 5, value: "hello" },
        { type: "Punctuation", start: 6, end: 7, value: "-" },
        { type: "Word", start: 8, end: 13, value: "world" },
        { type: "Punctuation", start: 13, end: 14, value: "!" },
      ],
    });
  });

  function newReaderWithCodeBlocks() {
    const list: TTokenizerMethod[] = [];
    list.push(readWord);
    const compositeReader = newCompositeTokenizer(list);
    const readToken = newBlockReader("Text", compositeReader);
    const readFencedBlock = newFencedBlockReader(
      "FencedBlock",
      readCodeStart,
      readToken,
      readCodeEnd
    );
    list.unshift(readFencedBlock);
    return readToken;
  }

  it("should tokenize fenced blocks", () => {
    const readToken = newReaderWithCodeBlocks();
    test(readToken, "hello ${wonderful} world", {
      type: "Text",
      start: 0,
      end: 24,
      value: "hello ${wonderful} world",
      children: [
        { type: "Word", start: 0, end: 5, value: "hello" },
        {
          type: "FencedBlock",
          start: 6,
          end: 18,
          startToken: { type: "CodeStart", start: 6, end: 8, value: "${" },
          value: "${wonderful}",
          children: [
            {
              type: "Text",
              start: 8,
              end: 17,
              value: "wonderful",
              children: [
                { type: "Word", start: 8, end: 17, value: "wonderful" },
              ],
            },
          ],
          endToken: { type: "CodeEnd", start: 17, end: 18, value: "}" },
        },
        { type: "Word", start: 19, end: 24, value: "world" },
      ],
    });
  });

  it("should tokenize embedded fenced blocks", () => {
    const readToken = newReaderWithCodeBlocks();
    test(readToken, "before ${A ${B} C} after", {
      type: "Text",
      start: 0,
      end: 24,
      value: "before ${A ${B} C} after",
      children: [
        { type: "Word", start: 0, end: 6, value: "before" },
        {
          type: "FencedBlock",
          start: 7,
          end: 18,
          startToken: { type: "CodeStart", start: 7, end: 9, value: "${" },
          value: "${A ${B} C}",
          children: [
            {
              type: "Text",
              start: 9,
              end: 17,
              value: "A ${B} C",
              children: [
                { type: "Word", start: 9, end: 10, value: "A" },
                {
                  type: "FencedBlock",
                  start: 11,
                  end: 15,
                  startToken: {
                    type: "CodeStart",
                    start: 11,
                    end: 13,
                    value: "${",
                  },
                  value: "${B}",
                  children: [
                    {
                      type: "Text",
                      start: 13,
                      end: 14,
                      value: "B",
                      children: [
                        { type: "Word", start: 13, end: 14, value: "B" },
                      ],
                    },
                  ],
                  endToken: { type: "CodeEnd", start: 14, end: 15, value: "}" },
                },
                { type: "Word", start: 16, end: 17, value: "C" },
              ],
            },
          ],
          endToken: { type: "CodeEnd", start: 17, end: 18, value: "}" },
        },
        { type: "Word", start: 19, end: 24, value: "after" },
      ],
    });
  });

  function newReaderWithMixedFencedBlocks() {
    const list: TTokenizerMethod[] = [];
    list.push(readWord);
    const compositeReader = newCompositeTokenizer(list);
    const readToken = newBlockReader("Text", compositeReader);
    list.unshift(
      newFencedBlockReader("Code", readCodeStart, readToken, readCodeEnd)
    );
    list.unshift(
      newFencedBlockReader("Tag", readTagStart, readToken, readTagEnd)
    );
    return readToken;
  }

  it("should tokenize heterogenious fenced blocks", () => {
    const readToken = newReaderWithMixedFencedBlocks();
    test(readToken, `\${before} <code> A \${B} C </code> \${after}`, {
      type: "Text",
      start: 0,
      end: 42,
      value: "${before} <code> A ${B} C </code> ${after}",
      children: [
        {
          type: "Code",
          start: 0,
          end: 9,
          startToken: { type: "CodeStart", start: 0, end: 2, value: "${" },
          value: "${before}",
          children: [
            {
              type: "Text",
              start: 2,
              end: 8,
              value: "before",
              children: [{ type: "Word", start: 2, end: 8, value: "before" }],
            },
          ],
          endToken: { type: "CodeEnd", start: 8, end: 9, value: "}" },
        },
        {
          type: "Tag",
          start: 10,
          end: 33,
          startToken: { type: "TagStart", start: 10, end: 16, value: "<code>" },
          value: "<code> A ${B} C </code>",
          children: [
            {
              type: "Text",
              start: 16,
              end: 26,
              value: " A ${B} C ",
              children: [
                { type: "Word", start: 17, end: 18, value: "A" },
                {
                  type: "Code",
                  start: 19,
                  end: 23,
                  startToken: {
                    type: "CodeStart",
                    start: 19,
                    end: 21,
                    value: "${",
                  },
                  value: "${B}",
                  children: [
                    {
                      type: "Text",
                      start: 21,
                      end: 22,
                      value: "B",
                      children: [
                        { type: "Word", start: 21, end: 22, value: "B" },
                      ],
                    },
                  ],
                  endToken: { type: "CodeEnd", start: 22, end: 23, value: "}" },
                },
                { type: "Word", start: 24, end: 25, value: "C" },
              ],
            },
          ],
          endToken: { type: "TagEnd", start: 26, end: 33, value: "</code>" },
        },
        {
          type: "Code",
          start: 34,
          end: 42,
          startToken: { type: "CodeStart", start: 34, end: 36, value: "${" },
          value: "${after}",
          children: [
            {
              type: "Text",
              start: 36,
              end: 41,
              value: "after",
              children: [{ type: "Word", start: 36, end: 41, value: "after" }],
            },
          ],
          endToken: { type: "CodeEnd", start: 41, end: 42, value: "}" },
        },
      ],
    });
  });

  it("should tokenize broken heterogenious fenced blocks", () => {
    const readToken = newReaderWithMixedFencedBlocks();
    test(readToken, `\${before} <code> A \${B C </code> \${after}`, {
      type: "Text",
      start: 0,
      end: 41,
      value: "${before} <code> A ${B C </code> ${after}",
      children: [
        {
          type: "Code",
          start: 0,
          end: 9,
          startToken: { type: "CodeStart", start: 0, end: 2, value: "${" },
          value: "${before}",
          children: [
            {
              type: "Text",
              start: 2,
              end: 8,
              value: "before",
              children: [{ type: "Word", start: 2, end: 8, value: "before" }],
            },
          ],
          endToken: { type: "CodeEnd", start: 8, end: 9, value: "}" },
        },
        {
          type: "Tag",
          start: 10,
          end: 32,
          startToken: { type: "TagStart", start: 10, end: 16, value: "<code>" },
          value: "<code> A ${B C </code>",
          children: [
            {
              type: "Text",
              start: 16,
              end: 25,
              value: " A ${B C ",
              children: [
                { type: "Word", start: 17, end: 18, value: "A" },
                {
                  type: "Code",
                  start: 19,
                  end: 25,
                  startToken: {
                    type: "CodeStart",
                    start: 19,
                    end: 21,
                    value: "${",
                  },
                  value: "${B C ",
                  children: [
                    {
                      type: "Text",
                      start: 21,
                      end: 25,
                      value: "B C ",
                      children: [
                        { type: "Word", start: 21, end: 22, value: "B" },
                        { type: "Word", start: 23, end: 24, value: "C" },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          endToken: { type: "TagEnd", start: 25, end: 32, value: "</code>" },
        },
        {
          type: "Code",
          start: 33,
          end: 41,
          startToken: { type: "CodeStart", start: 33, end: 35, value: "${" },
          value: "${after}",
          children: [
            {
              type: "Text",
              start: 35,
              end: 40,
              value: "after",
              children: [{ type: "Word", start: 35, end: 40, value: "after" }],
            },
          ],
          endToken: { type: "CodeEnd", start: 40, end: 41, value: "}" },
        },
      ],
    });
  });
});
