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
import {
  newBlockReader,
  newDynamicFencedBlockReader,
  newFencedBlockReader,
} from "../../src/tknz/blocks.ts";
import { read } from "fs";

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
  const token = readHtmlName(ctx) as TToken;
  if (!token) return;
  return {
    type: "Word",
    start: token.start,
    end: token.end,
    value: token.value,
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

  it("should tokenize broken heterogenious fenced blocks - 2", () => {
    const readToken = newReaderWithMixedFencedBlocks();
    test(readToken, `before \${X <code> A \${B <code>C</code> } </code> `, {
      type: "Text",
      start: 0,
      end: 49,
      value: "before ${X <code> A ${B <code>C</code> } </code> ",
      children: [
        { type: "Word", start: 0, end: 6, value: "before" },
        {
          type: "Code",
          start: 7,
          end: 49,
          startToken: { type: "CodeStart", start: 7, end: 9, value: "${" },
          value: "${X <code> A ${B <code>C</code> } </code> ",
          children: [
            {
              type: "Text",
              start: 9,
              end: 49,
              value: "X <code> A ${B <code>C</code> } </code> ",
              children: [
                { type: "Word", start: 9, end: 10, value: "X" },
                {
                  type: "Tag",
                  start: 11,
                  end: 48,
                  startToken: {
                    type: "TagStart",
                    start: 11,
                    end: 17,
                    value: "<code>",
                  },
                  value: "<code> A ${B <code>C</code> } </code>",
                  children: [
                    {
                      type: "Text",
                      start: 17,
                      end: 41,
                      value: " A ${B <code>C</code> } ",
                      children: [
                        { type: "Word", start: 18, end: 19, value: "A" },
                        {
                          type: "Code",
                          start: 20,
                          end: 40,
                          startToken: {
                            type: "CodeStart",
                            start: 20,
                            end: 22,
                            value: "${",
                          },
                          value: "${B <code>C</code> }",
                          children: [
                            {
                              type: "Text",
                              start: 22,
                              end: 39,
                              value: "B <code>C</code> ",
                              children: [
                                {
                                  type: "Word",
                                  start: 22,
                                  end: 23,
                                  value: "B",
                                },
                                {
                                  type: "Tag",
                                  start: 24,
                                  end: 38,
                                  startToken: {
                                    type: "TagStart",
                                    start: 24,
                                    end: 30,
                                    value: "<code>",
                                  },
                                  value: "<code>C</code>",
                                  children: [
                                    {
                                      type: "Text",
                                      start: 30,
                                      end: 31,
                                      value: "C",
                                      children: [
                                        {
                                          type: "Word",
                                          start: 30,
                                          end: 31,
                                          value: "C",
                                        },
                                      ],
                                    },
                                  ],
                                  endToken: {
                                    type: "TagEnd",
                                    start: 31,
                                    end: 38,
                                    value: "</code>",
                                  },
                                },
                              ],
                            },
                          ],
                          endToken: {
                            type: "CodeEnd",
                            start: 39,
                            end: 40,
                            value: "}",
                          },
                        },
                      ],
                    },
                  ],
                  endToken: {
                    type: "TagEnd",
                    start: 41,
                    end: 48,
                    value: "</code>",
                  },
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it("should tokenize properly blocks with the same opening and closing patterns", () => {
    function readJsFence(ctx: TokenizerContext): TToken | undefined {
      if (
        ctx.getChar(+0) !== "`" ||
        ctx.getChar(+1) !== "`" ||
        ctx.getChar(+2) !== "`"
      )
        return;
      const start = ctx.i;
      ctx.i += 3;
      const end = ctx.i;
      return {
        type: "JsFence",
        start,
        end,
        value: ctx.substring(start, end),
      };
    }

    function newReader() {
      const list: TTokenizerMethod[] = [];
      list.push(readWord);
      const compositeReader = newCompositeTokenizer(list);
      const readToken = newBlockReader("Content", compositeReader);
      list.unshift(
        newFencedBlockReader("JsCode", readJsFence, readToken, readJsFence)
      );
      return readToken;
    }

    test(
      newReader(),
      `
before 
\`\`\`
First Js Block
\`\`\`
between
\`\`\`
Second Js Block
\`\`\`
after
`,
      {
        type: "Content",
        start: 0,
        end: 70,
        value:
          "\nbefore \n```\nFirst Js Block\n```\nbetween\n```\nSecond Js Block\n```\nafter\n",
        children: [
          { type: "Word", start: 1, end: 7, value: "before" },
          {
            type: "JsCode",
            start: 9,
            end: 31,
            startToken: { type: "JsFence", start: 9, end: 12, value: "```" },
            value: "```\nFirst Js Block\n```",
            children: [
              {
                type: "Content",
                start: 12,
                end: 28,
                value: "\nFirst Js Block\n",
                children: [
                  { type: "Word", start: 13, end: 18, value: "First" },
                  { type: "Word", start: 19, end: 21, value: "Js" },
                  { type: "Word", start: 22, end: 27, value: "Block" },
                ],
              },
            ],
            endToken: { type: "JsFence", start: 28, end: 31, value: "```" },
          },
          { type: "Word", start: 32, end: 39, value: "between" },
          {
            type: "JsCode",
            start: 40,
            end: 63,
            startToken: { type: "JsFence", start: 40, end: 43, value: "```" },
            value: "```\nSecond Js Block\n```",
            children: [
              {
                type: "Content",
                start: 43,
                end: 60,
                value: "\nSecond Js Block\n",
                children: [
                  { type: "Word", start: 44, end: 50, value: "Second" },
                  { type: "Word", start: 51, end: 53, value: "Js" },
                  { type: "Word", start: 54, end: 59, value: "Block" },
                ],
              },
            ],
            endToken: { type: "JsFence", start: 60, end: 63, value: "```" },
          },
          { type: "Word", start: 64, end: 69, value: "after" },
        ],
      }
    );
  });
  it("should tokenize blocks with the same opening and closing patterns (simple version)", () => {
    function readJsFence(ctx: TokenizerContext): TToken | undefined {
      if (
        ctx.getChar(+0) !== "`" ||
        ctx.getChar(+1) !== "`" ||
        ctx.getChar(+2) !== "`"
      )
        return;
      const start = ctx.i;
      ctx.i += 3;
      const end = ctx.i;
      return {
        type: "JsFence",
        start,
        end,
        value: ctx.substring(start, end),
      };
    }

    function newReader() {
      const list: TTokenizerMethod[] = [];
      const compositeReader = newCompositeTokenizer(list);
      const readToken = newBlockReader("Content", compositeReader);
      list.unshift(
        newFencedBlockReader("JsCode", readJsFence, readToken, readJsFence)
      );
      return readToken;
    }

    test(
      newReader(),
      `
before 
\`\`\`
First Js Block
\`\`\`
between
\`\`\`
Second Js Block
\`\`\`
after
`,
      {
        type: "Content",
        start: 0,
        end: 70,
        value:
          "\nbefore \n```\nFirst Js Block\n```\nbetween\n```\nSecond Js Block\n```\nafter\n",
        children: [
          {
            type: "JsCode",
            start: 9,
            end: 31,
            startToken: { type: "JsFence", start: 9, end: 12, value: "```" },
            value: "```\nFirst Js Block\n```",
            children: [
              {
                type: "Content",
                start: 12,
                end: 28,
                value: "\nFirst Js Block\n",
                children: [],
              },
            ],
            endToken: { type: "JsFence", start: 28, end: 31, value: "```" },
          },
          {
            type: "JsCode",
            start: 40,
            end: 63,
            startToken: { type: "JsFence", start: 40, end: 43, value: "```" },
            value: "```\nSecond Js Block\n```",
            children: [
              {
                type: "Content",
                start: 43,
                end: 60,
                value: "\nSecond Js Block\n",
                children: [],
              },
            ],
            endToken: { type: "JsFence", start: 60, end: 63, value: "```" },
          },
        ],
      }
    );
  });

  it("should tokenize hierarchical MD code blocks", () => {
    function readCodeFence(ctx: TokenizerContext): TToken | undefined {
      if (
        ctx.getChar(+0) !== "`" ||
        ctx.getChar(+1) !== "`" ||
        ctx.getChar(+2) !== "`"
      ) {
        return;
      }
      function isAlphaNum(ch: string[1]) {
        return (
          (ch >= "0" && ch <= "9") ||
          (ch >= "a" && ch <= "z") ||
          (ch >= "A" && ch <= "Z")
        );
      }
      return ctx.guard(() => {
        const start = ctx.i;
        ctx.i += 3;
        let namesStart = ctx.skipWhile(CHAR_SPACE);
        for (; ctx.i < ctx.length; ctx.i++) {
          const char = ctx.getChar();
          if (!isAlphaNum(char)) break;
          // if (!char.match(/^\p{L}/u)) break;
        }
        const name = ctx.substring(namesStart, ctx.i);
        const end = ctx.i;
        return {
          type: "MdCodeFence",
          start,
          end,
          value: ctx.substring(start, end),
          name,
        } as TToken;
      });
    }
    function readCodeEnd(ctx: TokenizerContext): TToken | undefined {
      const token = readCodeFence(ctx);
      if (!token || token.name) return;
      return token;
    }

    function newReader() {
      const list: TTokenizerMethod[] = [];
      // list.push(readWord);
      const compositeReader = newCompositeTokenizer(list);
      const readToken = newBlockReader("Content", compositeReader);
      list.unshift(
        newFencedBlockReader("MdCode", readCodeFence, readToken, readCodeEnd)
      );
      return readToken;
    }

    test(
      newReader(),
      `
before 
\`\`\`ts
First Typescript Block
\`\`\`js
Internal Javascript Block
\`\`\`
Typescript Again
\`\`\`
after
`,
      {
        type: "Content",
        start: 0,
        end: 101,
        value:
          "\nbefore \n```ts\nFirst Typescript Block\n```js\nInternal Javascript Block\n```\nTypescript Again\n```\nafter\n",
        children: [
          {
            type: "MdCode",
            start: 9,
            end: 94,
            startToken: {
              type: "MdCodeFence",
              start: 9,
              end: 14,
              value: "```ts",
              name: "ts",
            },
            value:
              "```ts\nFirst Typescript Block\n```js\nInternal Javascript Block\n```\nTypescript Again\n```",
            children: [
              {
                type: "Content",
                start: 14,
                end: 91,
                value:
                  "\nFirst Typescript Block\n```js\nInternal Javascript Block\n```\nTypescript Again\n",
                children: [
                  {
                    type: "MdCode",
                    start: 38,
                    end: 73,
                    startToken: {
                      type: "MdCodeFence",
                      start: 38,
                      end: 43,
                      value: "```js",
                      name: "js",
                    },
                    value: "```js\nInternal Javascript Block\n```",
                    children: [
                      {
                        type: "Content",
                        start: 43,
                        end: 70,
                        value: "\nInternal Javascript Block\n",
                        children: [],
                      },
                    ],
                    endToken: {
                      type: "MdCodeFence",
                      start: 70,
                      end: 73,
                      value: "```",
                      name: "",
                    },
                  },
                ],
              },
            ],
            endToken: {
              type: "MdCodeFence",
              start: 91,
              end: 94,
              value: "```",
              name: "",
            },
          },
        ],
      }
    );
  });
});

describe("TokenizerContext", () => {
  interface TMdHeaderStartToken extends TToken {
    type: "MdHeaderStart";
    level: number;
  }

  function readMdHeaderStart(
    ctx: TokenizerContext
  ): TMdHeaderStartToken | undefined {
    return ctx.guard(() => {
      const start = ctx.i;
      const eolPos = ctx.skipWhile(CHAR_EOL);
      if (start > 0 && eolPos === start) return;

      ctx.skipWhile(CHAR_SPACE);
      let level = 0;
      for (level = 0; level <= 6; level++) {
        if (ctx.getChar(level) !== "#") break;
      }
      if (level === 0) return;
      ctx.i += level;
      if (ctx.getChar() !== " ") return;
      ctx.i++;
      const end = ctx.i;
      return {
        type: "MdHeaderStart",
        start,
        end,
        value: ctx.substring(start, end),
        level,
      };
    });
  }

  function readNewLine(ctx: TokenizerContext): TToken | undefined {
    return ctx.guard(() => {
      const start = ctx.i;
      const eolPos = ctx.skipWhile(CHAR_EOL);
      if (start > 0 && eolPos === start) return;
      return {
        type: "Eol",
        start,
        end: eolPos,
        value: ctx.substring(start, eolPos),
        level: 0,
      };
    });
  }

  interface TMdHeaderEndToken extends TToken {
    type: "MdHeaderEnd";
  }
  function readMdHeaderEnd(
    ctx: TokenizerContext
  ): TMdHeaderEndToken | undefined {
    return ctx.guard(() => {
      const start = ctx.i;
      const token = readMdHeaderStart(ctx) || readNewLine(ctx);
      if (!token) return;
      const end = token.start;
      ctx.i = end;
      return {
        type: "MdHeaderEnd",
        start,
        end,
        value: ctx.substring(start, end),
      };
    });
  }

  function newMdHeaderReader(readToken: TTokenizerMethod) {
    return newFencedBlockReader(
      "MdHeader",
      readMdHeaderStart,
      readToken,
      readMdHeaderEnd
    );
  }

  it("should read MD headers", () => {
    function newReader() {
      const list: TTokenizerMethod[] = [];
      const compositeReader = newCompositeTokenizer(list);
      const readToken = newBlockReader("MdContent", compositeReader);
      const readMdHeader = newMdHeaderReader(readToken);
      list.unshift(readMdHeader);
      return readToken;
    }

    test(
      newReader(),
      `
# First Header
First paragraph
## Second Header
Second paragraph
`,
      {
        type: "MdContent",
        start: 0,
        end: 66,
        value:
          "\n# First Header\nFirst paragraph\n## Second Header\nSecond paragraph\n",
        children: [
          {
            type: "MdHeader",
            start: 0,
            end: 15,
            startToken: {
              type: "MdHeaderStart",
              start: 0,
              end: 3,
              value: "\n# ",
              level: 1,
            },
            value: "\n# First Header",
            children: [
              {
                type: "MdContent",
                start: 3,
                end: 15,
                value: "First Header",
                children: [],
              },
            ],
            endToken: { type: "MdHeaderEnd", start: 15, end: 15, value: "" },
          },
          {
            type: "MdHeader",
            start: 31,
            end: 48,
            startToken: {
              type: "MdHeaderStart",
              start: 31,
              end: 35,
              value: "\n## ",
              level: 2,
            },
            value: "\n## Second Header",
            children: [
              {
                type: "MdContent",
                start: 35,
                end: 48,
                value: "Second Header",
                children: [],
              },
            ],
            endToken: { type: "MdHeaderEnd", start: 48, end: 48, value: "" },
          },
        ],
      }
    );

    test(
      newReader(),
      `
  # First Header
  First paragraph

  ## Second Header
  Second paragraph
  `,
      {
        type: "MdContent",
        start: 0,
        end: 77,
        value:
          "\n  # First Header\n  First paragraph\n\n  ## Second Header\n  Second paragraph\n  ",
        children: [
          {
            type: "MdHeader",
            start: 0,
            end: 17,
            startToken: {
              type: "MdHeaderStart",
              start: 0,
              end: 5,
              value: "\n  # ",
              level: 1,
            },
            value: "\n  # First Header",
            children: [
              {
                type: "MdContent",
                start: 5,
                end: 17,
                value: "First Header",
                children: [],
              },
            ],
            endToken: { type: "MdHeaderEnd", start: 17, end: 17, value: "" },
          },
          {
            type: "MdHeader",
            start: 35,
            end: 55,
            startToken: {
              type: "MdHeaderStart",
              start: 35,
              end: 42,
              value: "\n\n  ## ",
              level: 2,
            },
            value: "\n\n  ## Second Header",
            children: [
              {
                type: "MdContent",
                start: 42,
                end: 55,
                value: "Second Header",
                children: [],
              },
            ],
            endToken: { type: "MdHeaderEnd", start: 55, end: 55, value: "" },
          },
        ],
      }
    );
  });

  it("should build hierarchical document structure based on headers", () => {
    function newReader() {
      const list: TTokenizerMethod[] = [];
      // list.push(readWord);
      const compositeReader = newCompositeTokenizer(list);
      const readToken = newBlockReader("MdContent", compositeReader);
      const readMdHeader = newMdHeaderReader(readToken);

      list.unshift(
        // readMdHeader,
        newDynamicFencedBlockReader(
          "MdSection",
          readMdHeader,
          () => readToken,
          (token: TToken): TTokenizerMethod | undefined => {
            if (token.type !== "MdHeader") {
              return;
            }
            const level = token.startToken.level;
            return (ctx: TokenizerContext) => {
              return ctx.guard(() => {
                const token = readMdHeaderStart(ctx);
                if (!token || token.level > level) return;
                const end = (ctx.i = token.start);
                return {
                  type: "MdSectionEnd",
                  start: token.start,
                  end,
                  value: ctx.substring(token.start, ctx.i),
                };
              });
            };
          }
        )
      );
      return readToken;
    }

    test(
      newReader(),
      `
# First Header
First paragraph
# Second Header
Second paragraph
## Subsection
Inner paragraph
# Third Header
Third paragraph
`,
      {
        type: "MdContent",
        start: 0,
        end: 126,
        value:
          "\n# First Header\nFirst paragraph\n# Second Header\nSecond paragraph\n## Subsection\nInner paragraph\n# Third Header\nThird paragraph\n",
        children: [
          {
            type: "MdSection",
            start: 0,
            end: 31,
            startToken: {
              type: "MdHeader",
              start: 0,
              end: 15,
              startToken: {
                type: "MdHeaderStart",
                start: 0,
                end: 3,
                value: "\n# ",
                level: 1,
              },
              value: "\n# First Header",
              children: [
                {
                  type: "MdContent",
                  start: 3,
                  end: 15,
                  value: "First Header",
                  children: [],
                },
              ],
              endToken: { type: "MdHeaderEnd", start: 15, end: 15, value: "" },
            },
            value: "\n# First Header\nFirst paragraph",
            children: [
              {
                type: "MdContent",
                start: 15,
                end: 31,
                value: "\nFirst paragraph",
                children: [],
              },
            ],
            endToken: { type: "MdSectionEnd", start: 31, end: 31, value: "" },
          },
          {
            type: "MdSection",
            start: 31,
            end: 94,
            startToken: {
              type: "MdHeader",
              start: 31,
              end: 47,
              startToken: {
                type: "MdHeaderStart",
                start: 31,
                end: 34,
                value: "\n# ",
                level: 1,
              },
              value: "\n# Second Header",
              children: [
                {
                  type: "MdContent",
                  start: 34,
                  end: 47,
                  value: "Second Header",
                  children: [],
                },
              ],
              endToken: { type: "MdHeaderEnd", start: 47, end: 47, value: "" },
            },
            value:
              "\n# Second Header\nSecond paragraph\n## Subsection\nInner paragraph",
            children: [
              {
                type: "MdContent",
                start: 47,
                end: 94,
                value: "\nSecond paragraph\n## Subsection\nInner paragraph",
                children: [
                  {
                    type: "MdSection",
                    start: 64,
                    end: 94,
                    startToken: {
                      type: "MdHeader",
                      start: 64,
                      end: 78,
                      startToken: {
                        type: "MdHeaderStart",
                        start: 64,
                        end: 68,
                        value: "\n## ",
                        level: 2,
                      },
                      value: "\n## Subsection",
                      children: [
                        {
                          type: "MdContent",
                          start: 68,
                          end: 78,
                          value: "Subsection",
                          children: [],
                        },
                      ],
                      endToken: {
                        type: "MdHeaderEnd",
                        start: 78,
                        end: 78,
                        value: "",
                      },
                    },
                    value: "\n## Subsection\nInner paragraph",
                    children: [
                      {
                        type: "MdContent",
                        start: 78,
                        end: 94,
                        value: "\nInner paragraph",
                        children: [],
                      },
                    ],
                    endToken: {
                      type: "MdSectionEnd",
                      start: 94,
                      end: 94,
                      value: "",
                    },
                  },
                ],
              },
            ],
            endToken: { type: "MdSectionEnd", start: 94, end: 94, value: "" },
          },
          {
            type: "MdSection",
            start: 94,
            end: 126,
            startToken: {
              type: "MdHeader",
              start: 94,
              end: 109,
              startToken: {
                type: "MdHeaderStart",
                start: 94,
                end: 97,
                value: "\n# ",
                level: 1,
              },
              value: "\n# Third Header",
              children: [
                {
                  type: "MdContent",
                  start: 97,
                  end: 109,
                  value: "Third Header",
                  children: [],
                },
              ],
              endToken: {
                type: "MdHeaderEnd",
                start: 109,
                end: 109,
                value: "",
              },
            },
            value: "\n# Third Header\nThird paragraph\n",
            children: [
              {
                type: "MdContent",
                start: 109,
                end: 126,
                value: "\nThird paragraph\n",
                children: [],
              },
            ],
          },
        ],
      }
    );
  });
});
