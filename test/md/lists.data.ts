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
          start: 1,
          end: 15,
          value: "    - one\n    ",
          children: [
            {
              type: "MdListItem",
              start: 1,
              end: 15,
              value: "    - one\n    ",
              children: [
                {
                  type: "MdListItemStart",
                  start: 1,
                  end: 7,
                  value: "    - ",
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
      end: 12,
      value: "\n    - one\n\n",
      children: [
        {
          type: "MdList",
          start: 1,
          end: 10,
          value: "    - one",
          children: [
            {
              type: "MdListItem",
              start: 1,
              end: 10,
              value: "    - one",
              children: [
                {
                  type: "MdListItemStart",
                  start: 1,
                  end: 7,
                  value: "    - ",
                  marker: "    -",
                },
                {
                  type: "MdListItemContent",
                  start: 7,
                  end: 10,
                  value: "one",
                },
                {
                  type: "MdListItemEnd",
                  start: 10,
                  end: 10,
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
      end: 20,
      value: "\nbefore\n- one\n\nafter",
      children: [
        {
          type: "MdList",
          start: 7,
          end: 13,
          value: "\n- one",
          children: [
            {
              type: "MdListItem",
              start: 7,
              end: 13,
              value: "\n- one",
              children: [
                {
                  type: "MdListItemStart",
                  start: 7,
                  end: 10,
                  value: "\n- ",
                  marker: "-",
                },
                {
                  type: "MdListItemContent",
                  start: 10,
                  end: 13,
                  value: "one",
                },
                {
                  type: "MdListItemEnd",
                  start: 13,
                  end: 13,
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
      end: 37,
      value: "\n    - one\n    - two\n    - three\n    ",
      children: [
        {
          type: "MdList",
          start: 1,
          end: 37,
          value: "    - one\n    - two\n    - three\n    ",
          children: [
            {
              type: "MdListItem",
              start: 1,
              end: 10,
              value: "    - one",
              children: [
                {
                  type: "MdListItemStart",
                  start: 1,
                  end: 7,
                  value: "    - ",
                  marker: "    -",
                },
                { type: "MdListItemContent", start: 7, end: 10, value: "one" },
                { type: "MdListItemEnd", start: 10, end: 10, value: "" },
              ],
            },
            {
              type: "MdListItem",
              start: 10,
              end: 20,
              value: "\n    - two",
              children: [
                {
                  type: "MdListItemStart",
                  start: 10,
                  end: 17,
                  value: "\n    - ",
                  marker: "    -",
                },
                { type: "MdListItemContent", start: 17, end: 20, value: "two" },
                { type: "MdListItemEnd", start: 20, end: 20, value: "" },
              ],
            },
            {
              type: "MdListItem",
              start: 20,
              end: 37,
              value: "\n    - three\n    ",
              children: [
                {
                  type: "MdListItemStart",
                  start: 20,
                  end: 27,
                  value: "\n    - ",
                  marker: "    -",
                },
                {
                  type: "MdListItemContent",
                  start: 27,
                  end: 37,
                  value: "three\n    ",
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
      end: 74,
      value:
        "\n    - item one \n      - sub-item 1\n      - sub-item 2\n    - item two\n    ",
      children: [
        {
          type: "MdList",
          start: 1,
          end: 74,
          value:
            "    - item one \n      - sub-item 1\n      - sub-item 2\n    - item two\n    ",
          children: [
            {
              type: "MdListItem",
              start: 1,
              end: 54,
              value: "    - item one \n      - sub-item 1\n      - sub-item 2",
              children: [
                {
                  type: "MdListItemStart",
                  start: 1,
                  end: 7,
                  value: "    - ",
                  marker: "    -",
                },
                {
                  type: "MdListItemContent",
                  start: 7,
                  end: 54,
                  value: "item one \n      - sub-item 1\n      - sub-item 2",
                  children: [
                    {
                      type: "MdList",
                      start: 16,
                      end: 54,
                      value: "\n      - sub-item 1\n      - sub-item 2",
                      children: [
                        {
                          type: "MdListItem",
                          start: 16,
                          end: 35,
                          value: "\n      - sub-item 1",
                          children: [
                            {
                              type: "MdListItemStart",
                              start: 16,
                              end: 25,
                              value: "\n      - ",
                              marker: "      -",
                            },
                            {
                              type: "MdListItemContent",
                              start: 25,
                              end: 35,
                              value: "sub-item 1",
                            },
                            {
                              type: "MdListItemEnd",
                              start: 35,
                              end: 35,
                              value: "",
                            },
                          ],
                        },
                        {
                          type: "MdListItem",
                          start: 35,
                          end: 54,
                          value: "\n      - sub-item 2",
                          children: [
                            {
                              type: "MdListItemStart",
                              start: 35,
                              end: 44,
                              value: "\n      - ",
                              marker: "      -",
                            },
                            {
                              type: "MdListItemContent",
                              start: 44,
                              end: 54,
                              value: "sub-item 2",
                            },
                            {
                              type: "MdListItemEnd",
                              start: 54,
                              end: 54,
                              value: "",
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                { type: "MdListItemEnd", start: 54, end: 54, value: "" },
              ],
            },
            {
              type: "MdListItem",
              start: 54,
              end: 74,
              value: "\n    - item two\n    ",
              children: [
                {
                  type: "MdListItemStart",
                  start: 54,
                  end: 61,
                  value: "\n    - ",
                  marker: "    -",
                },
                {
                  type: "MdListItemContent",
                  start: 61,
                  end: 74,
                  value: "item two\n    ",
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
      end: 49,
      value: "\n    - one\n    - two\n\n    - three\n    - four\n    ",
      children: [
        {
          type: "MdList",
          start: 1,
          end: 20,
          value: "    - one\n    - two",
          children: [
            {
              type: "MdListItem",
              start: 1,
              end: 10,
              value: "    - one",
              children: [
                {
                  type: "MdListItemStart",
                  start: 1,
                  end: 7,
                  value: "    - ",
                  marker: "    -",
                },
                { type: "MdListItemContent", start: 7, end: 10, value: "one" },
                { type: "MdListItemEnd", start: 10, end: 10, value: "" },
              ],
            },
            {
              type: "MdListItem",
              start: 10,
              end: 20,
              value: "\n    - two",
              children: [
                {
                  type: "MdListItemStart",
                  start: 10,
                  end: 17,
                  value: "\n    - ",
                  marker: "    -",
                },
                { type: "MdListItemContent", start: 17, end: 20, value: "two" },
                { type: "MdListItemEnd", start: 20, end: 20, value: "" },
              ],
            },
          ],
        },
        {
          type: "MdList",
          start: 21,
          end: 49,
          value: "\n    - three\n    - four\n    ",
          children: [
            {
              type: "MdListItem",
              start: 21,
              end: 33,
              value: "\n    - three",
              children: [
                {
                  type: "MdListItemStart",
                  start: 21,
                  end: 28,
                  value: "\n    - ",
                  marker: "    -",
                },
                {
                  type: "MdListItemContent",
                  start: 28,
                  end: 33,
                  value: "three",
                },
                { type: "MdListItemEnd", start: 33, end: 33, value: "" },
              ],
            },
            {
              type: "MdListItem",
              start: 33,
              end: 49,
              value: "\n    - four\n    ",
              children: [
                {
                  type: "MdListItemStart",
                  start: 33,
                  end: 40,
                  value: "\n    - ",
                  marker: "    -",
                },
                {
                  type: "MdListItemContent",
                  start: 40,
                  end: 49,
                  value: "four\n    ",
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
      end: 51,
      value: "\n    - one\n    - two\n  \n    - three\n    - four\n    ",
      children: [
        {
          type: "MdList",
          start: 1,
          end: 51,
          value: "    - one\n    - two\n  \n    - three\n    - four\n    ",
          children: [
            {
              type: "MdListItem",
              start: 1,
              end: 10,
              value: "    - one",
              children: [
                {
                  type: "MdListItemStart",
                  start: 1,
                  end: 7,
                  value: "    - ",
                  marker: "    -",
                },
                { type: "MdListItemContent", start: 7, end: 10, value: "one" },
                { type: "MdListItemEnd", start: 10, end: 10, value: "" },
              ],
            },
            {
              type: "MdListItem",
              start: 10,
              end: 23,
              value: "\n    - two\n  ",
              children: [
                {
                  type: "MdListItemStart",
                  start: 10,
                  end: 17,
                  value: "\n    - ",
                  marker: "    -",
                },
                {
                  type: "MdListItemContent",
                  start: 17,
                  end: 23,
                  value: "two\n  ",
                },
                { type: "MdListItemEnd", start: 23, end: 23, value: "" },
              ],
            },
            {
              type: "MdListItem",
              start: 23,
              end: 35,
              value: "\n    - three",
              children: [
                {
                  type: "MdListItemStart",
                  start: 23,
                  end: 30,
                  value: "\n    - ",
                  marker: "    -",
                },
                {
                  type: "MdListItemContent",
                  start: 30,
                  end: 35,
                  value: "three",
                },
                { type: "MdListItemEnd", start: 35, end: 35, value: "" },
              ],
            },
            {
              type: "MdListItem",
              start: 35,
              end: 51,
              value: "\n    - four\n    ",
              children: [
                {
                  type: "MdListItemStart",
                  start: 35,
                  end: 42,
                  value: "\n    - ",
                  marker: "    -",
                },
                {
                  type: "MdListItemContent",
                  start: 42,
                  end: 51,
                  value: "four\n    ",
                },
              ],
            },
          ],
        },
      ],
    },
  },
];
