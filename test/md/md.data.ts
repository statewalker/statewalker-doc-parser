import { type TTestData } from "../data.types.ts";

export const testData: TTestData[] = [
  {
    description: "should read MD document with sections and tags",
    input: `# Header
<span>Some text</span>
  `,
    expected: {
      type: "Block",
      start: 0,
      end: 34,
      value: "# Header\n<span>Some text</span>\n  ",
      children: [
        {
          type: "MdSection",
          start: 0,
          end: 34,
          value: "# Header\n<span>Some text</span>\n  ",
          children: [
            {
              type: "MdHeader",
              start: 0,
              end: 8,
              value: "# Header",
              children: [
                {
                  type: "MdHeaderStart",
                  start: 0,
                  end: 2,
                  value: "# ",
                  level: 1,
                },
                { type: "MdHeaderEnd", start: 8, end: 8, value: "" },
              ],
              level: 1,
            },
            {
              type: "HtmlTag",
              start: 9,
              end: 31,
              value: "<span>Some text</span>",
              children: [
                {
                  type: "HtmlOpenTag",
                  start: 9,
                  end: 15,
                  value: "<span>",
                  children: [
                    {
                      type: "HtmlTagStart",
                      start: 9,
                      end: 14,
                      value: "<span",
                      children: [
                        {
                          type: "HtmlName",
                          name: "span",
                          start: 10,
                          end: 14,
                          value: "span",
                        },
                      ],
                      tagName: "span",
                    },
                    {
                      type: "HtmlTagEnd",
                      start: 14,
                      end: 15,
                      value: ">",
                      autoclosing: false,
                    },
                  ],
                  tagName: "span",
                  autoclosing: false,
                },
                {
                  type: "HtmlCloseTag",
                  start: 24,
                  end: 31,
                  value: "</span>",
                  children: [
                    {
                      type: "HtmlName",
                      name: "span",
                      start: 26,
                      end: 30,
                      value: "span",
                    },
                  ],
                  tagName: "span",
                },
              ],
            },
          ],
          level: 1,
        },
      ],
    },
  },

  {
    description: "should read MD document with sections and tags",
    input: `# Header 1
<p>Introduction</p>

## Header 1.1
<p>First paragraph</p>

## Header 1.2
<p>Second paragraph</p>

# Header 2
<p>Third paragraph</p>

  `,
    expected: {
      type: "Block",
      start: 0,
      end: 146,
      value:
        "# Header 1\n<p>Introduction</p>\n\n## Header 1.1\n<p>First paragraph</p>\n\n## Header 1.2\n<p>Second paragraph</p>\n\n# Header 2\n<p>Third paragraph</p>\n\n  ",
      children: [
        {
          type: "MdSection",
          start: 0,
          end: 107,
          value:
            "# Header 1\n<p>Introduction</p>\n\n## Header 1.1\n<p>First paragraph</p>\n\n## Header 1.2\n<p>Second paragraph</p>",
          children: [
            {
              type: "MdHeader",
              start: 0,
              end: 10,
              value: "# Header 1",
              children: [
                {
                  type: "MdHeaderStart",
                  start: 0,
                  end: 2,
                  value: "# ",
                  level: 1,
                },
                { type: "MdHeaderEnd", start: 10, end: 10, value: "" },
              ],
              level: 1,
            },
            {
              type: "HtmlTag",
              start: 11,
              end: 30,
              value: "<p>Introduction</p>",
              children: [
                {
                  type: "HtmlOpenTag",
                  start: 11,
                  end: 14,
                  value: "<p>",
                  children: [
                    {
                      type: "HtmlTagStart",
                      start: 11,
                      end: 13,
                      value: "<p",
                      children: [
                        {
                          type: "HtmlName",
                          name: "p",
                          start: 12,
                          end: 13,
                          value: "p",
                        },
                      ],
                      tagName: "p",
                    },
                    {
                      type: "HtmlTagEnd",
                      start: 13,
                      end: 14,
                      value: ">",
                      autoclosing: false,
                    },
                  ],
                  tagName: "p",
                  autoclosing: false,
                },
                {
                  type: "HtmlCloseTag",
                  start: 26,
                  end: 30,
                  value: "</p>",
                  children: [
                    {
                      type: "HtmlName",
                      name: "p",
                      start: 28,
                      end: 29,
                      value: "p",
                    },
                  ],
                  tagName: "p",
                },
              ],
            },
            {
              type: "MdSection",
              start: 30,
              end: 68,
              value: "\n\n## Header 1.1\n<p>First paragraph</p>",
              children: [
                {
                  type: "MdHeader",
                  start: 30,
                  end: 45,
                  value: "\n\n## Header 1.1",
                  children: [
                    {
                      type: "MdHeaderStart",
                      start: 30,
                      end: 35,
                      value: "\n\n## ",
                      level: 2,
                    },
                    { type: "MdHeaderEnd", start: 45, end: 45, value: "" },
                  ],
                  level: 2,
                },
                {
                  type: "HtmlTag",
                  start: 46,
                  end: 68,
                  value: "<p>First paragraph</p>",
                  children: [
                    {
                      type: "HtmlOpenTag",
                      start: 46,
                      end: 49,
                      value: "<p>",
                      children: [
                        {
                          type: "HtmlTagStart",
                          start: 46,
                          end: 48,
                          value: "<p",
                          children: [
                            {
                              type: "HtmlName",
                              name: "p",
                              start: 47,
                              end: 48,
                              value: "p",
                            },
                          ],
                          tagName: "p",
                        },
                        {
                          type: "HtmlTagEnd",
                          start: 48,
                          end: 49,
                          value: ">",
                          autoclosing: false,
                        },
                      ],
                      tagName: "p",
                      autoclosing: false,
                    },
                    {
                      type: "HtmlCloseTag",
                      start: 64,
                      end: 68,
                      value: "</p>",
                      children: [
                        {
                          type: "HtmlName",
                          name: "p",
                          start: 66,
                          end: 67,
                          value: "p",
                        },
                      ],
                      tagName: "p",
                    },
                  ],
                },
                { type: "MdSectionEnd", start: 68, end: 68, value: "" },
              ],
            },
            {
              type: "MdSection",
              start: 68,
              end: 107,
              value: "\n\n## Header 1.2\n<p>Second paragraph</p>",
              children: [
                {
                  type: "MdHeader",
                  start: 68,
                  end: 83,
                  value: "\n\n## Header 1.2",
                  children: [
                    {
                      type: "MdHeaderStart",
                      start: 68,
                      end: 73,
                      value: "\n\n## ",
                      level: 2,
                    },
                    { type: "MdHeaderEnd", start: 83, end: 83, value: "" },
                  ],
                  level: 2,
                },
                {
                  type: "HtmlTag",
                  start: 84,
                  end: 107,
                  value: "<p>Second paragraph</p>",
                  children: [
                    {
                      type: "HtmlOpenTag",
                      start: 84,
                      end: 87,
                      value: "<p>",
                      children: [
                        {
                          type: "HtmlTagStart",
                          start: 84,
                          end: 86,
                          value: "<p",
                          children: [
                            {
                              type: "HtmlName",
                              name: "p",
                              start: 85,
                              end: 86,
                              value: "p",
                            },
                          ],
                          tagName: "p",
                        },
                        {
                          type: "HtmlTagEnd",
                          start: 86,
                          end: 87,
                          value: ">",
                          autoclosing: false,
                        },
                      ],
                      tagName: "p",
                      autoclosing: false,
                    },
                    {
                      type: "HtmlCloseTag",
                      start: 103,
                      end: 107,
                      value: "</p>",
                      children: [
                        {
                          type: "HtmlName",
                          name: "p",
                          start: 105,
                          end: 106,
                          value: "p",
                        },
                      ],
                      tagName: "p",
                    },
                  ],
                },
                { type: "MdSectionEnd", start: 107, end: 107, value: "" },
              ],
            },
            { type: "MdSectionEnd", start: 107, end: 107, value: "" },
          ],
          level: 1,
        },
        {
          type: "MdSection",
          start: 107,
          end: 146,
          value: "\n\n# Header 2\n<p>Third paragraph</p>\n\n  ",
          children: [
            {
              type: "MdHeader",
              start: 107,
              end: 119,
              value: "\n\n# Header 2",
              children: [
                {
                  type: "MdHeaderStart",
                  start: 107,
                  end: 111,
                  value: "\n\n# ",
                  level: 1,
                },
                { type: "MdHeaderEnd", start: 119, end: 119, value: "" },
              ],
              level: 1,
            },
            {
              type: "HtmlTag",
              start: 120,
              end: 142,
              value: "<p>Third paragraph</p>",
              children: [
                {
                  type: "HtmlOpenTag",
                  start: 120,
                  end: 123,
                  value: "<p>",
                  children: [
                    {
                      type: "HtmlTagStart",
                      start: 120,
                      end: 122,
                      value: "<p",
                      children: [
                        {
                          type: "HtmlName",
                          name: "p",
                          start: 121,
                          end: 122,
                          value: "p",
                        },
                      ],
                      tagName: "p",
                    },
                    {
                      type: "HtmlTagEnd",
                      start: 122,
                      end: 123,
                      value: ">",
                      autoclosing: false,
                    },
                  ],
                  tagName: "p",
                  autoclosing: false,
                },
                {
                  type: "HtmlCloseTag",
                  start: 138,
                  end: 142,
                  value: "</p>",
                  children: [
                    {
                      type: "HtmlName",
                      name: "p",
                      start: 140,
                      end: 141,
                      value: "p",
                    },
                  ],
                  tagName: "p",
                },
              ],
            },
          ],
          level: 1,
        },
      ],
    },
  },
  {
    description: "should read mixed HTML tags and markdown",
    input: `# Main Content
<div>

## Sub-Section 1

<p>First paragraph</p>

## Sub-Section 2

<p>Second paragraph</p>

</div>
`,
    expected: {
      type: "Block",
      start: 0,
      end: 114,
      value:
        "# Main Content\n<div>\n\n## Sub-Section 1\n\n<p>First paragraph</p>\n\n## Sub-Section 2\n\n<p>Second paragraph</p>\n\n</div>\n",
      children: [
        {
          type: "MdSection",
          start: 0,
          end: 114,
          value:
            "# Main Content\n<div>\n\n## Sub-Section 1\n\n<p>First paragraph</p>\n\n## Sub-Section 2\n\n<p>Second paragraph</p>\n\n</div>\n",
          children: [
            {
              type: "MdHeader",
              start: 0,
              end: 14,
              value: "# Main Content",
              children: [
                {
                  type: "MdHeaderStart",
                  start: 0,
                  end: 2,
                  value: "# ",
                  level: 1,
                },
                { type: "MdHeaderEnd", start: 14, end: 14, value: "" },
              ],
              level: 1,
            },
            {
              type: "HtmlTag",
              start: 15,
              end: 113,
              value:
                "<div>\n\n## Sub-Section 1\n\n<p>First paragraph</p>\n\n## Sub-Section 2\n\n<p>Second paragraph</p>\n\n</div>",
              children: [
                {
                  type: "HtmlOpenTag",
                  start: 15,
                  end: 20,
                  value: "<div>",
                  children: [
                    {
                      type: "HtmlTagStart",
                      start: 15,
                      end: 19,
                      value: "<div",
                      children: [
                        {
                          type: "HtmlName",
                          name: "div",
                          start: 16,
                          end: 19,
                          value: "div",
                        },
                      ],
                      tagName: "div",
                    },
                    {
                      type: "HtmlTagEnd",
                      start: 19,
                      end: 20,
                      value: ">",
                      autoclosing: false,
                    },
                  ],
                  tagName: "div",
                  autoclosing: false,
                },
                {
                  type: "MdSection",
                  start: 20,
                  end: 62,
                  value: "\n\n## Sub-Section 1\n\n<p>First paragraph</p>",
                  children: [
                    {
                      type: "MdHeader",
                      start: 20,
                      end: 38,
                      value: "\n\n## Sub-Section 1",
                      children: [
                        {
                          type: "MdHeaderStart",
                          start: 20,
                          end: 25,
                          value: "\n\n## ",
                          level: 2,
                        },
                        { type: "MdHeaderEnd", start: 38, end: 38, value: "" },
                      ],
                      level: 2,
                    },
                    {
                      type: "HtmlTag",
                      start: 40,
                      end: 62,
                      value: "<p>First paragraph</p>",
                      children: [
                        {
                          type: "HtmlOpenTag",
                          start: 40,
                          end: 43,
                          value: "<p>",
                          children: [
                            {
                              type: "HtmlTagStart",
                              start: 40,
                              end: 42,
                              value: "<p",
                              children: [
                                {
                                  type: "HtmlName",
                                  name: "p",
                                  start: 41,
                                  end: 42,
                                  value: "p",
                                },
                              ],
                              tagName: "p",
                            },
                            {
                              type: "HtmlTagEnd",
                              start: 42,
                              end: 43,
                              value: ">",
                              autoclosing: false,
                            },
                          ],
                          tagName: "p",
                          autoclosing: false,
                        },
                        {
                          type: "HtmlCloseTag",
                          start: 58,
                          end: 62,
                          value: "</p>",
                          children: [
                            {
                              type: "HtmlName",
                              name: "p",
                              start: 60,
                              end: 61,
                              value: "p",
                            },
                          ],
                          tagName: "p",
                        },
                      ],
                    },
                    { type: "MdSectionEnd", start: 62, end: 62, value: "" },
                  ],
                  level: 2,
                },
                {
                  type: "MdSection",
                  start: 62,
                  end: 107,
                  value: "\n\n## Sub-Section 2\n\n<p>Second paragraph</p>\n\n",
                  children: [
                    {
                      type: "MdHeader",
                      start: 62,
                      end: 80,
                      value: "\n\n## Sub-Section 2",
                      children: [
                        {
                          type: "MdHeaderStart",
                          start: 62,
                          end: 67,
                          value: "\n\n## ",
                          level: 2,
                        },
                        { type: "MdHeaderEnd", start: 80, end: 80, value: "" },
                      ],
                      level: 2,
                    },
                    {
                      type: "HtmlTag",
                      start: 82,
                      end: 105,
                      value: "<p>Second paragraph</p>",
                      children: [
                        {
                          type: "HtmlOpenTag",
                          start: 82,
                          end: 85,
                          value: "<p>",
                          children: [
                            {
                              type: "HtmlTagStart",
                              start: 82,
                              end: 84,
                              value: "<p",
                              children: [
                                {
                                  type: "HtmlName",
                                  name: "p",
                                  start: 83,
                                  end: 84,
                                  value: "p",
                                },
                              ],
                              tagName: "p",
                            },
                            {
                              type: "HtmlTagEnd",
                              start: 84,
                              end: 85,
                              value: ">",
                              autoclosing: false,
                            },
                          ],
                          tagName: "p",
                          autoclosing: false,
                        },
                        {
                          type: "HtmlCloseTag",
                          start: 101,
                          end: 105,
                          value: "</p>",
                          children: [
                            {
                              type: "HtmlName",
                              name: "p",
                              start: 103,
                              end: 104,
                              value: "p",
                            },
                          ],
                          tagName: "p",
                        },
                      ],
                    },
                  ],
                  level: 2,
                },
                {
                  type: "HtmlCloseTag",
                  start: 107,
                  end: 113,
                  value: "</div>",
                  children: [
                    {
                      type: "HtmlName",
                      name: "div",
                      start: 109,
                      end: 112,
                      value: "div",
                    },
                  ],
                  tagName: "div",
                },
              ],
            },
          ],
          level: 1,
        },
      ],
    },
  },
  {
    description: "should allow HTML tags in section headers",
    input: "# Main Content <em>Some text</em>",
    expected: {
      type: "Block",
      start: 0,
      end: 33,
      value: "# Main Content <em>Some text</em>",
      children: [
        {
          type: "MdSection",
          start: 0,
          end: 33,
          value: "# Main Content <em>Some text</em>",
          children: [
            {
              type: "MdHeader",
              start: 0,
              end: 33,
              value: "# Main Content <em>Some text</em>",
              children: [
                {
                  type: "MdHeaderStart",
                  start: 0,
                  end: 2,
                  value: "# ",
                  level: 1,
                },
                {
                  type: "HtmlTag",
                  start: 15,
                  end: 33,
                  value: "<em>Some text</em>",
                  children: [
                    {
                      type: "HtmlOpenTag",
                      start: 15,
                      end: 19,
                      value: "<em>",
                      children: [
                        {
                          type: "HtmlTagStart",
                          start: 15,
                          end: 18,
                          value: "<em",
                          children: [
                            {
                              type: "HtmlName",
                              name: "em",
                              start: 16,
                              end: 18,
                              value: "em",
                            },
                          ],
                          tagName: "em",
                        },
                        {
                          type: "HtmlTagEnd",
                          start: 18,
                          end: 19,
                          value: ">",
                          autoclosing: false,
                        },
                      ],
                      tagName: "em",
                      autoclosing: false,
                    },
                    {
                      type: "HtmlCloseTag",
                      start: 28,
                      end: 33,
                      value: "</em>",
                      children: [
                        {
                          type: "HtmlName",
                          name: "em",
                          start: 30,
                          end: 32,
                          value: "em",
                        },
                      ],
                      tagName: "em",
                    },
                  ],
                },
              ],
              level: 1,
            },
          ],
          level: 1,
        },
      ],
    },
  },
  {
    description: "should allow HTML tags in section headers",
    input: "# Title: Before <em>Some text\n\n</em> After",
    expected: {
      type: "Block",
      start: 0,
      end: 42,
      value: "# Title: Before <em>Some text\n\n</em> After",
      children: [
        {
          type: "MdSection",
          start: 0,
          end: 42,
          value: "# Title: Before <em>Some text\n\n</em> After",
          children: [
            {
              type: "MdHeader",
              start: 0,
              end: 42,
              value: "# Title: Before <em>Some text\n\n</em> After",
              children: [
                {
                  type: "MdHeaderStart",
                  start: 0,
                  end: 2,
                  value: "# ",
                  level: 1,
                },
                {
                  type: "HtmlTag",
                  start: 16,
                  end: 36,
                  value: "<em>Some text\n\n</em>",
                  children: [
                    {
                      type: "HtmlOpenTag",
                      start: 16,
                      end: 20,
                      value: "<em>",
                      children: [
                        {
                          type: "HtmlTagStart",
                          start: 16,
                          end: 19,
                          value: "<em",
                          children: [
                            {
                              type: "HtmlName",
                              name: "em",
                              start: 17,
                              end: 19,
                              value: "em",
                            },
                          ],
                          tagName: "em",
                        },
                        {
                          type: "HtmlTagEnd",
                          start: 19,
                          end: 20,
                          value: ">",
                          autoclosing: false,
                        },
                      ],
                      tagName: "em",
                      autoclosing: false,
                    },
                    {
                      type: "HtmlCloseTag",
                      start: 31,
                      end: 36,
                      value: "</em>",
                      children: [
                        {
                          type: "HtmlName",
                          name: "em",
                          start: 33,
                          end: 35,
                          value: "em",
                        },
                      ],
                      tagName: "em",
                    },
                  ],
                },
              ],
              level: 1,
            },
          ],
          level: 1,
        },
      ],
    },
  },

  {
    input: `
# Header 1: Before <div style="display: grid; grid-auto-rows: 1fr; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-gap: 1rem;">

    \${Promise.all(muybridge.filenames.map((f) => muybridge.file(f).image({style: "width: 100%;"})))}

</div> After

# Header 2

Text
    `,
    description:
      "should interpret headers with tags containing code and white spaces",
    // See https://github.com/observablehq/framework/issues/396
    expected: {
      type: "Block",
      start: 0,
      end: 274,
      value:
        '\n# Header 1: Before <div style="display: grid; grid-auto-rows: 1fr; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-gap: 1rem;">\n\n    ${Promise.all(muybridge.filenames.map((f) => muybridge.file(f).image({style: "width: 100%;"})))}\n\n</div> After\n\n# Header 2\n\nText\n    ',
      children: [
        {
          type: "MdSection",
          start: 0,
          end: 251,
          value:
            '\n# Header 1: Before <div style="display: grid; grid-auto-rows: 1fr; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-gap: 1rem;">\n\n    ${Promise.all(muybridge.filenames.map((f) => muybridge.file(f).image({style: "width: 100%;"})))}\n\n</div> After',
          children: [
            {
              type: "MdHeader",
              start: 0,
              end: 251,
              value:
                '\n# Header 1: Before <div style="display: grid; grid-auto-rows: 1fr; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-gap: 1rem;">\n\n    ${Promise.all(muybridge.filenames.map((f) => muybridge.file(f).image({style: "width: 100%;"})))}\n\n</div> After',
              children: [
                {
                  type: "MdHeaderStart",
                  start: 0,
                  end: 3,
                  value: "\n# ",
                  level: 1,
                },
                {
                  type: "HtmlTag",
                  start: 20,
                  end: 245,
                  value:
                    '<div style="display: grid; grid-auto-rows: 1fr; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-gap: 1rem;">\n\n    ${Promise.all(muybridge.filenames.map((f) => muybridge.file(f).image({style: "width: 100%;"})))}\n\n</div>',
                  children: [
                    {
                      type: "HtmlOpenTag",
                      start: 20,
                      end: 135,
                      value:
                        '<div style="display: grid; grid-auto-rows: 1fr; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-gap: 1rem;">',
                      children: [
                        {
                          type: "HtmlTagStart",
                          start: 20,
                          end: 24,
                          value: "<div",
                          children: [
                            {
                              type: "HtmlName",
                              name: "div",
                              start: 21,
                              end: 24,
                              value: "div",
                            },
                          ],
                          tagName: "div",
                        },
                        {
                          type: "HtmlAttribute",
                          start: 25,
                          end: 134,
                          value:
                            'style="display: grid; grid-auto-rows: 1fr; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-gap: 1rem;"',
                          children: [
                            {
                              type: "HtmlName",
                              name: "style",
                              start: 25,
                              end: 30,
                              value: "style",
                            },
                            {
                              type: "HtmlValue",
                              start: 31,
                              end: 134,
                              value:
                                '"display: grid; grid-auto-rows: 1fr; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-gap: 1rem;"',
                              quoted: true,
                              valueStart: 32,
                              valueEnd: 133,
                            },
                          ],
                        },
                        {
                          type: "HtmlTagEnd",
                          start: 134,
                          end: 135,
                          value: ">",
                          autoclosing: false,
                        },
                      ],
                      tagName: "div",
                      autoclosing: false,
                    },
                    {
                      type: "Code",
                      codeStart: 143,
                      codeEnd: 236,
                      start: 141,
                      end: 237,
                      value:
                        '${Promise.all(muybridge.filenames.map((f) => muybridge.file(f).image({style: "width: 100%;"})))}',
                    },
                    {
                      type: "HtmlCloseTag",
                      start: 239,
                      end: 245,
                      value: "</div>",
                      children: [
                        {
                          type: "HtmlName",
                          name: "div",
                          start: 241,
                          end: 244,
                          value: "div",
                        },
                      ],
                      tagName: "div",
                    },
                  ],
                },
                { type: "MdHeaderEnd", start: 251, end: 251, value: "" },
              ],
              level: 1,
            },
            { type: "MdSectionEnd", start: 251, end: 251, value: "" },
          ],
          level: 1,
        },
        {
          type: "MdSection",
          start: 251,
          end: 274,
          value: "\n\n# Header 2\n\nText\n    ",
          children: [
            {
              type: "MdHeader",
              start: 251,
              end: 263,
              value: "\n\n# Header 2",
              children: [
                {
                  type: "MdHeaderStart",
                  start: 251,
                  end: 255,
                  value: "\n\n# ",
                  level: 1,
                },
                { type: "MdHeaderEnd", start: 263, end: 263, value: "" },
              ],
              level: 1,
            },
          ],
          level: 1,
        },
      ],
    },
  },
  {
    input: `<style>

    body {
      background: \${color};
    }
    
    </style>`,
    description: "should read style tag with code",
    // See https://github.com/observablehq/framework/pull/597
    expected: {
      type: "Block",
      start: 0,
      end: 71,
      value:
        "<style>\n\n    body {\n      background: ${color};\n    }\n    \n    </style>",
      children: [
        {
          type: "HtmlTag",
          start: 0,
          end: 71,
          value:
            "<style>\n\n    body {\n      background: ${color};\n    }\n    \n    </style>",
          children: [
            {
              type: "HtmlOpenTag",
              start: 0,
              end: 7,
              value: "<style>",
              children: [
                {
                  type: "HtmlTagStart",
                  start: 0,
                  end: 6,
                  value: "<style",
                  children: [
                    {
                      type: "HtmlName",
                      name: "style",
                      start: 1,
                      end: 6,
                      value: "style",
                    },
                  ],
                  tagName: "style",
                },
                {
                  type: "HtmlTagEnd",
                  start: 6,
                  end: 7,
                  value: ">",
                  autoclosing: false,
                },
              ],
              tagName: "style",
              autoclosing: false,
            },
            {
              type: "Code",
              codeStart: 40,
              codeEnd: 45,
              start: 38,
              end: 46,
              value: "${color}",
            },
            {
              type: "HtmlCloseTag",
              start: 63,
              end: 71,
              value: "</style>",
              children: [
                {
                  type: "HtmlName",
                  name: "style",
                  start: 65,
                  end: 70,
                  value: "style",
                },
              ],
              tagName: "style",
            },
          ],
        },
      ],
    },
  },
];
