import { read } from "fs";
import {
  newDynamicFencedBlockReader,
  newFencedBlockReader,
} from "../../src/tknz/blocks.ts";
import { newCodeReader } from "../../src/tknz/code-blocks.ts";
import {
  TToken,
  TTokenizerMethod,
  TokenizerContext,
  newCompositeTokenizer,
} from "../../src/tknz/tokenizer.ts";
import { describe, expect, it, beforeEach } from "../deps.ts";

function newCharReader(type: string, check: (char: string) => boolean) {
  return (ctx: TokenizerContext) => {
    const char = ctx.getChar();
    if (!check(char)) return;
    const start = ctx.i;
    const end = ++ctx.i;
    return {
      type,
      value: char,
      start,
      end,
    };
  };
}
function newCharsReader(type: string, check: (char: string) => boolean) {
  return (ctx: TokenizerContext) =>
    ctx.guard(() => {
      const start = ctx.i;
      while (ctx.i < ctx.length) {
        const char = ctx.getChar();
        if (!check(char)) break;
        ctx.i++;
      }
      const end = ctx.i;
      if (start === end) return;
      return {
        type,
        value: ctx.substring(start, end),
        start,
        end,
      };
    });
}

function newQuotedTextReader(
  newTokensReader: (token: TToken) => TTokenizerMethod | undefined = () =>
    undefined
): TTokenizerMethod {
  const readQuotedText = newDynamicFencedBlockReader(
    "QuotedText",
    newCharReader(
      "QuoteOpen",
      (char) => char === '"' || char === "'" || char === "`"
    ),
    newTokensReader,
    (quote: TToken) =>
      newCharReader("QuoteClose", (char) => char === quote.value)
  );
  return (ctx: TokenizerContext) => {
    const token = readQuotedText(ctx);
    if (!token) return;
    const { type, value, start, end, children } = token;
    return { type, value, start, end, children };
  };
}

describe("readHtmlAttribute", () => {
  function newValueReader(readToken?: TTokenizerMethod) {
    const tokenizers: TTokenizerMethod[] = [];
    if (readToken) tokenizers.push(readToken);
    const result = newCompositeTokenizer(tokenizers);
    {
      const readCode = newCodeReader();
      tokenizers.push(readCode);

      const readQuotedText = newQuotedTextReader(() => readCode);
      tokenizers.push(readQuotedText);

      tokenizers.push(
        newCharsReader("String", (char) => {
          return !!char.match(/\S/);
        })
      );
    }
    return result;
  }

  function test(str: string, control: Record<string, any>) {
    const readToken = newValueReader();
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
      type: "String",
      value: "a",
      start: 0,
      end: 1,
    });
    test("a:b-c", {
      type: "String",
      value: "a:b-c",
      start: 0,
      end: 5,
    });
  });

  it(`should read quoted values with code`, async () => {
    test("'a:b ${c d e} f' XYZ", {
      type: "QuotedText",
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
    });

    // The inner block is NOT interpreted because it is not in the
    // right context (between backticks).
    test("'a:${b ${c d e} f}g' XYZ", {
      type: "QuotedText",
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
    });
    test("'a:${b ${c d e} f}g' XYZ", {
      type: "QuotedText",
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
    });
  });

  it(`should read hierarchical code blocks between backticks`, async () => {
    // In this test the inner block is interpreted as a code
    // because it is between backticks.
    test("'a:${b `${c d e}` f}g' XYZ", {
      type: "QuotedText",
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
    });

    test("'a:${b `${c ${not a code} e}` f}g' XYZ", {
      type: "QuotedText",
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
    });
    test("'a:${b `${c `${embedded code}` e}` f}g' XYZ", {
      type: "QuotedText",
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
    });
  });

  it(`should read quoted values`, async () => {
    test("'a:b c d e f' XYZ", {
      type: "QuotedText",
      value: "'a:b c d e f'",
      start: 0,
      end: 13,
      children: [],
    });
    test('"a:b c d e f" XYZ', {
      type: "QuotedText",
      value: '"a:b c d e f"',
      start: 0,
      end: 13,
      children: [],
    });
    test("`a:b c d e f` XYZ", {
      type: "QuotedText",
      value: "`a:b c d e f`",
      start: 0,
      end: 13,
      children: [],
    });
  });
});

// it(`should read attributes with undefined values`, async () => {
//   test("a = ", {
//     type: "HtmlAttribute",
//     name: "a",
//     nameStart: 0,
//     nameEnd: 1,
//     start: 0,
//     end: 4,
//   });
// });

// it(`should read simple attribute values`, async () => {
//   test("a=b", {
//     type: "HtmlAttribute",
//     name: "a",
//     nameStart: 0,
//     nameEnd: 1,
//     value: ["b"],
//     valueStart: 2,
//     valueEnd: 3,
//     start: 0,
//     end: 3,
//   });
// });

// it(`should read simple attribute values separated by spaces`, async () => {
//   test("a    =     b:cd:ef$gh", {
//     type: "HtmlAttribute",
//     name: "a",
//     nameStart: 0,
//     nameEnd: 1,
//     value: ["b:cd:ef$gh"],
//     valueStart: 11,
//     valueEnd: 21,
//     start: 0,
//     end: 21,
//   });
// });

