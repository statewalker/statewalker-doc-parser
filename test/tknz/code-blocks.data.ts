import { TTestData } from "./data.types";

export const testData: TTestData[] = [
  {
    description: "should read embeded code blocks",
    input: "before ${ js `${inner code}` md```code\n``` } after",
    expected: [
      {
        type: "Text",
        start: 0,
        end: 6,
        value: "before",
      },
      {
        type: "Space",
        start: 6,
        end: 7,
        value: " ",
      },
      {
        type: "Code",
        codeStart: 9,
        codeEnd: 43,
        code: [
          " js `",
          {
            type: "Code",
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
      {
        type: "Space",
        start: 44,
        end: 45,
        value: " ",
      },
      {
        type: "Text",
        start: 45,
        end: 50,
        value: "after",
      },
    ],
  },
  {
    input: "first\n${ inner \n\n\n code }\nsecond",
    description:
      "should read paragraphs containing code blocks with empty lines",
    expected: [
      {
        type: "Text",
        start: 0,
        end: 5,
        value: "first",
      },
      {
        type: "Eol",
        start: 5,
        end: 6,
        value: "\n",
      },
      {
        type: "Code",
        codeStart: 8,
        codeEnd: 24,
        code: [" inner \n\n\n code "],
        start: 6,
        end: 25,
        value: "${ inner \n\n\n code }",
      },
      {
        type: "Eol",
        start: 25,
        end: 26,
        value: "\n",
      },
      {
        type: "Text",
        start: 26,
        end: 32,
        value: "second",
      },
    ],
  },

  {
    input: "before ${code} after",
    description: "should read text with code blocks",
    expected: [
      {
        type: "Text",
        start: 0,
        end: 6,
        value: "before",
      },
      {
        type: "Space",
        start: 6,
        end: 7,
        value: " ",
      },
      {
        type: "Code",
        codeStart: 9,
        codeEnd: 13,
        code: ["code"],
        start: 7,
        end: 14,
        value: "${code}",
      },
      {
        type: "Space",
        start: 14,
        end: 15,
        value: " ",
      },
      {
        type: "Text",
        start: 15,
        end: 20,
        value: "after",
      },
    ],
  },
  {
    input: "before ${A1 `B1 ${C1 `${third level}` C2} B2` A2} after",
    description: "should read hierarchical code blocks",
    expected: [
      {
        type: "Text",
        start: 0,
        end: 6,
        value: "before",
      },
      {
        type: "Space",
        start: 6,
        end: 7,
        value: " ",
      },
      {
        type: "Code",
        codeStart: 9,
        codeEnd: 48,
        code: [
          "A1 `B1 ",
          {
            type: "Code",
            codeStart: 18,
            codeEnd: 40,
            code: [
              "C1 `",
              {
                type: "Code",
                codeStart: 24,
                codeEnd: 35,
                code: ["third level"],
                start: 22,
                end: 36,
                value: "${third level}",
              },
              "` C2",
            ],
            start: 16,
            end: 41,
            value: "${C1 `${third level}` C2}",
          },
          " B2` A2",
        ],
        start: 7,
        end: 49,
        value: "${A1 `B1 ${C1 `${third level}` C2} B2` A2}",
      },
      {
        type: "Space",
        start: 49,
        end: 50,
        value: " ",
      },
      {
        type: "Text",
        start: 50,
        end: 55,
        value: "after",
      },
    ],
  },
];
