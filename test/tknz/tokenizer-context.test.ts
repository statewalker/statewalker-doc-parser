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

// function readChar(ctx: TokenizerContext): TToken {
//   const start = ctx.i;
//   const value = ctx.getChar();
//   ctx.i++;
//   return {
//     level: 0,
//     type: "Char",
//     start,
//     end: start + 1,
//     value,
//   };
// }

function newBlockReader(readToken: TTokenizerMethod): TTokenizerMethod {
  return (ctx: TokenizerContext): TToken | undefined =>
    ctx.guard((fences) => {
      const start = ctx.i;
      const len = ctx.length;
      const children: TToken[] = [];
      let textStart = start;
      const flushText = (i: number) => {
        if (i > textStart) {
          // list.push(ctx.substring(textStart, i));
          textStart = i;
        }
      };
      while (ctx.i < len) {
        let i = ctx.i;
        const fence = fences.getFenceToken();
        if (fence) {
          break;
        }
        const token = readToken(ctx);
        if (token) {
          flushText(i);
          textStart = ctx.i;
          children.push(token);
        } else {
          ctx.i++;
        }
      }
      const end = ctx.i;
      if (end === start) return;
      flushText(end);
      return {
        level: 0,
        type: "Text",
        start,
        end,
        value: ctx.substring(start, end),
        children,
      };
    });
}

function readCodeStart(ctx: TokenizerContext): TToken | undefined {
  if (ctx.getChar(+0) !== "$" || ctx.getChar(+1) !== "{") return;
  const start = ctx.i;
  ctx.i += 2;
  const end = ctx.i;
  return {
    level: 0,
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
    level: 0,
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
      level: 0,
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
      level: 0,
      type: "TagEnd",
      start,
      end,
      value: ctx.substring(start, end),
    };
  });
}

export interface TFencedBlockToken extends TToken {
  startToken: TToken;
  endToken?: TToken;
}

function newFencedBlockReader<T extends TFencedBlockToken = TFencedBlockToken>(
  type: string,
  readStart: TTokenizerMethod,
  readToken: TTokenizerMethod,
  readEnd: TTokenizerMethod
): TTokenizerMethod<T> {
  return (ctx: TokenizerContext): T | undefined =>
    ctx.guard((fences) => {
      const start = ctx.i;
      const startToken = readStart(ctx);
      let endToken: TToken | undefined;
      if (!startToken) return;
      ctx.i = startToken.end;
      fences.addFence(readEnd);

      const children: TToken[] = [];
      while (ctx.i < ctx.length) {
        endToken = readEnd(ctx);
        if (endToken) {
          ctx.i = endToken.end;
          break;
        }
        const fence = fences.getFenceToken();
        if (fence) {
          break;
        }
        const token = readToken(ctx);
        if (token) {
          children.push(token);
          ctx.i = token.end;
        } else {
          ctx.i++;
        }
      }
      let end = ctx.i;
      return {
        level: 0,
        type,
        start,
        end,
        value: ctx.substring(start, end),
        children,
        startToken,
        endToken,
      } as T;
    });
}

