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
        { type: "Spaces", value: " ", start: 0, end: 1 },
        { type: "Word", value: "A", start: 1, end: 2 },
        { type: "Spaces", value: " ", start: 2, end: 3 },
        {
          type: "Paranthesis",
          start: 3,
          end: 6,
          value: "(B)",
          children: [
            { type: "OpenParathesis", value: "(", start: 3, end: 4 },
            { type: "Word", value: "B", start: 4, end: 5 },
            { type: "CloseParathesis", value: ")", start: 5, end: 6 },
          ],
        },
        { type: "Spaces", value: " ", start: 6, end: 7 },
        { type: "Word", value: "C", start: 7, end: 8 },
        { type: "Spaces", value: " ", start: 8, end: 9 },
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
        { type: "Word", value: "A", start: 0, end: 1 },
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
            { type: "Word", value: "B", start: 2, end: 3 },
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
                { type: "Word", value: "C", start: 4, end: 5 },
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
                    { type: "Word", value: "D", start: 6, end: 7 },
                    {
                      type: "CloseBrackets",
                      value: "]",
                      start: 7,
                      end: 8,
                    },
                  ],
                },
                { type: "Word", value: "E", start: 8, end: 9 },
                {
                  type: "CloseParathesis",
                  value: ")",
                  start: 9,
                  end: 10,
                },
              ],
            },
            { type: "Word", value: "F", start: 10, end: 11 },
            {
              type: "CloseCurlyBrackets",
              value: "}",
              start: 11,
              end: 12,
            },
          ],
        },
        { type: "Word", value: "G", start: 12, end: 13 },
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
        { type: "Word", value: "A", start: 0, end: 1 },
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
            { type: "Word", value: "B", start: 2, end: 3 },
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
                { type: "Word", value: "C", start: 4, end: 5 },
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
                    { type: "Word", value: "D", start: 6, end: 7 },
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
        { type: "Word", value: "G", start: 8, end: 9 },
      ],
    },
  },

  {
    input: "A{B(C[D)E]F}G",
    description:
      "should be resilient to wrong-paired fences; the impaired fences are recognized as punctuation",
    expected: {
      type: "Block",
      start: 0,
      end: 13,
      value: "A{B(C[D)E]F}G",
      children: [
        { type: "Word", value: "A", start: 0, end: 1 },
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
            { type: "Word", value: "B", start: 2, end: 3 },
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
                { type: "Word", value: "C", start: 4, end: 5 },
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
                    { type: "Word", value: "D", start: 6, end: 7 },
                  ],
                },
                {
                  type: "CloseParathesis",
                  value: ")",
                  start: 7,
                  end: 8,
                },
              ],
            },
            { type: "Word", value: "E", start: 8, end: 9 },
            { type: "Punctuation", value: "]", start: 9, end: 10 },
            { type: "Word", value: "F", start: 10, end: 11 },
            {
              type: "CloseCurlyBrackets",
              value: "}",
              start: 11,
              end: 12,
            },
          ],
        },
        { type: "Word", value: "G", start: 12, end: 13 },
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
            { type: "Word", value: "c", start: 1, end: 2 },
            { type: "CloseParathesis", value: ")", start: 2, end: 3 },
          ],
        },
        { type: "Spaces", value: " ", start: 3, end: 4 },
        {
          type: "Paranthesis",
          start: 4,
          end: 7,
          value: "(C)",
          children: [
            { type: "OpenParathesis", value: "(", start: 4, end: 5 },
            { type: "Word", value: "C", start: 5, end: 6 },
            { type: "CloseParathesis", value: ")", start: 6, end: 7 },
          ],
        },
        { type: "Spaces", value: " ", start: 7, end: 8 },
        {
          type: "Paranthesis",
          start: 8,
          end: 11,
          value: "(r)",
          children: [
            { type: "OpenParathesis", value: "(", start: 8, end: 9 },
            { type: "Word", value: "r", start: 9, end: 10 },
            { type: "CloseParathesis", value: ")", start: 10, end: 11 },
          ],
        },
        { type: "Spaces", value: " ", start: 11, end: 12 },
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
            { type: "Word", value: "R", start: 13, end: 14 },
            { type: "CloseParathesis", value: ")", start: 14, end: 15 },
          ],
        },
        { type: "Spaces", value: " ", start: 15, end: 16 },
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
            { type: "Word", value: "tm", start: 17, end: 19 },
            { type: "CloseParathesis", value: ")", start: 19, end: 20 },
          ],
        },
        { type: "Spaces", value: " ", start: 20, end: 21 },
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
            { type: "Word", value: "TM", start: 22, end: 24 },
            { type: "CloseParathesis", value: ")", start: 24, end: 25 },
          ],
        },
        { type: "Spaces", value: " ", start: 25, end: 26 },
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
            { type: "Word", value: "p", start: 27, end: 28 },
            { type: "CloseParathesis", value: ")", start: 28, end: 29 },
          ],
        },
        { type: "Spaces", value: " ", start: 29, end: 30 },
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
            { type: "Word", value: "P", start: 31, end: 32 },
            { type: "CloseParathesis", value: ")", start: 32, end: 33 },
          ],
        },
        { type: "Spaces", value: " ", start: 33, end: 34 },
        { type: "Punctuation", value: "-", start: 35, end: 36 },
        { type: "Spaces", value: " ", start: 36, end: 37 },
        { type: "Punctuation", value: "?!!.....", start: 37, end: 45 },
      ],
    },
  },
];
