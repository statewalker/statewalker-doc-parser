import { TokenizerContext } from "../../src/tknz/tokenizer.ts";
import { describe, expect, it } from "../deps.ts";
import { newCodeReader } from "../../src/tknz/code-readers.ts";
import { newHtmlTagReader } from "../../src/tknz/html/index.ts";

describe("readHtmlTag", () => {
  function test(str: string, control?: Record<string, any>) {
    const readCode = newCodeReader();
    const readToken = newHtmlTagReader(readCode);
    const ctx = new TokenizerContext(str);
    const result = readToken(ctx);
    try {
      expect(result).to.eql(control);
    } catch (error) {
      console.log(JSON.stringify(result, null, 2));
      throw error;
    }
  }
  it(`should read simple tags`, async () => {
    test("<a", {
      type: "HtmlTag",
      start: 0,
      end: 2,
      startToken: {
        type: "HtmlTagStart",
        start: 0,
        end: 2,
        value: "<a",
        children: [
          {
            type: "HtmlName",
            name: "a",
            start: 1,
            end: 2,
            value: "a",
          },
        ],
      },
      value: "<a",
      children: [],
    });

    test("<a b='c'>", {
      type: "HtmlTag",
      start: 0,
      end: 9,
      startToken: {
        type: "HtmlTagStart",
        start: 0,
        end: 2,
        value: "<a",
        children: [
          {
            type: "HtmlName",
            name: "a",
            start: 1,
            end: 2,
            value: "a",
          },
        ],
      },
      value: "<a b='c'>",
      children: [
        {
          type: "HtmlAttribute",
          start: 3,
          end: 8,
          value: "b='c'",
          children: [
            {
              type: "HtmlName",
              name: "b",
              start: 3,
              end: 4,
              value: "b",
            },
            {
              type: "HtmlValue",
              value: "'c'",
              start: 5,
              end: 8,
              children: [],
              quoted: true,
              valueStart: 6,
              valueEnd: 7,
            },
          ],
        },
      ],
      endToken: {
        type: "HtmlTagEnd",
        start: 8,
        end: 9,
        value: ">",
        autoclosing: false,
      },
    });
  });

  it(`should read tags with code blocks`, async () => {
    test("<tag ${ code block } x=${y} n='a${c}b' />", {
      type: "HtmlTag",
      start: 0,
      end: 41,
      startToken: {
        type: "HtmlTagStart",
        start: 0,
        end: 4,
        value: "<tag",
        children: [
          {
            type: "HtmlName",
            name: "tag",
            start: 1,
            end: 4,
            value: "tag",
          },
        ],
      },
      value: "<tag ${ code block } x=${y} n='a${c}b' />",
      children: [
        {
          type: "Code",
          codeStart: 7,
          codeEnd: 19,
          code: [" code block "],
          start: 5,
          end: 20,
          value: "${ code block }",
        },
        {
          type: "HtmlAttribute",
          start: 21,
          end: 27,
          value: "x=${y}",
          children: [
            {
              type: "HtmlName",
              name: "x",
              start: 21,
              end: 22,
              value: "x",
            },
            {
              type: "HtmlValue",
              codeStart: 25,
              codeEnd: 26,
              code: ["y"],
              start: 23,
              end: 27,
              value: "${y}",
              quoted: false,
              valueStart: 23,
              valueEnd: 27,
            },
          ],
        },
        {
          type: "HtmlAttribute",
          start: 28,
          end: 38,
          value: "n='a${c}b'",
          children: [
            {
              type: "HtmlName",
              name: "n",
              start: 28,
              end: 29,
              value: "n",
            },
            {
              type: "HtmlValue",
              value: "'a${c}b'",
              start: 30,
              end: 38,
              children: [
                {
                  type: "Code",
                  codeStart: 34,
                  codeEnd: 35,
                  code: ["c"],
                  start: 32,
                  end: 36,
                  value: "${c}",
                },
              ],
              quoted: true,
              valueStart: 31,
              valueEnd: 37,
            },
          ],
        },
      ],
      endToken: {
        type: "HtmlTagEnd",
        start: 39,
        end: 41,
        value: "/>",
        autoclosing: true,
      },
    });
  });

  it(`should read tags with broken code blocks`, async () => {
    test("<tag ${ code block  />", {
      type: "HtmlTag",
      start: 0,
      end: 22,
      startToken: {
        type: "HtmlTagStart",
        start: 0,
        end: 4,
        value: "<tag",
        children: [
          {
            type: "HtmlName",
            name: "tag",
            start: 1,
            end: 4,
            value: "tag",
          },
        ],
      },
      value: "<tag ${ code block  />",
      children: [
        {
          type: "Code",
          codeStart: 7,
          codeEnd: 20,
          code: [" code block  "],
          start: 5,
          end: 20,
          value: "${ code block  ",
        },
      ],
      endToken: {
        type: "HtmlTagEnd",
        start: 20,
        end: 22,
        value: "/>",
        autoclosing: true,
      },
    });

    // Broken attribute
    test("<tag attr='x${ code block' attr2=val2 />", {
      type: "HtmlTag",
      start: 0,
      end: 40,
      startToken: {
        type: "HtmlTagStart",
        start: 0,
        end: 4,
        value: "<tag",
        children: [
          {
            type: "HtmlName",
            name: "tag",
            start: 1,
            end: 4,
            value: "tag",
          },
        ],
      },
      value: "<tag attr='x${ code block' attr2=val2 />",
      children: [
        {
          type: "HtmlAttribute",
          start: 5,
          end: 26,
          value: "attr='x${ code block'",
          children: [
            {
              type: "HtmlName",
              name: "attr",
              start: 5,
              end: 9,
              value: "attr",
            },
            {
              type: "HtmlValue",
              value: "'x${ code block'",
              start: 10,
              end: 26,
              children: [
                {
                  type: "Code",
                  codeStart: 14,
                  codeEnd: 25,
                  code: [" code block"],
                  start: 12,
                  end: 25,
                  value: "${ code block",
                },
              ],
              quoted: true,
              valueStart: 11,
              valueEnd: 25,
            },
          ],
        },
        {
          type: "HtmlAttribute",
          start: 27,
          end: 37,
          value: "attr2=val2",
          children: [
            {
              type: "HtmlName",
              name: "attr2",
              start: 27,
              end: 32,
              value: "attr2",
            },
            {
              type: "HtmlValue",
              value: "val2",
              start: 33,
              end: 37,
              quoted: false,
              valueStart: 33,
              valueEnd: 37,
            },
          ],
        },
      ],
      endToken: {
        type: "HtmlTagEnd",
        start: 38,
        end: 40,
        value: "/>",
        autoclosing: true,
      },
    });
  });
});
