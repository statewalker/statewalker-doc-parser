import { type TTestData } from "../data.types.ts";

export const testData: TTestData[] = [
  {
    description: "should tokenize sequence of MD code blocks",
    input: `
    before 
    \`\`\`ts
    First Typescript Block
    \`\`\`

    \`\`\`js
    Javascript Block
    \`\`\`

    \`\`\`
    Simple Fenced Block
    \`\`\`
    after
    `,
    expected: {
      type: "Block",
      start: 0,
      end: 153,
      value:
        "\n    before \n    ```ts\n    First Typescript Block\n    ```\n\n    ```js\n    Javascript Block\n    ```\n\n    ```\n    Simple Fenced Block\n    ```\n    after\n    ",
      children: [
        {
          type: "MdCodeBlock",
          start: 12,
          end: 57,
          value: "\n    ```ts\n    First Typescript Block\n    ```",
          children: [
            {
              type: "MdCodeBlockStart",
              start: 12,
              end: 22,
              value: "\n    ```ts",
              name: "ts",
              depth: 4,
            },
            {
              type: "MdCodeBlockEnd",
              start: 49,
              end: 57,
              value: "\n    ```",
              name: "",
              depth: 4,
            },
          ],
        },
        {
          type: "MdCodeBlock",
          start: 58,
          end: 97,
          value: "\n    ```js\n    Javascript Block\n    ```",
          children: [
            {
              type: "MdCodeBlockStart",
              start: 58,
              end: 68,
              value: "\n    ```js",
              name: "js",
              depth: 4,
            },
            {
              type: "MdCodeBlockEnd",
              start: 89,
              end: 97,
              value: "\n    ```",
              name: "",
              depth: 4,
            },
          ],
        },
        {
          type: "MdCodeBlock",
          start: 98,
          end: 138,
          value: "\n    ```\n    Simple Fenced Block\n    ```",
          children: [
            {
              type: "MdCodeBlockStart",
              start: 98,
              end: 106,
              value: "\n    ```",
              name: "",
              depth: 4,
            },
            {
              type: "MdCodeBlockEnd",
              start: 130,
              end: 138,
              value: "\n    ```",
              name: "",
              depth: 4,
            },
          ],
        },
      ],
    },
  },
  {
    description: "should recognize blocks of the same type as siblings",
    input: `
    before 
    \`\`\`js
    First Javascript Block
    \`\`\`js
    Second Javascript Block
    \`\`\`
    after
    `,
    expected: {
      type: "Block",
      start: 0,
      end: 110,
      value:
        "\n    before \n    ```js\n    First Javascript Block\n    ```js\n    Second Javascript Block\n    ```\n    after\n    ",
      children: [
        {
          type: "MdCodeBlock",
          start: 12,
          end: 49,
          value: "\n    ```js\n    First Javascript Block",
          children: [
            {
              type: "MdCodeBlockStart",
              start: 12,
              end: 22,
              value: "\n    ```js",
              name: "js",
              depth: 4,
            },
            { type: "MdCodeBlockEnd", start: 49, end: 49, value: "" },
          ],
        },
        {
          type: "MdCodeBlock",
          start: 49,
          end: 95,
          value: "\n    ```js\n    Second Javascript Block\n    ```",
          children: [
            {
              type: "MdCodeBlockStart",
              start: 49,
              end: 59,
              value: "\n    ```js",
              name: "js",
              depth: 4,
            },
            {
              type: "MdCodeBlockEnd",
              start: 87,
              end: 95,
              value: "\n    ```",
              name: "",
              depth: 4,
            },
          ],
        },
      ],
    },
  },
];
