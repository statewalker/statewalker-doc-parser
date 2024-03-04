import { type TTestData } from "../data.types.ts";

export const testData: TTestData[] = [
  {
    description: "should tokenize hierarchical MD code blocks",
    input: `
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
    expected: {
      type: "Block",
      start: 0,
      end: 141,
      value:
        "\n    before \n    ```ts\n    First Typescript Block\n    ```js\n    Internal Javascript Block\n    ```\n    Typescript Again\n    ```\n    after\n    ",
      children: [
        {
          type: "MdCodeBlock",
          start: 12,
          end: 22,
          value: "\n    ```ts",
          children: [
            {
              type: "MdCodeBlockStart",
              start: 12,
              end: 22,
              value: "\n    ```ts",
              meta: "ts",
            },
            { type: "MdCodeBlockEnd", start: 22, end: 22, value: "" },
          ],
          meta: "ts",
        },
        {
          type: "MdCodeBlock",
          start: 49,
          end: 59,
          value: "\n    ```js",
          children: [
            {
              type: "MdCodeBlockStart",
              start: 49,
              end: 59,
              value: "\n    ```js",
              meta: "js",
            },
            { type: "MdCodeBlockEnd", start: 59, end: 59, value: "" },
          ],
          meta: "js",
        },
        {
          type: "MdCodeBlock",
          start: 89,
          end: 97,
          value: "\n    ```",
          children: [
            {
              type: "MdCodeBlockStart",
              start: 89,
              end: 97,
              value: "\n    ```",
            },
            { type: "MdCodeBlockEnd", start: 97, end: 97, value: "" },
          ],
        },
        {
          type: "MdCodeBlock",
          start: 118,
          end: 126,
          value: "\n    ```",
          children: [
            {
              type: "MdCodeBlockStart",
              start: 118,
              end: 126,
              value: "\n    ```",
            },
            { type: "MdCodeBlockEnd", start: 126, end: 126, value: "" },
          ],
        },
      ],
    },
  },
];