// it(`should read simple attribute values with code blocks`, async () => {
//   test("a    =     'b:${\n foo='Foo' bar=\"Bar\" hello \n}:c'", {
//     type: "HtmlAttribute",
//     name: "a",
//     nameStart: 0,
//     nameEnd: 1,
//     value: ["b:cd:ef$gh"],
//     valueStart: 11,
//     valueEnd: 21,
//     value: [
//       "b:",
//       {
//         type: "Code",
//         code: ["\n foo='Foo' bar=\"Bar\" hello \n"],
//         codeStart: 16,
//         codeEnd: 45,
//         start: 14,
//         end: 46,
//       },
//       ":c",
//     ],
//     valueStart: 11,
//     valueEnd: 49,
//     start: 0,
//     end: 49,
//   });
// });

// it(`should read attribute values containing non-quoted code blocks`, async () => {
//   test("a    =     ${\n foo='Foo' bar=\"Bar\" hello \n}", {
//     type: "HtmlAttribute",
//     name: "a",
//     nameStart: 0,
//     nameEnd: 1,
//     value: [
//       {
//         type: "Code",
//         code: ["\n foo='Foo' bar=\"Bar\" hello \n"],
//         codeStart: 13,
//         codeEnd: 42,
//         start: 11,
//         end: 43,
//       },
//     ],
//     valueStart: 11,
//     valueEnd: 43,
//     start: 0,
//     end: 43,
//   });

//   test("a    =     b:${\n foo='Foo' bar=\"Bar\" hello \n}", {
//     type: "HtmlAttribute",
//     name: "a",
//     nameStart: 0,
//     nameEnd: 1,
//     value: [
//       "b:",
//       {
//         type: "Code",
//         code: ["\n foo='Foo' bar=\"Bar\" hello \n"],
//         codeStart: 15,
//         codeEnd: 44,
//         start: 13,
//         end: 45,
//       },
//     ],
//     valueStart: 11,
//     valueEnd: 45,
//     start: 0,
//     end: 45,
//   });

//   test("a    =     ${\n foo='Foo' bar=\"Bar\" hello \n}:c", {
//     type: "HtmlAttribute",
//     name: "a",
//     nameStart: 0,
//     nameEnd: 1,
//     value: [
//       {
//         type: "Code",
//         code: ["\n foo='Foo' bar=\"Bar\" hello \n"],
//         codeStart: 13,
//         codeEnd: 42,
//         start: 11,
//         end: 43,
//       },
//       ":c",
//     ],
//     valueStart: 11,
//     valueEnd: 45,
//     start: 0,
//     end: 45,
//   });

//   test("a    =     b:${\n foo='Foo' bar=\"Bar\" hello \n}:c", {
//     type: "HtmlAttribute",
//     name: "a",
//     nameStart: 0,
//     nameEnd: 1,
//     value: [
//       "b:",
//       {
//         type: "Code",
//         code: ["\n foo='Foo' bar=\"Bar\" hello \n"],
//         codeStart: 15,
//         codeEnd: 44,
//         start: 13,
//         end: 45,
//       },
//       ":c",
//     ],
//     valueStart: 11,
//     valueEnd: 47,
//     start: 0,
//     end: 47,
//   });
// });

// it(`should read attribute values containing non-quoted code blocks`, async () => {
//   test("a = ${x}${y}${z}", {
//     type: "HtmlAttribute",
//     name: "a",
//     nameStart: 0,
//     nameEnd: 1,
//     start: 0,
//     end: 16,
//     value: [
//       {
//         type: "Code",
//         codeStart: 6,
//         codeEnd: 7,
//         code: ["x"],
//         start: 4,
//         end: 8,
//       },
//       {
//         type: "Code",
//         codeStart: 10,
//         codeEnd: 11,
//         code: ["y"],
//         start: 8,
//         end: 12,
//       },
//       {
//         type: "Code",
//         codeStart: 14,
//         codeEnd: 15,
//         code: ["z"],
//         start: 12,
//         end: 16,
//       },
//     ],
//     valueStart: 4,
//     valueEnd: 16,
//   });
// });

// return it(`should read attributes key/value pairs on multiple lines`, async () => {
//   test(
//     `abc:$my-description
//        =
//         'b:\${
//          <MyInternalWidget
//            foo='\${<Foo bar="Baz">}'
//            bar=\"Bar\" hello>
//         }:c
//      '"
//  `,
//     {
//       type: "HtmlAttribute",
//       name: "abc:$my-description",
//       nameStart: 0,
//       nameEnd: 19,
//       value: [
//         "b:",
//         {
//           type: "Code",
//           code: [
//             '\n           <MyInternalWidget\n             foo=\'${<Foo bar="Baz">}\'\n             bar="Bar" hello>\n          ',
//           ],
//           codeStart: 50,
//           codeEnd: 158,
//           start: 48,
//           end: 159,
//         },
//         ":c\n       ",
//       ],
//       valueStart: 45,
//       valueEnd: 170,
//       start: 0,
//       end: 170,
//     }
//   );
// });
// });
