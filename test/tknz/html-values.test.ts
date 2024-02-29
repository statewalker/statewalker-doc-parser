import {
  TToken,
  TTokenizerMethod,
  TokenizerContext,
} from "../../src/tknz/tokenizer.ts";
import { describe, expect, it, beforeEach } from "../deps.ts";
import { newHtmlValueReader } from "../../src/tknz/html/html-values.ts";

describe("readHtmlAttribute", () => {
  function test(str: string, control: Record<string, any>) {
    const readToken = newHtmlValueReader();
    const ctx = new TokenizerContext(str);
    const result = readToken(ctx);
    try {
      expect(result).to.eql(control);
    } catch (error) {
      console.log(JSON.stringify(result, null, 2));
      throw error;
    }
  }
  it(`should read simple string values`, async () => {
    test("a", {
      type: "HtmlValue",
      value: "a",
      start: 0,
      end: 1,
      quoted: false,
      valueStart: 0,
      valueEnd: 1,
    });
    test("a:b-c", {
      type: "HtmlValue",
      value: "a:b-c",
      start: 0,
      end: 5,
      quoted: false,
      valueStart: 0,
      valueEnd: 5,
    });
  });

  it(`should read code blocks as values`, async () => {
    // In this test the inner block is interpreted as a code
    // because it is between backticks.
    test("${b `${c d e}` f} XYZ", {
      type: "HtmlValue",
      codeStart: 2,
      codeEnd: 16,
      code: [
        "b `",
        {
          type: "Code",
          codeStart: 7,
          codeEnd: 12,
          code: ["c d e"],
          start: 5,
          end: 13,
          value: "${c d e}",
        },
        "` f",
      ],
      start: 0,
      end: 17,
      value: "${b `${c d e}` f}",
      quoted: false,
      valueStart: 0,
      valueEnd: 17,
    });
  });

  it(`should read quoted values with code`, async () => {
    test("'a:b ${c d e} f' XYZ", {
      type: "HtmlValue",
      value: "'a:b ${c d e} f'",
      start: 0,
      end: 16,
      children: [
        {
          type: "Code",
          codeStart: 7,
          codeEnd: 12,
          code: ["c d e"],
          start: 5,
          end: 13,
          value: "${c d e}",
        },
      ],
      quoted: true,
      valueStart: 1,
      valueEnd: 15,
    });

    // The inner block is NOT interpreted because it is not in the
    // right context (between backticks).
    test("'a:${b ${c d e} f}g' XYZ", {
      type: "HtmlValue",
      value: "'a:${b ${c d e} f}g'",
      start: 0,
      end: 20,
      children: [
        {
          type: "Code",
          codeStart: 5,
          codeEnd: 17,
          code: ["b ${c d e} f"],
          start: 3,
          end: 18,
          value: "${b ${c d e} f}",
        },
      ],
      quoted: true,
      valueStart: 1,
      valueEnd: 19,
    });
    test("'a:${b ${c d e} f}g' XYZ", {
      type: "HtmlValue",
      value: "'a:${b ${c d e} f}g'",
      start: 0,
      end: 20,
      children: [
        {
          type: "Code",
          codeStart: 5,
          codeEnd: 17,
          code: ["b ${c d e} f"],
          start: 3,
          end: 18,
          value: "${b ${c d e} f}",
        },
      ],
      quoted: true,
      valueStart: 1,
      valueEnd: 19,
    });
  });

  it(`should read hierarchical code blocks between backticks`, async () => {
    // In this test the inner block is interpreted as a code
    // because it is between backticks.
    test("'a:${b `${c d e}` f}g' XYZ", {
      type: "HtmlValue",
      value: "'a:${b `${c d e}` f}g'",
      start: 0,
      end: 22,
      children: [
        {
          type: "Code",
          codeStart: 5,
          codeEnd: 19,
          code: [
            "b `",
            {
              type: "Code",
              codeStart: 10,
              codeEnd: 15,
              code: ["c d e"],
              start: 8,
              end: 16,
              value: "${c d e}",
            },
            "` f",
          ],
          start: 3,
          end: 20,
          value: "${b `${c d e}` f}",
        },
      ],
      quoted: true,
      valueStart: 1,
      valueEnd: 21,
    });

    test("'a:${b `${c ${not a code} e}` f}g' XYZ", {
      type: "HtmlValue",
      value: "'a:${b `${c ${not a code} e}` f}g'",
      start: 0,
      end: 34,
      children: [
        {
          type: "Code",
          codeStart: 5,
          codeEnd: 31,
          code: [
            "b `",
            {
              type: "Code",
              codeStart: 10,
              codeEnd: 27,
              code: ["c ${not a code} e"],
              start: 8,
              end: 28,
              value: "${c ${not a code} e}",
            },
            "` f",
          ],
          start: 3,
          end: 32,
          value: "${b `${c ${not a code} e}` f}",
        },
      ],
      quoted: true,
      valueStart: 1,
      valueEnd: 33,
    });
    test("'a:${b `${c `${embedded code}` e}` f}g' XYZ", {
      type: "HtmlValue",
      value: "'a:${b `${c `${embedded code}` e}` f}g'",
      start: 0,
      end: 39,
      children: [
        {
          type: "Code",
          codeStart: 5,
          codeEnd: 36,
          code: [
            "b `",
            {
              type: "Code",
              codeStart: 10,
              codeEnd: 32,
              code: [
                "c `",
                {
                  type: "Code",
                  codeStart: 15,
                  codeEnd: 28,
                  code: ["embedded code"],
                  start: 13,
                  end: 29,
                  value: "${embedded code}",
                },
                "` e",
              ],
              start: 8,
              end: 33,
              value: "${c `${embedded code}` e}",
            },
            "` f",
          ],
          start: 3,
          end: 37,
          value: "${b `${c `${embedded code}` e}` f}",
        },
      ],
      quoted: true,
      valueStart: 1,
      valueEnd: 38,
    });
  });

  it(`should read quoted values`, async () => {
    test("'a:b c d e f' XYZ", {
      type: "HtmlValue",
      value: "'a:b c d e f'",
      start: 0,
      end: 13,
      children: [],
      quoted: true,
      valueStart: 1,
      valueEnd: 12,
    });
    test('"a:b c d e f" XYZ', {
      type: "HtmlValue",
      value: '"a:b c d e f"',
      start: 0,
      end: 13,
      children: [],
      quoted: true,
      valueStart: 1,
      valueEnd: 12,
    });
    test("`a:b c d e f` XYZ", {
      type: "HtmlValue",
      value: "`a:b c d e f`",
      start: 0,
      end: 13,
      children: [],
      quoted: true,
      valueStart: 1,
      valueEnd: 12,
    });
  });

  it(`should detect entities in values with code blocks`, async () => {
    function testWithEntities(str: string, control: Record<string, any>) {
      const readEntity: TTokenizerMethod = (
        ctx: TokenizerContext
      ): TToken | undefined => {
        const start = ctx.i;
        console.log("I AM HERE!", start);
        if (
          ctx.getChar(+0) !== "(" ||
          ctx.getChar(+1) !== "c" ||
          ctx.getChar(+2) !== ")"
        )
          return;
        ctx.i += 3;
        return {
          type: "HtmlEntity",
          start,
          end: ctx.i,
          value: "&copy;",
        };
      };
      const readToken = newHtmlValueReader(readEntity);
      const ctx = new TokenizerContext(str);
      const result = readToken(ctx);
      try {
        expect(result).to.eql(control);
      } catch (error) {
        console.log(JSON.stringify(result, null, 2));
        throw error;
      }
    }

    testWithEntities("'a ${X (c) Y} b'", {
      type: "HtmlValue",
      value: "'a ${X (c) Y} b'",
      start: 0,
      end: 16,
      children: [
        {
          type: "Code",
          codeStart: 5,
          codeEnd: 12,
          code: [
            "X ",
            {
              type: "HtmlEntity",
              start: 7,
              end: 10,
              value: "&copy;",
            },
            " Y",
          ],
          start: 3,
          end: 13,
          value: "${X (c) Y}",
        },
      ],
      quoted: true,
      valueStart: 1,
      valueEnd: 15,
    });
  });
});
