import { type TTestData } from "../data.types.ts";

export const testData: TTestData[] = [
  {
    description: "should tokenize a one-element list",
    input: `::: attr1=value1 attr2=value2
    Content
    `,
    expected: {
      type: "Block",
      start: 0,
      end: 46,
      value: "::: attr1=value1 attr2=value2\n    Content\n    ",
      children: [
        {
          type: "MdFencedBlock",
          start: 0,
          end: 46,
          value: "::: attr1=value1 attr2=value2\n    Content\n    ",
          children: [
            {
              type: "MdFencedSection",
              start: 0,
              end: 46,
              value: "::: attr1=value1 attr2=value2\n    Content\n    ",
              children: [
                {
                  type: "MdFencedSectionStart",
                  start: 0,
                  end: 29,
                  value: "::: attr1=value1 attr2=value2",
                  depth: 0,
                  marker: ":::",
                  children: [
                    {
                      type: "HtmlAttribute",
                      start: 4,
                      end: 16,
                      value: "attr1=value1",
                      children: [
                        {
                          type: "HtmlName",
                          name: "attr1",
                          start: 4,
                          end: 9,
                          value: "attr1",
                        },
                        {
                          type: "HtmlValue",
                          value: "value1",
                          start: 10,
                          end: 16,
                          quoted: false,
                          valueStart: 10,
                          valueEnd: 16,
                        },
                      ],
                    },
                    {
                      type: "HtmlAttribute",
                      start: 17,
                      end: 29,
                      value: "attr2=value2",
                      children: [
                        {
                          type: "HtmlName",
                          name: "attr2",
                          start: 17,
                          end: 22,
                          value: "attr2",
                        },
                        {
                          type: "HtmlValue",
                          value: "value2",
                          start: 23,
                          end: 29,
                          quoted: false,
                          valueStart: 23,
                          valueEnd: 29,
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "MdFencedSectionContent",
                  start: 29,
                  end: 46,
                  value: "\n    Content\n    ",
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    description: "should tokenize an empty fenced block",
    input: ":::",
    expected: {
      type: "Block",
      start: 0,
      end: 3,
      value: ":::",
      children: [
        {
          type: "MdFencedBlock",
          start: 0,
          end: 3,
          value: ":::",
          children: [
            {
              type: "MdFencedSection",
              start: 0,
              end: 3,
              value: ":::",
              children: [
                {
                  type: "MdFencedSectionStart",
                  start: 0,
                  end: 3,
                  value: ":::",
                  depth: 0,
                  marker: ":::",
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
      "should tokenize an empty fenced block starting from a new line",
    input: "\n:::",
    expected: {
      type: "Block",
      start: 0,
      end: 4,
      value: "\n:::",
      children: [
        {
          type: "MdFencedBlock",
          start: 0,
          end: 4,
          value: "\n:::",
          children: [
            {
              type: "MdFencedSection",
              start: 0,
              end: 4,
              value: "\n:::",
              children: [
                {
                  type: "MdFencedSectionStart",
                  start: 0,
                  end: 4,
                  value: "\n:::",
                  depth: 0,
                  marker: ":::",
                },
              ],
            },
          ],
        },
      ],
    },
  },

  {
    description: "should tokenize a hierarchical fenced blocks",
    input: `
    First paragraph

    :::
    First block
    :::
    Second block",
    :::
    Third block",

    Next paragraph
    `,
    expected: {
      type: "Block",
      start: 0,
      end: 123,
      value:
        '\n    First paragraph\n\n    :::\n    First block\n    :::\n    Second block",\n    :::\n    Third block",\n\n    Next paragraph\n    ',
      children: [
        {
          type: "MdFencedBlock",
          start: 21,
          end: 98,
          value:
            '\n    :::\n    First block\n    :::\n    Second block",\n    :::\n    Third block",',
          children: [
            {
              type: "MdFencedSection",
              start: 21,
              end: 45,
              value: "\n    :::\n    First block",
              children: [
                {
                  type: "MdFencedSectionStart",
                  start: 21,
                  end: 29,
                  value: "\n    :::",
                  depth: 4,
                  marker: "    :::",
                },
                {
                  type: "MdFencedSectionContent",
                  start: 29,
                  end: 45,
                  value: "\n    First block",
                },
                { type: "MdFencedSectionEnd", start: 45, end: 45, value: "" },
              ],
            },
            {
              type: "MdFencedSection",
              start: 45,
              end: 72,
              value: '\n    :::\n    Second block",',
              children: [
                {
                  type: "MdFencedSectionStart",
                  start: 45,
                  end: 53,
                  value: "\n    :::",
                  depth: 4,
                  marker: "    :::",
                },
                {
                  type: "MdFencedSectionContent",
                  start: 53,
                  end: 72,
                  value: '\n    Second block",',
                },
                { type: "MdFencedSectionEnd", start: 72, end: 72, value: "" },
              ],
            },
            {
              type: "MdFencedSection",
              start: 72,
              end: 98,
              value: '\n    :::\n    Third block",',
              children: [
                {
                  type: "MdFencedSectionStart",
                  start: 72,
                  end: 80,
                  value: "\n    :::",
                  depth: 4,
                  marker: "    :::",
                },
                {
                  type: "MdFencedSectionContent",
                  start: 80,
                  end: 98,
                  value: '\n    Third block",',
                },
                { type: "MdFencedSectionEnd", start: 98, end: 98, value: "" },
              ],
            },
          ],
        },
      ],
    },
  },

  {
    description: "should tokenize a hierarchical fenced blocks",
    input: `
    First paragraph

    :::::::::::::: type=header columns="1 2 1" min-height=500px
    First Line Header
      :::
      Cell 1.1
      :::
      Cell 1.2
      :::
      Cell 1.3
    :::::::::::::: 
    Second Line Header
      :::
      Cell 2.1
      :::
      Cell 2.2
      :::
      Cell 2.3

    Next paragraph
    `,
    expected: {
      type: "Block",
      start: 0,
      end: 325,
      value:
        '\n    First paragraph\n\n    :::::::::::::: type=header columns="1 2 1" min-height=500px\n    First Line Header\n      :::\n      Cell 1.1\n      :::\n      Cell 1.2\n      :::\n      Cell 1.3\n    :::::::::::::: \n    Second Line Header\n      :::\n      Cell 2.1\n      :::\n      Cell 2.2\n      :::\n      Cell 2.3\n\n    Next paragraph\n    ',
      children: [
        {
          type: "MdFencedBlock",
          start: 21,
          end: 300,
          value:
            '\n    :::::::::::::: type=header columns="1 2 1" min-height=500px\n    First Line Header\n      :::\n      Cell 1.1\n      :::\n      Cell 1.2\n      :::\n      Cell 1.3\n    :::::::::::::: \n    Second Line Header\n      :::\n      Cell 2.1\n      :::\n      Cell 2.2\n      :::\n      Cell 2.3',
          children: [
            {
              type: "MdFencedSection",
              start: 21,
              end: 182,
              value:
                '\n    :::::::::::::: type=header columns="1 2 1" min-height=500px\n    First Line Header\n      :::\n      Cell 1.1\n      :::\n      Cell 1.2\n      :::\n      Cell 1.3',
              children: [
                {
                  type: "MdFencedSectionStart",
                  start: 21,
                  end: 85,
                  value:
                    '\n    :::::::::::::: type=header columns="1 2 1" min-height=500px',
                  depth: 4,
                  marker: "    ::::::::::::::",
                  children: [
                    {
                      type: "HtmlAttribute",
                      start: 41,
                      end: 52,
                      value: "type=header",
                      children: [
                        {
                          type: "HtmlName",
                          name: "type",
                          start: 41,
                          end: 45,
                          value: "type",
                        },
                        {
                          type: "HtmlValue",
                          value: "header",
                          start: 46,
                          end: 52,
                          quoted: false,
                          valueStart: 46,
                          valueEnd: 52,
                        },
                      ],
                    },
                    {
                      type: "HtmlAttribute",
                      start: 53,
                      end: 68,
                      value: 'columns="1 2 1"',
                      children: [
                        {
                          type: "HtmlName",
                          name: "columns",
                          start: 53,
                          end: 60,
                          value: "columns",
                        },
                        {
                          type: "HtmlValue",
                          start: 61,
                          end: 68,
                          value: '"1 2 1"',
                          quoted: true,
                          valueStart: 62,
                          valueEnd: 67,
                        },
                      ],
                    },
                    {
                      type: "HtmlAttribute",
                      start: 69,
                      end: 85,
                      value: "min-height=500px",
                      children: [
                        {
                          type: "HtmlName",
                          name: "min-height",
                          start: 69,
                          end: 79,
                          value: "min-height",
                        },
                        {
                          type: "HtmlValue",
                          value: "500px",
                          start: 80,
                          end: 85,
                          quoted: false,
                          valueStart: 80,
                          valueEnd: 85,
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "MdFencedSectionContent",
                  start: 85,
                  end: 182,
                  value:
                    "\n    First Line Header\n      :::\n      Cell 1.1\n      :::\n      Cell 1.2\n      :::\n      Cell 1.3",
                  children: [
                    {
                      type: "MdFencedBlock",
                      start: 107,
                      end: 182,
                      value:
                        "\n      :::\n      Cell 1.1\n      :::\n      Cell 1.2\n      :::\n      Cell 1.3",
                      children: [
                        {
                          type: "MdFencedSection",
                          start: 107,
                          end: 132,
                          value: "\n      :::\n      Cell 1.1",
                          children: [
                            {
                              type: "MdFencedSectionStart",
                              start: 107,
                              end: 117,
                              value: "\n      :::",
                              depth: 6,
                              marker: "      :::",
                            },
                            {
                              type: "MdFencedSectionContent",
                              start: 117,
                              end: 132,
                              value: "\n      Cell 1.1",
                            },
                            {
                              type: "MdFencedSectionEnd",
                              start: 132,
                              end: 132,
                              value: "",
                            },
                          ],
                        },
                        {
                          type: "MdFencedSection",
                          start: 132,
                          end: 157,
                          value: "\n      :::\n      Cell 1.2",
                          children: [
                            {
                              type: "MdFencedSectionStart",
                              start: 132,
                              end: 142,
                              value: "\n      :::",
                              depth: 6,
                              marker: "      :::",
                            },
                            {
                              type: "MdFencedSectionContent",
                              start: 142,
                              end: 157,
                              value: "\n      Cell 1.2",
                            },
                            {
                              type: "MdFencedSectionEnd",
                              start: 157,
                              end: 157,
                              value: "",
                            },
                          ],
                        },
                        {
                          type: "MdFencedSection",
                          start: 157,
                          end: 182,
                          value: "\n      :::\n      Cell 1.3",
                          children: [
                            {
                              type: "MdFencedSectionStart",
                              start: 157,
                              end: 167,
                              value: "\n      :::",
                              depth: 6,
                              marker: "      :::",
                            },
                            {
                              type: "MdFencedSectionContent",
                              start: 167,
                              end: 182,
                              value: "\n      Cell 1.3",
                            },
                            {
                              type: "MdFencedSectionEnd",
                              start: 182,
                              end: 182,
                              value: "",
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "MdFencedSectionEnd",
                  start: 182,
                  end: 182,
                  value: "",
                },
              ],
            },
            {
              type: "MdFencedSection",
              start: 182,
              end: 300,
              value:
                "\n    :::::::::::::: \n    Second Line Header\n      :::\n      Cell 2.1\n      :::\n      Cell 2.2\n      :::\n      Cell 2.3",
              children: [
                {
                  type: "MdFencedSectionStart",
                  start: 182,
                  end: 202,
                  value: "\n    :::::::::::::: ",
                  depth: 4,
                  marker: "    ::::::::::::::",
                },
                {
                  type: "MdFencedSectionContent",
                  start: 202,
                  end: 300,
                  value:
                    "\n    Second Line Header\n      :::\n      Cell 2.1\n      :::\n      Cell 2.2\n      :::\n      Cell 2.3",
                  children: [
                    {
                      type: "MdFencedBlock",
                      start: 225,
                      end: 300,
                      value:
                        "\n      :::\n      Cell 2.1\n      :::\n      Cell 2.2\n      :::\n      Cell 2.3",
                      children: [
                        {
                          type: "MdFencedSection",
                          start: 225,
                          end: 250,
                          value: "\n      :::\n      Cell 2.1",
                          children: [
                            {
                              type: "MdFencedSectionStart",
                              start: 225,
                              end: 235,
                              value: "\n      :::",
                              depth: 6,
                              marker: "      :::",
                            },
                            {
                              type: "MdFencedSectionContent",
                              start: 235,
                              end: 250,
                              value: "\n      Cell 2.1",
                            },
                            {
                              type: "MdFencedSectionEnd",
                              start: 250,
                              end: 250,
                              value: "",
                            },
                          ],
                        },
                        {
                          type: "MdFencedSection",
                          start: 250,
                          end: 275,
                          value: "\n      :::\n      Cell 2.2",
                          children: [
                            {
                              type: "MdFencedSectionStart",
                              start: 250,
                              end: 260,
                              value: "\n      :::",
                              depth: 6,
                              marker: "      :::",
                            },
                            {
                              type: "MdFencedSectionContent",
                              start: 260,
                              end: 275,
                              value: "\n      Cell 2.2",
                            },
                            {
                              type: "MdFencedSectionEnd",
                              start: 275,
                              end: 275,
                              value: "",
                            },
                          ],
                        },
                        {
                          type: "MdFencedSection",
                          start: 275,
                          end: 300,
                          value: "\n      :::\n      Cell 2.3",
                          children: [
                            {
                              type: "MdFencedSectionStart",
                              start: 275,
                              end: 285,
                              value: "\n      :::",
                              depth: 6,
                              marker: "      :::",
                            },
                            {
                              type: "MdFencedSectionContent",
                              start: 285,
                              end: 300,
                              value: "\n      Cell 2.3",
                            },
                            {
                              type: "MdFencedSectionEnd",
                              start: 300,
                              end: 300,
                              value: "",
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "MdFencedSectionEnd",
                  start: 300,
                  end: 300,
                  value: "",
                },
              ],
            },
          ],
        },
      ],
    },
  },
];
