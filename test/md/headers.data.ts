import { type TTestData } from "../data.types.ts";

export const testData: TTestData[] = [
  {
    description: "should read empty MD headers at the beginning of the stream",
    input: "# ",
    expected: {
      type: "Block",
      start: 0,
      end: 2,
      value: "# ",
      children: [
        {
          type: "MdHeader",
          start: 0,
          end: 2,
          value: "# ",
          children: [
            {
              type: "MdHeaderStart",
              start: 0,
              end: 2,
              value: "# ",
              level: 1,
            },
          ],
          level: 1,
        },
      ],
    },
  },
  {
    description: "should read empty MD headers starting from a new line",
    input: "before\n# ",
    expected: {
      type: "Block",
      start: 0,
      end: 9,
      value: "before\n# ",
      children: [
        {
          type: "MdHeader",
          start: 6,
          end: 9,
          value: "\n# ",
          children: [
            {
              type: "MdHeaderStart",
              start: 6,
              end: 9,
              value: "\n# ",
              level: 1,
            },
          ],
          level: 1,
        },
      ],
    },
  },
  {
    description: "should read empty MD headers until the next empty line",
    input: "before\n# \nafter",
    expected: {
      type: "Block",
      start: 0,
      end: 15,
      value: "before\n# \nafter",
      children: [
        {
          type: "MdHeader",
          start: 6,
          end: 9,
          value: "\n# ",
          children: [
            {
              type: "MdHeaderStart",
              start: 6,
              end: 9,
              value: "\n# ",
              level: 1,
            },
            {
              type: "MdHeaderEnd",
              start: 9,
              end: 9,
              value: "",
            },
          ],
          level: 1,
        },
      ],
    },
  },
  {
    description:
      "should read MD headers with content until the next empty line",
    input: "before\n# Header\nafter",
    expected: {
      type: "Block",
      start: 0,
      end: 21,
      value: "before\n# Header\nafter",
      children: [
        {
          type: "MdHeader",
          start: 6,
          end: 15,
          value: "\n# Header",
          children: [
            {
              type: "MdHeaderStart",
              start: 6,
              end: 9,
              value: "\n# ",
              level: 1,
            },
            {
              type: "MdHeaderEnd",
              start: 15,
              end: 15,
              value: "",
            },
          ],
          level: 1,
        },
      ],
    },
  },
  {
    description: "should read multiple MD headers separated by text",
    input: `
  # First Header
  First paragraph
  ## Second Header
  Second paragraph
  `,
    expected: {
      type: "Block",
      start: 0,
      end: 76,
      value:
        "\n  # First Header\n  First paragraph\n  ## Second Header\n  Second paragraph\n  ",
      children: [
        {
          type: "MdHeader",
          start: 0,
          end: 17,
          value: "\n  # First Header",
          children: [
            {
              type: "MdHeaderStart",
              start: 0,
              end: 5,
              value: "\n  # ",
              level: 1,
            },
            { type: "MdHeaderEnd", start: 17, end: 17, value: "" },
          ],
          level: 1,
        },
        {
          type: "MdHeader",
          start: 35,
          end: 54,
          value: "\n  ## Second Header",
          children: [
            {
              type: "MdHeaderStart",
              start: 35,
              end: 41,
              value: "\n  ## ",
              level: 2,
            },
            { type: "MdHeaderEnd", start: 54, end: 54, value: "" },
          ],
          level: 2,
        },
      ],
    },
  },
];
