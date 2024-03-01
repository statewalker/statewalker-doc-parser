import { TTestData } from "../data.types.ts";

export const testData: TTestData[] = [
  {
    input: " A (B) C ",
    description: "should recognize paranthesis",
    expected: {
      type: "Block",
      start: 0,
      end: 9,
      value: " A (B) C ",
      children: [
        {
          type: "Paranthesis",
          start: 3,
          end: 6,
          startToken: { type: "OpenParathesis", value: "(", start: 3, end: 4 },
          value: "(B)",
          endToken: { type: "CloseParathesis", value: ")", start: 5, end: 6 },
        },
      ],
    },
  },
  {
    input: "A{B(C[D]E)F}G",
    description: "should read mixed brackets",
    expected: {
      type: "Block",
      start: 0,
      end: 13,
      value: "A{B(C[D]E)F}G",
      children: [
        {
          type: "CurlyBrackets",
          start: 1,
          end: 12,
          startToken: {
            type: "OpenCurlyBrackets",
            value: "{",
            start: 1,
            end: 2,
          },
          value: "{B(C[D]E)F}",
          endToken: {
            type: "CloseCurlyBrackets",
            value: "}",
            start: 11,
            end: 12,
          },
          children: [
            {
              type: "Paranthesis",
              start: 3,
              end: 10,
              startToken: {
                type: "OpenParathesis",
                value: "(",
                start: 3,
                end: 4,
              },
              value: "(C[D]E)",
              endToken: {
                type: "CloseParathesis",
                value: ")",
                start: 9,
                end: 10,
              },
              children: [
                {
                  type: "Brackets",
                  start: 5,
                  end: 8,
                  startToken: {
                    type: "OpenBrackets",
                    value: "[",
                    start: 5,
                    end: 6,
                  },
                  value: "[D]",
                  endToken: {
                    type: "CloseBrackets",
                    value: "]",
                    start: 7,
                    end: 8,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    input: "A{B(C[D}G",
    description: "should be resilient to non-closed fences",
    expected: {
      type: "Block",
      start: 0,
      end: 9,
      value: "A{B(C[D}G",
      children: [
        {
          type: "CurlyBrackets",
          start: 1,
          end: 8,
          startToken: {
            type: "OpenCurlyBrackets",
            value: "{",
            start: 1,
            end: 2,
          },
          value: "{B(C[D}",
          endToken: {
            type: "CloseCurlyBrackets",
            value: "}",
            start: 7,
            end: 8,
          },
          children: [
            {
              type: "Paranthesis",
              start: 3,
              end: 7,
              startToken: {
                type: "OpenParathesis",
                value: "(",
                start: 3,
                end: 4,
              },
              value: "(C[D",
              children: [
                {
                  type: "Brackets",
                  start: 5,
                  end: 7,
                  startToken: {
                    type: "OpenBrackets",
                    value: "[",
                    start: 5,
                    end: 6,
                  },
                  value: "[D",
                },
              ],
            },
          ],
        },
      ],
    },
  },

  {
    input: "A{B(C[D)E]F}G",
    description:
      "should be resilient to wrong-paired fences; the impaired fences are omitted",
    expected: {
      type: "Block",
      start: 0,
      end: 13,
      value: "A{B(C[D)E]F}G",
      children: [
        {
          type: "CurlyBrackets",
          start: 1,
          end: 12,
          startToken: {
            type: "OpenCurlyBrackets",
            value: "{",
            start: 1,
            end: 2,
          },
          value: "{B(C[D)E]F}",
          endToken: {
            type: "CloseCurlyBrackets",
            value: "}",
            start: 11,
            end: 12,
          },
          children: [
            {
              type: "Paranthesis",
              start: 3,
              end: 8,
              startToken: {
                type: "OpenParathesis",
                value: "(",
                start: 3,
                end: 4,
              },
              value: "(C[D)",
              endToken: {
                type: "CloseParathesis",
                value: ")",
                start: 7,
                end: 8,
              },
              children: [
                {
                  type: "Brackets",
                  start: 5,
                  end: 7,
                  startToken: {
                    type: "OpenBrackets",
                    value: "[",
                    start: 5,
                    end: 6,
                  },
                  value: "[D",
                },
              ],
            },
          ],
        },
      ],
    },
  },

  {
    input: `(c) (C) (r) (R) (tm) (TM) (p) (P) +- ?!!.....`,
    description: "should read blocks with opening/closing parathesis",
    expected: {
      type: "Block",
      start: 0,
      end: 45,
      value: "(c) (C) (r) (R) (tm) (TM) (p) (P) +- ?!!.....",
      children: [
        {
          type: "Paranthesis",
          start: 0,
          end: 3,
          startToken: { type: "OpenParathesis", value: "(", start: 0, end: 1 },
          value: "(c)",
          endToken: { type: "CloseParathesis", value: ")", start: 2, end: 3 },
        },
        {
          type: "Paranthesis",
          start: 4,
          end: 7,
          startToken: { type: "OpenParathesis", value: "(", start: 4, end: 5 },
          value: "(C)",
          endToken: { type: "CloseParathesis", value: ")", start: 6, end: 7 },
        },
        {
          type: "Paranthesis",
          start: 8,
          end: 11,
          startToken: { type: "OpenParathesis", value: "(", start: 8, end: 9 },
          value: "(r)",
          endToken: { type: "CloseParathesis", value: ")", start: 10, end: 11 },
        },
        {
          type: "Paranthesis",
          start: 12,
          end: 15,
          startToken: {
            type: "OpenParathesis",
            value: "(",
            start: 12,
            end: 13,
          },
          value: "(R)",
          endToken: { type: "CloseParathesis", value: ")", start: 14, end: 15 },
        },
        {
          type: "Paranthesis",
          start: 16,
          end: 20,
          startToken: {
            type: "OpenParathesis",
            value: "(",
            start: 16,
            end: 17,
          },
          value: "(tm)",
          endToken: { type: "CloseParathesis", value: ")", start: 19, end: 20 },
        },
        {
          type: "Paranthesis",
          start: 21,
          end: 25,
          startToken: {
            type: "OpenParathesis",
            value: "(",
            start: 21,
            end: 22,
          },
          value: "(TM)",
          endToken: { type: "CloseParathesis", value: ")", start: 24, end: 25 },
        },
        {
          type: "Paranthesis",
          start: 26,
          end: 29,
          startToken: {
            type: "OpenParathesis",
            value: "(",
            start: 26,
            end: 27,
          },
          value: "(p)",
          endToken: { type: "CloseParathesis", value: ")", start: 28, end: 29 },
        },
        {
          type: "Paranthesis",
          start: 30,
          end: 33,
          startToken: {
            type: "OpenParathesis",
            value: "(",
            start: 30,
            end: 31,
          },
          value: "(P)",
          endToken: { type: "CloseParathesis", value: ")", start: 32, end: 33 },
        },
      ],
    },
  },
];