function readWord(ctx: TokenizerContext): TToken | undefined {
  const start = ctx.i;
  let end = ctx.skipWhile(CHAR_ANY);
  if (end === start) return;
  return {
    level: 0,
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
    level: 0,
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
      newCompositeTokenizer([readWord, readPunctuation])
    );
    test(readToken, "hello world", {
      level: 0,
      type: "Text",
      start: 0,
      end: 11,
      value: "hello world",
      children: [
        { level: 0, type: "Word", start: 0, end: 5, value: "hello" },
        { level: 0, type: "Word", start: 6, end: 11, value: "world" },
      ],
    });

    test(readToken, "hello - world!", {
      level: 0,
      type: "Text",
      start: 0,
      end: 14,
      value: "hello - world!",
      children: [
        { level: 0, type: "Word", start: 0, end: 5, value: "hello" },
        { level: 0, type: "Punctuation", start: 6, end: 7, value: "-" },
        { level: 0, type: "Word", start: 8, end: 13, value: "world" },
        { level: 0, type: "Punctuation", start: 13, end: 14, value: "!" },
      ],
    });
  });

  function newReaderWithCodeBlocks() {
    const list: TTokenizerMethod[] = [];
    list.push(readWord);
    const compositeReader = newCompositeTokenizer(list);
    const readToken = newBlockReader(compositeReader);
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
      level: 0,
      type: "Text",
      start: 0,
      end: 24,
      value: "hello ${wonderful} world",
      children: [
        { level: 0, type: "Word", start: 0, end: 5, value: "hello" },
        {
          level: 0,
          type: "FencedBlock",
          start: 6,
          end: 18,
          value: "${wonderful}",
          children: [
            {
              level: 0,
              type: "Text",
              start: 8,
              end: 17,
              value: "wonderful",
              children: [
                {
                  level: 0,
                  type: "Word",
                  start: 8,
                  end: 17,
                  value: "wonderful",
                },
              ],
            },
          ],
          startToken: {
            level: 0,
            type: "CodeStart",
            start: 6,
            end: 8,
            value: "${",
          },
          endToken: {
            level: 0,
            type: "CodeEnd",
            start: 17,
            end: 18,
            value: "}",
          },
        },
        { level: 0, type: "Word", start: 19, end: 24, value: "world" },
      ],
    });
  });

  it("should tokenize embedded fenced blocks", () => {
    const readToken = newReaderWithCodeBlocks();
    test(readToken, "before ${A ${B} C} after", {
      level: 0,
      type: "Text",
      start: 0,
      end: 24,
      value: "before ${A ${B} C} after",
      children: [
        { level: 0, type: "Word", start: 0, end: 6, value: "before" },
        {
          level: 0,
          type: "FencedBlock",
          start: 7,
          end: 18,
          value: "${A ${B} C}",
          children: [
            {
              level: 0,
              type: "Text",
              start: 9,
              end: 17,
              value: "A ${B} C",
              children: [
                { level: 0, type: "Word", start: 9, end: 10, value: "A" },
                {
                  level: 0,
                  type: "FencedBlock",
                  start: 11,
                  end: 15,
                  value: "${B}",
                  children: [
                    {
                      level: 0,
                      type: "Text",
                      start: 13,
                      end: 14,
                      value: "B",
                      children: [
                        {
                          level: 0,
                          type: "Word",
                          start: 13,
                          end: 14,
                          value: "B",
                        },
                      ],
                    },
                  ],
                  startToken: {
                    level: 0,
                    type: "CodeStart",
                    start: 11,
                    end: 13,
                    value: "${",
                  },
                  endToken: {
                    level: 0,
                    type: "CodeEnd",
                    start: 14,
                    end: 15,
                    value: "}",
                  },
                },
                { level: 0, type: "Word", start: 16, end: 17, value: "C" },
              ],
            },
          ],
          startToken: {
            level: 0,
            type: "CodeStart",
            start: 7,
            end: 9,
            value: "${",
          },
          endToken: {
            level: 0,
            type: "CodeEnd",
            start: 17,
            end: 18,
            value: "}",
          },
        },
        { level: 0, type: "Word", start: 19, end: 24, value: "after" },
      ],
    });
  });

  function newReaderWithMixedFencedBlocks() {
    const list: TTokenizerMethod[] = [];
    list.push(readWord);
    const compositeReader = newCompositeTokenizer(list);
    const readToken = newBlockReader(compositeReader);
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
      level: 0,
      type: "Text",
      start: 0,
      end: 42,
      value: "${before} <code> A ${B} C </code> ${after}",
      children: [
        {
          level: 0,
          type: "Code",
          start: 0,
          end: 9,
          value: "${before}",
          children: [
            {
              level: 0,
              type: "Text",
              start: 2,
              end: 8,
              value: "before",
              children: [
                { level: 0, type: "Word", start: 2, end: 8, value: "before" },
              ],
            },
          ],
          startToken: {
            level: 0,
            type: "CodeStart",
            start: 0,
            end: 2,
            value: "${",
          },
          endToken: { level: 0, type: "CodeEnd", start: 8, end: 9, value: "}" },
        },
        {
          level: 0,
          type: "Tag",
          start: 10,
          end: 33,
          value: "<code> A ${B} C </code>",
          children: [
            {
              level: 0,
              type: "Text",
              start: 16,
              end: 26,
              value: " A ${B} C ",
              children: [
                { level: 0, type: "Word", start: 17, end: 18, value: "A" },
                {
                  level: 0,
                  type: "Code",
                  start: 19,
                  end: 23,
                  value: "${B}",
                  children: [
                    {
                      level: 0,
                      type: "Text",
                      start: 21,
                      end: 22,
                      value: "B",
                      children: [
                        {
                          level: 0,
                          type: "Word",
                          start: 21,
                          end: 22,
                          value: "B",
                        },
                      ],
                    },
                  ],
                  startToken: {
                    level: 0,
                    type: "CodeStart",
                    start: 19,
                    end: 21,
                    value: "${",
                  },
                  endToken: {
                    level: 0,
                    type: "CodeEnd",
                    start: 22,
                    end: 23,
                    value: "}",
                  },
                },
                { level: 0, type: "Word", start: 24, end: 25, value: "C" },
              ],
            },
          ],
          startToken: {
            level: 0,
            type: "TagStart",
            start: 10,
            end: 16,
            value: "<code>",
          },
          endToken: {
            level: 0,
            type: "TagEnd",
            start: 26,
            end: 33,
            value: "</code>",
          },
        },
        {
          level: 0,
          type: "Code",
          start: 34,
          end: 42,
          value: "${after}",
          children: [
            {
              level: 0,
              type: "Text",
              start: 36,
              end: 41,
              value: "after",
              children: [
                { level: 0, type: "Word", start: 36, end: 41, value: "after" },
              ],
            },
          ],
          startToken: {
            level: 0,
            type: "CodeStart",
            start: 34,
            end: 36,
            value: "${",
          },
          endToken: {
            level: 0,
            type: "CodeEnd",
            start: 41,
            end: 42,
            value: "}",
          },
        },
      ],
    });
  });

  it("should tokenize broken heterogenious fenced blocks", () => {
    const readToken = newReaderWithMixedFencedBlocks();
    test(readToken, `\${before} <code> A \${B C </code> \${after}`, {
      level: 0,
      type: "Text",
      start: 0,
      end: 41,
      value: "${before} <code> A ${B C </code> ${after}",
      children: [
        {
          level: 0,
          type: "Code",
          start: 0,
          end: 9,
          value: "${before}",
          children: [
            {
              level: 0,
              type: "Text",
              start: 2,
              end: 8,
              value: "before",
              children: [
                { level: 0, type: "Word", start: 2, end: 8, value: "before" },
              ],
            },
          ],
          startToken: {
            level: 0,
            type: "CodeStart",
            start: 0,
            end: 2,
            value: "${",
          },
          endToken: { level: 0, type: "CodeEnd", start: 8, end: 9, value: "}" },
        },
        {
          level: 0,
          type: "Tag",
          start: 10,
          end: 32,
          value: "<code> A ${B C </code>",
          children: [
            {
              level: 0,
              type: "Text",
              start: 16,
              end: 25,
              value: " A ${B C ",
              children: [
                { level: 0, type: "Word", start: 17, end: 18, value: "A" },
                {
                  level: 0,
                  type: "Code",
                  start: 19,
                  end: 25,
                  value: "${B C ",
                  children: [
                    {
                      level: 0,
                      type: "Text",
                      start: 21,
                      end: 25,
                      value: "B C ",
                      children: [
                        {
                          level: 0,
                          type: "Word",
                          start: 21,
                          end: 22,
                          value: "B",
                        },
                        {
                          level: 0,
                          type: "Word",
                          start: 23,
                          end: 24,
                          value: "C",
                        },
                      ],
                    },
                  ],
                  startToken: {
                    level: 0,
                    type: "CodeStart",
                    start: 19,
                    end: 21,
                    value: "${",
                  },
                },
              ],
            },
          ],
          startToken: {
            level: 0,
            type: "TagStart",
            start: 10,
            end: 16,
            value: "<code>",
          },
          endToken: {
            level: 0,
            type: "TagEnd",
            start: 25,
            end: 32,
            value: "</code>",
          },
        },
        {
          level: 0,
          type: "Code",
          start: 33,
          end: 41,
          value: "${after}",
          children: [
            {
              level: 0,
              type: "Text",
              start: 35,
              end: 40,
              value: "after",
              children: [
                { level: 0, type: "Word", start: 35, end: 40, value: "after" },
              ],
            },
          ],
          startToken: {
            level: 0,
            type: "CodeStart",
            start: 33,
            end: 35,
            value: "${",
          },
          endToken: {
            level: 0,
            type: "CodeEnd",
            start: 40,
            end: 41,
            value: "}",
          },
        },
      ],
    });
  });
});
