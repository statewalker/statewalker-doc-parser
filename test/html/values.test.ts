import {
  type TToken,
  type TTokenizerMethod,
  TokenizerContext,
} from "../../src/base/index.ts";
import { newCodeReader } from "../../src/code/index.ts";
import { newHtmlValueReader } from "../../src/html/index.ts";
import { describe, expect, it } from "../deps.ts";

describe("readHtmlAttribute", () => {
  function test(str: string, control: Record<string, any>) {
    const readCode = newCodeReader();
    const readToken = newHtmlValueReader(readCode);
    const ctx = new TokenizerContext(str);
    const result = readToken(ctx);
    try {
      expect(result).to.eql(control);
    } catch (error) {
      console.log(JSON.stringify(result, null, 2));
      throw error;
    }
  }
  it("should read simple string values", async () => {
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

  it("should read code blocks as values", async () => {
    // In this test the inner block is interpreted as a code
    // because it is between backticks.
    test("${b `${c d e}` f} XYZ", {
      type: "HtmlValue",
      quoted: false,
      start: 0,
      end: 17,
      valueStart: 0,
      valueEnd: 17,
      value: "${b `${c d e}` f}",
      children: [
        {
          type: "Code",
          codeStart: 2,
          codeEnd: 16,
          start: 0,
          end: 17,
          value: "${b `${c d e}` f}",
          children: [
            {
              type: "Code",
              codeStart: 7,
              codeEnd: 12,
              start: 5,
              end: 13,
              value: "${c d e}",
            },
          ],
        },
      ],
    });
  });

  it("should read quoted values with code", async () => {
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

  it("should read hierarchical code blocks between backticks", async () => {
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
          start: 3,
          end: 20,
          value: "${b `${c d e}` f}",
          children: [
            {
              type: "Code",
              codeStart: 10,
              codeEnd: 15,
              start: 8,
              end: 16,
              value: "${c d e}",
            },
          ],
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
          start: 3,
          end: 32,
          value: "${b `${c ${not a code} e}` f}",
          children: [
            {
              type: "Code",
              codeStart: 10,
              codeEnd: 27,
              start: 8,
              end: 28,
              value: "${c ${not a code} e}",
            },
          ],
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
          start: 3,
          end: 37,
          value: "${b `${c `${embedded code}` e}` f}",
          children: [
            {
              type: "Code",
              codeStart: 10,
              codeEnd: 32,
              start: 8,
              end: 33,
              value: "${c `${embedded code}` e}",
              children: [
                {
                  type: "Code",
                  codeStart: 15,
                  codeEnd: 28,
                  start: 13,
                  end: 29,
                  value: "${embedded code}",
                },
              ],
            },
          ],
        },
      ],
      quoted: true,
      valueStart: 1,
      valueEnd: 38,
    });
  });

  it("should read quoted values", async () => {
    test("'a:b c d e f' XYZ", {
      type: "HtmlValue",
      value: "'a:b c d e f'",
      start: 0,
      end: 13,
      quoted: true,
      valueStart: 1,
      valueEnd: 12,
    });
    test('"a:b c d e f" XYZ', {
      type: "HtmlValue",
      value: '"a:b c d e f"',
      start: 0,
      end: 13,
      quoted: true,
      valueStart: 1,
      valueEnd: 12,
    });
    test("`a:b c d e f` XYZ", {
      type: "HtmlValue",
      value: "`a:b c d e f`",
      start: 0,
      end: 13,
      quoted: true,
      valueStart: 1,
      valueEnd: 12,
    });
  });

  it("should detect entities in values with code blocks", async () => {
    function testWithEntities(str: string, control: Record<string, any>) {
      const readEntity: TTokenizerMethod = (
        ctx: TokenizerContext
      ): TToken | undefined => {
        const start = ctx.i;
        if (
          ctx.getChar(+0) !== "(" ||
          ctx.getChar(+1) !== "c" ||
          ctx.getChar(+2) !== ")"
        )
          return;
        ctx.i += 3;
        const end = ctx.i;
        return {
          type: "HtmlEntity",
          start,
          end,
          value: ctx.substring(start, end),
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
          type: "HtmlEntity",
          start: 7,
          end: 10,
          value: "(c)",
        },
      ],
      quoted: true,
      valueStart: 1,
      valueEnd: 15,
    });
  });
});
