import { TTestData } from "./data.types.ts";

export type TGramTestData = TTestData & {
  before: string;
  after: string;
};

export const gramTestData: TGramTestData[] = [
  {
    description: "should read spaces",
    input: "before     after",
    before: "before",
    after: "after",
    expected: {
      type: "Space",
      level: 0,
      start: 6,
      end: 11,
      value: "     ",
    },
  },
  {
    description: "should read punctuation symbols",
    input: "before.,;'\"`after",
    before: "before",
    after: "after",
    expected: {
      type: "Punctuation",
      level: 0,
      start: 6,
      end: 12,
      value: ".,;'\"`",
    },
  },
  {
    description: "should read backqoutes as punctuation symbols",
    input: "before`after",
    before: "before",
    after: "after",
    expected: {
      type: "Punctuation",
      level: 0,
      start: 6,
      end: 7,
      value: "`",
    },
  },
  {
    description: "should read format symbols",
    input: "before\xADafter",
    before: "before",
    after: "after",
    expected: {
      type: "Format",
      level: 0,
      start: 6,
      end: 7,
      value: "\xAD",
    },
  },
  {
    description: "should read code blocks starting from a specified position",
    input: "before ${ js `${inner code}` md```code\n``` } after",
    before: "before ",
    after: " after",
    expected: {
      type: "Code",
      level: 0,
      codeStart: 9,
      codeEnd: 43,
      code: [
        " js `",
        {
          type: "Code",
          level: 0,
          codeStart: 16,
          codeEnd: 26,
          code: ["inner code"],
          start: 14,
          end: 27,
          value: "${inner code}",
        },
        "` md```code\n``` ",
      ],
      start: 7,
      end: 44,
      value: "${ js `${inner code}` md```code\n``` }",
    },
  },
];
