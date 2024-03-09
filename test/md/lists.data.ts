import { type TTestData } from "../data.types.ts";

export const testData: TTestData[] = [
  {
    description: "should tokenize a one-element list",
    input: `
    - one
    `,
    expected: {
      type: "Block",
      start: 0,
      end: 15,
      value: "\n    - one\n    ",
      children: [
        {
          type: "MdList",
          start: 0,
          end: 15,
          value: "\n    - one\n    ",
          children: [
            {
              type: "MdListItem",
              start: 0,
              end: 15,
              value: "\n    - one\n    ",
              children: [
                {
                  type: "MdListItemStart",
                  start: 0,
                  end: 7,
                  value: "\n    - ",
                  depth: 4,
                  marker: "    -",
                },
                {
                  type: "MdListItemContent",
                  start: 7,
                  end: 15,
                  value: "one\n    ",
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    description:
      "should tokenize a one-element list terminated by an empty line",
    input: `
      - one

  `,
    expected: {
      type: "Block",
      start: 0,
      end: 16,
      value: "\n      - one\n\n  ",
      children: [
        {
          type: "MdList",
          start: 0,
          end: 12,
          value: "\n      - one",
          children: [
            {
              type: "MdListItem",
              start: 0,
              end: 12,
              value: "\n      - one",
              children: [
                {
                  type: "MdListItemStart",
                  start: 0,
                  end: 9,
                  value: "\n      - ",
                  depth: 6,
                  marker: "      -",
                },
                {
                  type: "MdListItemContent",
                  start: 9,
                  end: 12,
                  value: "one",
                },
                {
                  type: "MdListItemEnd",
                  start: 12,
                  end: 12,
                  value: "",
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    description:
      "should tokenize a one-element list terminated by an empty line with content before/after the list",
    input: `
  before
  - one

  after`,
    expected: {
      type: "Block",
      start: 0,
      end: 26,
      value: "\n  before\n  - one\n\n  after",
      children: [
        {
          type: "MdList",
          start: 9,
          end: 17,
          value: "\n  - one",
          children: [
            {
              type: "MdListItem",
              start: 9,
              end: 17,
              value: "\n  - one",
              children: [
                {
                  type: "MdListItemStart",
                  start: 9,
                  end: 14,
                  value: "\n  - ",
                  depth: 2,
                  marker: "  -",
                },
                {
                  type: "MdListItemContent",
                  start: 14,
                  end: 17,
                  value: "one",
                },
                {
                  type: "MdListItemEnd",
                  start: 17,
                  end: 17,
                  value: "",
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    description: "should tokenize simple lists",
    input: `
      - one
      - two
      - three
      `,
    expected: {
      type: "Block",
      start: 0,
      end: 45,
      value: "\n      - one\n      - two\n      - three\n      ",
      children: [
        {
          type: "MdList",
          start: 0,
          end: 45,
          value: "\n      - one\n      - two\n      - three\n      ",
          children: [
            {
              type: "MdListItem",
              start: 0,
              end: 12,
              value: "\n      - one",
              children: [
                {
                  type: "MdListItemStart",
                  start: 0,
                  end: 9,
                  value: "\n      - ",
                  depth: 6,
                  marker: "      -",
                },
                { type: "MdListItemContent", start: 9, end: 12, value: "one" },
                { type: "MdListItemEnd", start: 12, end: 12, value: "" },
              ],
            },
            {
              type: "MdListItem",
              start: 12,
              end: 24,
              value: "\n      - two",
              children: [
                {
                  type: "MdListItemStart",
                  start: 12,
                  end: 21,
                  value: "\n      - ",
                  depth: 6,
                  marker: "      -",
                },
                { type: "MdListItemContent", start: 21, end: 24, value: "two" },
                { type: "MdListItemEnd", start: 24, end: 24, value: "" },
              ],
            },
            {
              type: "MdListItem",
              start: 24,
              end: 45,
              value: "\n      - three\n      ",
              children: [
                {
                  type: "MdListItemStart",
                  start: 24,
                  end: 33,
                  value: "\n      - ",
                  depth: 6,
                  marker: "      -",
                },
                {
                  type: "MdListItemContent",
                  start: 33,
                  end: 45,
                  value: "three\n      ",
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    description: "should tokenize simple hierarchical list",
    input: `
      - item one
        - sub-item 1
        - sub-item 2
      - item two
      `,
    expected: {
      type: "Block",
      start: 0,
      end: 83,
      value:
        "\n      - item one\n        - sub-item 1\n        - sub-item 2\n      - item two\n      ",
      children: [
        {
          type: "MdList",
          start: 0,
          end: 83,
          value:
            "\n      - item one\n        - sub-item 1\n        - sub-item 2\n      - item two\n      ",
          children: [
            {
              type: "MdListItem",
              start: 0,
              end: 59,
              value:
                "\n      - item one\n        - sub-item 1\n        - sub-item 2",
              children: [
                {
                  type: "MdListItemStart",
                  start: 0,
                  end: 9,
                  value: "\n      - ",
                  depth: 6,
                  marker: "      -",
                },
                {
                  type: "MdListItemContent",
                  start: 9,
                  end: 59,
                  value: "item one\n        - sub-item 1\n        - sub-item 2",
                  children: [
                    {
                      type: "MdList",
                      start: 17,
                      end: 59,
                      value: "\n        - sub-item 1\n        - sub-item 2",
                      children: [
                        {
                          type: "MdListItem",
                          start: 17,
                          end: 38,
                          value: "\n        - sub-item 1",
                          children: [
                            {
                              type: "MdListItemStart",
                              start: 17,
                              end: 28,
                              value: "\n        - ",
                              depth: 8,
                              marker: "        -",
                            },
                            {
                              type: "MdListItemContent",
                              start: 28,
                              end: 38,
                              value: "sub-item 1",
                            },
                            {
                              type: "MdListItemEnd",
                              start: 38,
                              end: 38,
                              value: "",
                            },
                          ],
                        },
                        {
                          type: "MdListItem",
                          start: 38,
                          end: 59,
                          value: "\n        - sub-item 2",
                          children: [
                            {
                              type: "MdListItemStart",
                              start: 38,
                              end: 49,
                              value: "\n        - ",
                              depth: 8,
                              marker: "        -",
                            },
                            {
                              type: "MdListItemContent",
                              start: 49,
                              end: 59,
                              value: "sub-item 2",
                            },
                            {
                              type: "MdListItemEnd",
                              start: 59,
                              end: 59,
                              value: "",
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                { type: "MdListItemEnd", start: 59, end: 59, value: "" },
              ],
            },
            {
              type: "MdListItem",
              start: 59,
              end: 83,
              value: "\n      - item two\n      ",
              children: [
                {
                  type: "MdListItemStart",
                  start: 59,
                  end: 68,
                  value: "\n      - ",
                  depth: 6,
                  marker: "      -",
                },
                {
                  type: "MdListItemContent",
                  start: 68,
                  end: 83,
                  value: "item two\n      ",
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    description: "should read lists separated by white lines",
    input: `
      - one
      - two

      - three
      - four
      `,
    expected: {
      type: "Block",
      start: 0,
      end: 59,
      value:
        "\n      - one\n      - two\n\n      - three\n      - four\n      ",
      children: [
        {
          type: "MdList",
          start: 0,
          end: 24,
          value: "\n      - one\n      - two",
          children: [
            {
              type: "MdListItem",
              start: 0,
              end: 12,
              value: "\n      - one",
              children: [
                {
                  type: "MdListItemStart",
                  start: 0,
                  end: 9,
                  value: "\n      - ",
                  depth: 6,
                  marker: "      -",
                },
                { type: "MdListItemContent", start: 9, end: 12, value: "one" },
                { type: "MdListItemEnd", start: 12, end: 12, value: "" },
              ],
            },
            {
              type: "MdListItem",
              start: 12,
              end: 24,
              value: "\n      - two",
              children: [
                {
                  type: "MdListItemStart",
                  start: 12,
                  end: 21,
                  value: "\n      - ",
                  depth: 6,
                  marker: "      -",
                },
                { type: "MdListItemContent", start: 21, end: 24, value: "two" },
                { type: "MdListItemEnd", start: 24, end: 24, value: "" },
              ],
            },
          ],
        },
        {
          type: "MdList",
          start: 25,
          end: 59,
          value: "\n      - three\n      - four\n      ",
          children: [
            {
              type: "MdListItem",
              start: 25,
              end: 39,
              value: "\n      - three",
              children: [
                {
                  type: "MdListItemStart",
                  start: 25,
                  end: 34,
                  value: "\n      - ",
                  depth: 6,
                  marker: "      -",
                },
                {
                  type: "MdListItemContent",
                  start: 34,
                  end: 39,
                  value: "three",
                },
                { type: "MdListItemEnd", start: 39, end: 39, value: "" },
              ],
            },
            {
              type: "MdListItem",
              start: 39,
              end: 59,
              value: "\n      - four\n      ",
              children: [
                {
                  type: "MdListItemStart",
                  start: 39,
                  end: 48,
                  value: "\n      - ",
                  depth: 6,
                  marker: "      -",
                },
                {
                  type: "MdListItemContent",
                  start: 48,
                  end: 59,
                  value: "four\n      ",
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    description: "should read items separated by lines with spaces as one list",
    input: `
      - one
      - two

      - three
      - four
      `,
    expected: {
      type: "Block",
      start: 0,
      end: 59,
      value:
        "\n      - one\n      - two\n\n      - three\n      - four\n      ",
      children: [
        {
          type: "MdList",
          start: 0,
          end: 24,
          value: "\n      - one\n      - two",
          children: [
            {
              type: "MdListItem",
              start: 0,
              end: 12,
              value: "\n      - one",
              children: [
                {
                  type: "MdListItemStart",
                  start: 0,
                  end: 9,
                  value: "\n      - ",
                  depth: 6,
                  marker: "      -",
                },
                { type: "MdListItemContent", start: 9, end: 12, value: "one" },
                { type: "MdListItemEnd", start: 12, end: 12, value: "" },
              ],
            },
            {
              type: "MdListItem",
              start: 12,
              end: 24,
              value: "\n      - two",
              children: [
                {
                  type: "MdListItemStart",
                  start: 12,
                  end: 21,
                  value: "\n      - ",
                  depth: 6,
                  marker: "      -",
                },
                { type: "MdListItemContent", start: 21, end: 24, value: "two" },
                { type: "MdListItemEnd", start: 24, end: 24, value: "" },
              ],
            },
          ],
        },
        {
          type: "MdList",
          start: 25,
          end: 59,
          value: "\n      - three\n      - four\n      ",
          children: [
            {
              type: "MdListItem",
              start: 25,
              end: 39,
              value: "\n      - three",
              children: [
                {
                  type: "MdListItemStart",
                  start: 25,
                  end: 34,
                  value: "\n      - ",
                  depth: 6,
                  marker: "      -",
                },
                {
                  type: "MdListItemContent",
                  start: 34,
                  end: 39,
                  value: "three",
                },
                { type: "MdListItemEnd", start: 39, end: 39, value: "" },
              ],
            },
            {
              type: "MdListItem",
              start: 39,
              end: 59,
              value: "\n      - four\n      ",
              children: [
                {
                  type: "MdListItemStart",
                  start: 39,
                  end: 48,
                  value: "\n      - ",
                  depth: 6,
                  marker: "      -",
                },
                {
                  type: "MdListItemContent",
                  start: 48,
                  end: 59,
                  value: "four\n      ",
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    description: "should not interpret item markers in the middle of strings",
    input: "one - two",
    expected: {
      type: "Block",
      start: 0,
      end: 9,
      value: "one - two",
    },
  },
  {
    description: "should read number list and ",
    input: `
      - one
      - two

      - three
      - four
      `,
    expected: {
      type: "Block",
      start: 0,
      end: 59,
      value:
        "\n      - one\n      - two\n\n      - three\n      - four\n      ",
      children: [
        {
          type: "MdList",
          start: 0,
          end: 24,
          value: "\n      - one\n      - two",
          children: [
            {
              type: "MdListItem",
              start: 0,
              end: 12,
              value: "\n      - one",
              children: [
                {
                  type: "MdListItemStart",
                  start: 0,
                  end: 9,
                  value: "\n      - ",
                  depth: 6,
                  marker: "      -",
                },
                { type: "MdListItemContent", start: 9, end: 12, value: "one" },
                { type: "MdListItemEnd", start: 12, end: 12, value: "" },
              ],
            },
            {
              type: "MdListItem",
              start: 12,
              end: 24,
              value: "\n      - two",
              children: [
                {
                  type: "MdListItemStart",
                  start: 12,
                  end: 21,
                  value: "\n      - ",
                  depth: 6,
                  marker: "      -",
                },
                { type: "MdListItemContent", start: 21, end: 24, value: "two" },
                { type: "MdListItemEnd", start: 24, end: 24, value: "" },
              ],
            },
          ],
        },
        {
          type: "MdList",
          start: 25,
          end: 59,
          value: "\n      - three\n      - four\n      ",
          children: [
            {
              type: "MdListItem",
              start: 25,
              end: 39,
              value: "\n      - three",
              children: [
                {
                  type: "MdListItemStart",
                  start: 25,
                  end: 34,
                  value: "\n      - ",
                  depth: 6,
                  marker: "      -",
                },
                {
                  type: "MdListItemContent",
                  start: 34,
                  end: 39,
                  value: "three",
                },
                { type: "MdListItemEnd", start: 39, end: 39, value: "" },
              ],
            },
            {
              type: "MdListItem",
              start: 39,
              end: 59,
              value: "\n      - four\n      ",
              children: [
                {
                  type: "MdListItemStart",
                  start: 39,
                  end: 48,
                  value: "\n      - ",
                  depth: 6,
                  marker: "      -",
                },
                {
                  type: "MdListItemContent",
                  start: 48,
                  end: 59,
                  value: "four\n      ",
                },
              ],
            },
          ],
        },
      ],
    },
  },
];
