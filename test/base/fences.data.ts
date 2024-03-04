import { type TTestData } from "../data.types.ts";

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
          value: "(B)",
          children: [
            { type: "OpenParathesis", value: "(", start: 3, end: 4 },
            { type: "CloseParathesis", value: ")", start: 5, end: 6 },
          ],
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
          value: "{B(C[D]E)F}",
          children: [
            {
              type: "OpenCurlyBrackets",
              value: "{",
              start: 1,
              end: 2,
            },
            {
              type: "Paranthesis",
              start: 3,
              end: 10,
              value: "(C[D]E)",
              children: [
                {
                  type: "OpenParathesis",
                  value: "(",
                  start: 3,
                  end: 4,
                },
                {
                  type: "Brackets",
                  start: 5,
                  end: 8,
                  value: "[D]",
                  children: [
                    {
                      type: "OpenBrackets",
                      value: "[",
                      start: 5,
                      end: 6,
                    },
                    {
                      type: "CloseBrackets",
                      value: "]",
                      start: 7,
                      end: 8,
                    },
                  ],
                },
                {
                  type: "CloseParathesis",
                  value: ")",
                  start: 9,
                  end: 10,
                },
              ],
            },
            {
              type: "CloseCurlyBrackets",
              value: "}",
              start: 11,
              end: 12,
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
          value: "{B(C[D}",
          children: [
            {
              type: "OpenCurlyBrackets",
              value: "{",
              start: 1,
              end: 2,
            },
            {
              type: "Paranthesis",
              start: 3,
              end: 7,
              value: "(C[D",
              children: [
                {
                  type: "OpenParathesis",
                  value: "(",
                  start: 3,
                  end: 4,
                },
                {
                  type: "Brackets",
                  start: 5,
                  end: 7,
                  value: "[D",
                  children: [
                    {
                      type: "OpenBrackets",
                      value: "[",
                      start: 5,
                      end: 6,
                    },
                  ],
                },
              ],
            },
            {
              type: "CloseCurlyBrackets",
              value: "}",
              start: 7,
              end: 8,
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
          value: "{B(C[D)E]F}",
          children: [
            {
              type: "OpenCurlyBrackets",
              value: "{",
              start: 1,
              end: 2,
            },
            {
              type: "Paranthesis",
              start: 3,
              end: 8,
              value: "(C[D)",
              children: [
                {
                  type: "OpenParathesis",
                  value: "(",
                  start: 3,
                  end: 4,
                },
                {
                  type: "Brackets",
                  start: 5,
                  end: 7,
                  children: [
                    {
                      type: "OpenBrackets",
                      value: "[",
                      start: 5,
                      end: 6,
                    },
                  ],
                  value: "[D",
                },
                {
                  type: "CloseParathesis",
                  value: ")",
                  start: 7,
                  end: 8,
                },
              ],
            },
            {
              type: "CloseCurlyBrackets",
              value: "}",
              start: 11,
              end: 12,
            },
          ],
        },
      ],
    },
  },

  {
    input: "(c) (C) (r) (R) (tm) (TM) (p) (P) +- ?!!.....",
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
          value: "(c)",
          children: [
            { type: "OpenParathesis", value: "(", start: 0, end: 1 },
            { type: "CloseParathesis", value: ")", start: 2, end: 3 },
          ],
        },
        {
          type: "Paranthesis",
          start: 4,
          end: 7,
          value: "(C)",
          children: [
            { type: "OpenParathesis", value: "(", start: 4, end: 5 },
            { type: "CloseParathesis", value: ")", start: 6, end: 7 },
          ],
        },
        {
          type: "Paranthesis",
          start: 8,
          end: 11,
          value: "(r)",
          children: [
            { type: "OpenParathesis", value: "(", start: 8, end: 9 },
            { type: "CloseParathesis", value: ")", start: 10, end: 11 },
          ],
        },
        {
          type: "Paranthesis",
          start: 12,
          end: 15,
          value: "(R)",
          children: [
            {
              type: "OpenParathesis",
              value: "(",
              start: 12,
              end: 13,
            },
            { type: "CloseParathesis", value: ")", start: 14, end: 15 },
          ],
        },
        {
          type: "Paranthesis",
          start: 16,
          end: 20,
          value: "(tm)",
          children: [
            {
              type: "OpenParathesis",
              value: "(",
              start: 16,
              end: 17,
            },
            { type: "CloseParathesis", value: ")", start: 19, end: 20 },
          ],
        },
        {
          type: "Paranthesis",
          start: 21,
          end: 25,
          value: "(TM)",
          children: [
            {
              type: "OpenParathesis",
              value: "(",
              start: 21,
              end: 22,
            },
            { type: "CloseParathesis", value: ")", start: 24, end: 25 },
          ],
        },
        {
          type: "Paranthesis",
          start: 26,
          end: 29,
          value: "(p)",
          children: [
            {
              type: "OpenParathesis",
              value: "(",
              start: 26,
              end: 27,
            },
            { type: "CloseParathesis", value: ")", start: 28, end: 29 },
          ],
        },
        {
          type: "Paranthesis",
          start: 30,
          end: 33,
          value: "(P)",
          children: [
            {
              type: "OpenParathesis",
              value: "(",
              start: 30,
              end: 31,
            },
            { type: "CloseParathesis", value: ")", start: 32, end: 33 },
          ],
        },
      ],
    },
  },
];
