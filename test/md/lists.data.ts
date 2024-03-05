import { type TTestData } from "../data.types.ts";

export const testData: TTestData[] = [
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
          start: 0,
          end: 74,
          value:
            "\n    - item one \n      - sub-item 1\n      - sub-item 2\n    - item two\n    ",
          children: [
            {
              type: "MdListItem",
              start: 0,
              end: 54,
              value:
                "\n    - item one \n      - sub-item 1\n      - sub-item 2",
              children: [
                {
                  type: "MdListItemMarker",
                  start: 0,
                  end: 7,
                  value: "\n    - ",
                  marker: "    -",
                },
                {
                  type: "MdList",
                  start: 7,
                  end: 54,
                  value: "item one \n      - sub-item 1\n      - sub-item 2",
                  children: [
                    {
                      type: "MdListItem",
                      start: 16,
                      end: 35,
                      value: "\n      - sub-item 1",
                      children: [
                        {
                          type: "MdListItemMarker",
                          start: 16,
                          end: 25,
                          value: "\n      - ",
                          marker: "      -",
                        },
                        {
                          type: "MdList",
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
                          type: "MdListItemMarker",
                          start: 35,
                          end: 44,
                          value: "\n      - ",
                          marker: "      -",
                        },
                        {
                          type: "MdList",
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
                  type: "MdListItemMarker",
                  start: 54,
                  end: 61,
                  value: "\n    - ",
                  marker: "    -",
                },
                { type: "MdList", start: 61, end: 74, value: "item two\n    " },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    description: "should tokenize simple list",
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
          start: 0,
          end: 37,
          value: "\n    - one\n    - two\n    - three\n    ",
          children: [
            {
              type: "MdListItem",
              start: 0,
              end: 10,
              value: "\n    - one",
              children: [
                {
                  type: "MdListItemMarker",
                  start: 0,
                  end: 7,
                  value: "\n    - ",
                  marker: "    -",
                },
                { type: "MdList", start: 7, end: 10, value: "one" },
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
                  type: "MdListItemMarker",
                  start: 10,
                  end: 17,
                  value: "\n    - ",
                  marker: "    -",
                },
                { type: "MdList", start: 17, end: 20, value: "two" },
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
                  type: "MdListItemMarker",
                  start: 20,
                  end: 27,
                  value: "\n    - ",
                  marker: "    -",
                },
                { type: "MdList", start: 27, end: 37, value: "three\n    " },
              ],
            },
          ],
        },
      ],
    },
  },
];
