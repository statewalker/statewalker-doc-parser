import { type TTestData } from "../data.types.ts";

export const testData: TTestData[] = [
  {
    description: "should properly read empty documents",
    input: "",
    expected: {
      type: "Block",
      start: 0,
      end: 0,
      value: "",
    },
  },
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
  {
    input:
      "# Header\n    \n    - item one \n      - subitem <sup>1</sup>\n      - subitem <sup>2</sup>\n    - item two\n\n    Hello!\n\n    ",
    description: "should read lists with code",
    expected: {
      type: "Block",
      start: 0,
      end: 120,
      value:
        "# Header\n    \n    - item one \n      - subitem <sup>1</sup>\n      - subitem <sup>2</sup>\n    - item two\n\n    Hello!\n\n    ",
      children: [
        {
          type: "MdSection",
          start: 0,
          end: 120,
          value:
            "# Header\n    \n    - item one \n      - subitem <sup>1</sup>\n      - subitem <sup>2</sup>\n    - item two\n\n    Hello!\n\n    ",
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
                {
                  type: "MdHeaderEnd",
                  start: 8,
                  end: 8,
                  value: "",
                },
              ],
              level: 1,
            },
            {
              type: "MdList",
              start: 13,
              end: 102,
              value:
                "\n    - item one \n      - subitem <sup>1</sup>\n      - subitem <sup>2</sup>\n    - item two",
              children: [
                {
                  type: "MdListItem",
                  start: 13,
                  end: 87,
                  value:
                    "\n    - item one \n      - subitem <sup>1</sup>\n      - subitem <sup>2</sup>",
                  children: [
                    {
                      type: "MdListItemStart",
                      start: 13,
                      end: 20,
                      value: "\n    - ",
                      depth: 4,
                      marker: "    -",
                    },
                    {
                      type: "MdListItemContent",
                      start: 20,
                      end: 87,
                      value:
                        "item one \n      - subitem <sup>1</sup>\n      - subitem <sup>2</sup>",
                      children: [
                        {
                          type: "MdList",
                          start: 29,
                          end: 87,
                          value:
                            "\n      - subitem <sup>1</sup>\n      - subitem <sup>2</sup>",
                          children: [
                            {
                              type: "MdListItem",
                              start: 29,
                              end: 58,
                              value: "\n      - subitem <sup>1</sup>",
                              children: [
                                {
                                  type: "MdListItemStart",
                                  start: 29,
                                  end: 38,
                                  value: "\n      - ",
                                  depth: 6,
                                  marker: "      -",
                                },
                                {
                                  type: "MdListItemContent",
                                  start: 38,
                                  end: 58,
                                  value: "subitem <sup>1</sup>",
                                  children: [
                                    {
                                      type: "HtmlTag",
                                      start: 46,
                                      end: 58,
                                      value: "<sup>1</sup>",
                                      children: [
                                        {
                                          type: "HtmlOpenTag",
                                          start: 46,
                                          end: 51,
                                          value: "<sup>",
                                          children: [
                                            {
                                              type: "HtmlTagStart",
                                              start: 46,
                                              end: 50,
                                              value: "<sup",
                                              children: [
                                                {
                                                  type: "HtmlName",
                                                  name: "sup",
                                                  start: 47,
                                                  end: 50,
                                                  value: "sup",
                                                },
                                              ],
                                              tagName: "sup",
                                            },
                                            {
                                              type: "HtmlTagEnd",
                                              start: 50,
                                              end: 51,
                                              value: ">",
                                              autoclosing: false,
                                            },
                                          ],
                                          tagName: "sup",
                                          autoclosing: false,
                                        },
                                        {
                                          type: "HtmlCloseTag",
                                          start: 52,
                                          end: 58,
                                          value: "</sup>",
                                          children: [
                                            {
                                              type: "HtmlName",
                                              name: "sup",
                                              start: 54,
                                              end: 57,
                                              value: "sup",
                                            },
                                          ],
                                          tagName: "sup",
                                        },
                                      ],
                                    },
                                  ],
                                },
                                {
                                  type: "MdListItemEnd",
                                  start: 58,
                                  end: 58,
                                  value: "",
                                },
                              ],
                            },
                            {
                              type: "MdListItem",
                              start: 58,
                              end: 87,
                              value: "\n      - subitem <sup>2</sup>",
                              children: [
                                {
                                  type: "MdListItemStart",
                                  start: 58,
                                  end: 67,
                                  value: "\n      - ",
                                  depth: 6,
                                  marker: "      -",
                                },
                                {
                                  type: "MdListItemContent",
                                  start: 67,
                                  end: 87,
                                  value: "subitem <sup>2</sup>",
                                  children: [
                                    {
                                      type: "HtmlTag",
                                      start: 75,
                                      end: 87,
                                      value: "<sup>2</sup>",
                                      children: [
                                        {
                                          type: "HtmlOpenTag",
                                          start: 75,
                                          end: 80,
                                          value: "<sup>",
                                          children: [
                                            {
                                              type: "HtmlTagStart",
                                              start: 75,
                                              end: 79,
                                              value: "<sup",
                                              children: [
                                                {
                                                  type: "HtmlName",
                                                  name: "sup",
                                                  start: 76,
                                                  end: 79,
                                                  value: "sup",
                                                },
                                              ],
                                              tagName: "sup",
                                            },
                                            {
                                              type: "HtmlTagEnd",
                                              start: 79,
                                              end: 80,
                                              value: ">",
                                              autoclosing: false,
                                            },
                                          ],
                                          tagName: "sup",
                                          autoclosing: false,
                                        },
                                        {
                                          type: "HtmlCloseTag",
                                          start: 81,
                                          end: 87,
                                          value: "</sup>",
                                          children: [
                                            {
                                              type: "HtmlName",
                                              name: "sup",
                                              start: 83,
                                              end: 86,
                                              value: "sup",
                                            },
                                          ],
                                          tagName: "sup",
                                        },
                                      ],
                                    },
                                  ],
                                },
                                {
                                  type: "MdListItemEnd",
                                  start: 87,
                                  end: 87,
                                  value: "",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: "MdListItemEnd",
                      start: 87,
                      end: 87,
                      value: "",
                    },
                  ],
                },
                {
                  type: "MdListItem",
                  start: 87,
                  end: 102,
                  value: "\n    - item two",
                  children: [
                    {
                      type: "MdListItemStart",
                      start: 87,
                      end: 94,
                      value: "\n    - ",
                      depth: 4,
                      marker: "    -",
                    },
                    {
                      type: "MdListItemContent",
                      start: 94,
                      end: 102,
                      value: "item two",
                    },
                    {
                      type: "MdListItemEnd",
                      start: 102,
                      end: 102,
                      value: "",
                    },
                  ],
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
    description: "should tokenize simple hierarchical list",
    input:
      "\n    - item one \n      - sub-item 1\n      - sub-item 2\n    - item two\n    ",
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
                              depth: 6,
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
                              depth: 6,
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
                {
                  type: "MdListItemEnd",
                  start: 54,
                  end: 54,
                  value: "",
                },
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
                  depth: 4,
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
    description: "should tokenize document sections with lists",
    input:
      "\n    # Header 1\n    - item one \n      - sub-item 1\n      - sub-item 2\n        the rest of sub-item 2\n    - item two\n    ",
    expected: {
      type: "Block",
      start: 0,
      end: 120,
      value:
        "\n    # Header 1\n    - item one \n      - sub-item 1\n      - sub-item 2\n        the rest of sub-item 2\n    - item two\n    ",
      children: [
        {
          type: "MdSection",
          start: 0,
          end: 120,
          value:
            "\n    # Header 1\n    - item one \n      - sub-item 1\n      - sub-item 2\n        the rest of sub-item 2\n    - item two\n    ",
          children: [
            {
              type: "MdHeader",
              start: 0,
              end: 15,
              value: "\n    # Header 1",
              children: [
                {
                  type: "MdHeaderStart",
                  start: 0,
                  end: 7,
                  value: "\n    # ",
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
            {
              type: "MdList",
              start: 15,
              end: 120,
              value:
                "\n    - item one \n      - sub-item 1\n      - sub-item 2\n        the rest of sub-item 2\n    - item two\n    ",
              children: [
                {
                  type: "MdListItem",
                  start: 15,
                  end: 100,
                  value:
                    "\n    - item one \n      - sub-item 1\n      - sub-item 2\n        the rest of sub-item 2",
                  children: [
                    {
                      type: "MdListItemStart",
                      start: 15,
                      end: 22,
                      value: "\n    - ",
                      depth: 4,
                      marker: "    -",
                    },
                    {
                      type: "MdListItemContent",
                      start: 22,
                      end: 100,
                      value:
                        "item one \n      - sub-item 1\n      - sub-item 2\n        the rest of sub-item 2",
                      children: [
                        {
                          type: "MdList",
                          start: 31,
                          end: 100,
                          value:
                            "\n      - sub-item 1\n      - sub-item 2\n        the rest of sub-item 2",
                          children: [
                            {
                              type: "MdListItem",
                              start: 31,
                              end: 50,
                              value: "\n      - sub-item 1",
                              children: [
                                {
                                  type: "MdListItemStart",
                                  start: 31,
                                  end: 40,
                                  value: "\n      - ",
                                  depth: 6,
                                  marker: "      -",
                                },
                                {
                                  type: "MdListItemContent",
                                  start: 40,
                                  end: 50,
                                  value: "sub-item 1",
                                },
                                {
                                  type: "MdListItemEnd",
                                  start: 50,
                                  end: 50,
                                  value: "",
                                },
                              ],
                            },
                            {
                              type: "MdListItem",
                              start: 50,
                              end: 100,
                              value:
                                "\n      - sub-item 2\n        the rest of sub-item 2",
                              children: [
                                {
                                  type: "MdListItemStart",
                                  start: 50,
                                  end: 59,
                                  value: "\n      - ",
                                  depth: 6,
                                  marker: "      -",
                                },
                                {
                                  type: "MdListItemContent",
                                  start: 59,
                                  end: 100,
                                  value:
                                    "sub-item 2\n        the rest of sub-item 2",
                                },
                                {
                                  type: "MdListItemEnd",
                                  start: 100,
                                  end: 100,
                                  value: "",
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: "MdListItemEnd",
                      start: 100,
                      end: 100,
                      value: "",
                    },
                  ],
                },
                {
                  type: "MdListItem",
                  start: 100,
                  end: 120,
                  value: "\n    - item two\n    ",
                  children: [
                    {
                      type: "MdListItemStart",
                      start: 100,
                      end: 107,
                      value: "\n    - ",
                      depth: 4,
                      marker: "    -",
                    },
                    {
                      type: "MdListItemContent",
                      start: 107,
                      end: 120,
                      value: "item two\n    ",
                    },
                  ],
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
    description: "should tokenize document with tags, headers with lists",
    input:
      '\n    <div className="note">\n      * item one\n      * item two\n    </div>\n    ',
    expected: {
      type: "Block",
      start: 0,
      end: 77,
      value:
        '\n    <div className="note">\n      * item one\n      * item two\n    </div>\n    ',
      children: [
        {
          type: "HtmlTag",
          start: 5,
          end: 72,
          value:
            '<div className="note">\n      * item one\n      * item two\n    </div>',
          children: [
            {
              type: "HtmlOpenTag",
              start: 5,
              end: 27,
              value: '<div className="note">',
              children: [
                {
                  type: "HtmlTagStart",
                  start: 5,
                  end: 9,
                  value: "<div",
                  children: [
                    {
                      type: "HtmlName",
                      name: "div",
                      start: 6,
                      end: 9,
                      value: "div",
                    },
                  ],
                  tagName: "div",
                },
                {
                  type: "HtmlAttribute",
                  start: 10,
                  end: 26,
                  value: 'className="note"',
                  children: [
                    {
                      type: "HtmlName",
                      name: "className",
                      start: 10,
                      end: 19,
                      value: "className",
                    },
                    {
                      type: "HtmlValue",
                      start: 20,
                      end: 26,
                      value: '"note"',
                      quoted: true,
                      valueStart: 21,
                      valueEnd: 25,
                    },
                  ],
                },
                {
                  type: "HtmlTagEnd",
                  start: 26,
                  end: 27,
                  value: ">",
                  autoclosing: false,
                },
              ],
              tagName: "div",
              autoclosing: false,
            },
            {
              type: "MdList",
              start: 27,
              end: 66,
              value: "\n      * item one\n      * item two\n    ",
              children: [
                {
                  type: "MdListItem",
                  start: 27,
                  end: 44,
                  value: "\n      * item one",
                  children: [
                    {
                      type: "MdListItemStart",
                      start: 27,
                      end: 36,
                      value: "\n      * ",
                      depth: 6,
                      marker: "      *",
                    },
                    {
                      type: "MdListItemContent",
                      start: 36,
                      end: 44,
                      value: "item one",
                    },
                    {
                      type: "MdListItemEnd",
                      start: 44,
                      end: 44,
                      value: "",
                    },
                  ],
                },
                {
                  type: "MdListItem",
                  start: 44,
                  end: 66,
                  value: "\n      * item two\n    ",
                  children: [
                    {
                      type: "MdListItemStart",
                      start: 44,
                      end: 53,
                      value: "\n      * ",
                      depth: 6,
                      marker: "      *",
                    },
                    {
                      type: "MdListItemContent",
                      start: 53,
                      end: 66,
                      value: "item two\n    ",
                    },
                  ],
                },
              ],
            },
            {
              type: "HtmlCloseTag",
              start: 66,
              end: 72,
              value: "</div>",
              children: [
                {
                  type: "HtmlName",
                  name: "div",
                  start: 68,
                  end: 71,
                  value: "div",
                },
              ],
              tagName: "div",
            },
          ],
        },
      ],
    },
  },
  {
    description: "should tokenize document with tags, headers with lists",
    input:
      '\n    <div className="note">\n      #  Header\n      * Some notable things in a block quote!\n    </div>\n    ',
    expected: {
      type: "Block",
      start: 0,
      end: 105,
      value:
        '\n    <div className="note">\n      #  Header\n      * Some notable things in a block quote!\n    </div>\n    ',
      children: [
        {
          type: "HtmlTag",
          start: 5,
          end: 105,
          value:
            '<div className="note">\n      #  Header\n      * Some notable things in a block quote!\n    </div>\n    ',
          children: [
            {
              type: "HtmlOpenTag",
              start: 5,
              end: 27,
              value: '<div className="note">',
              children: [
                {
                  type: "HtmlTagStart",
                  start: 5,
                  end: 9,
                  value: "<div",
                  children: [
                    {
                      type: "HtmlName",
                      name: "div",
                      start: 6,
                      end: 9,
                      value: "div",
                    },
                  ],
                  tagName: "div",
                },
                {
                  type: "HtmlAttribute",
                  start: 10,
                  end: 26,
                  value: 'className="note"',
                  children: [
                    {
                      type: "HtmlName",
                      name: "className",
                      start: 10,
                      end: 19,
                      value: "className",
                    },
                    {
                      type: "HtmlValue",
                      start: 20,
                      end: 26,
                      value: '"note"',
                      quoted: true,
                      valueStart: 21,
                      valueEnd: 25,
                    },
                  ],
                },
                {
                  type: "HtmlTagEnd",
                  start: 26,
                  end: 27,
                  value: ">",
                  autoclosing: false,
                },
              ],
              tagName: "div",
              autoclosing: false,
            },
            {
              type: "MdSection",
              start: 27,
              end: 105,
              value:
                "\n      #  Header\n      * Some notable things in a block quote!\n    </div>\n    ",
              children: [
                {
                  type: "MdHeader",
                  start: 27,
                  end: 43,
                  value: "\n      #  Header",
                  children: [
                    {
                      type: "MdHeaderStart",
                      start: 27,
                      end: 36,
                      value: "\n      # ",
                      level: 1,
                    },
                    {
                      type: "MdHeaderEnd",
                      start: 43,
                      end: 43,
                      value: "",
                    },
                  ],
                  level: 1,
                },
                {
                  type: "MdList",
                  start: 43,
                  end: 105,
                  value:
                    "\n      * Some notable things in a block quote!\n    </div>\n    ",
                  children: [
                    {
                      type: "MdListItem",
                      start: 43,
                      end: 105,
                      value:
                        "\n      * Some notable things in a block quote!\n    </div>\n    ",
                      children: [
                        {
                          type: "MdListItemStart",
                          start: 43,
                          end: 52,
                          value: "\n      * ",
                          depth: 6,
                          marker: "      *",
                        },
                        {
                          type: "MdListItemContent",
                          start: 52,
                          end: 105,
                          value:
                            "Some notable things in a block quote!\n    </div>\n    ",
                          children: [
                            {
                              type: "HtmlSpecialSymbol",
                              value: "<",
                              start: 94,
                              end: 95,
                            },
                            {
                              type: "HtmlSpecialSymbol",
                              value: ">",
                              start: 99,
                              end: 100,
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
              level: 1,
            },
          ],
        },
      ],
    },
  },

  {
    description: "should tokenize MD code blocks",
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
    description: "should tokenize MD code blocks with tags",
    input:
      "before <TagOne> hello <TagTwo> wonderful </TagOne> world!</TagTwo> after ",
    expected: {
      type: "Block",
      start: 0,
      end: 73,
      value:
        "before <TagOne> hello <TagTwo> wonderful </TagOne> world!</TagTwo> after ",
      children: [
        {
          type: "HtmlTag",
          start: 7,
          end: 50,
          value: "<TagOne> hello <TagTwo> wonderful </TagOne>",
          children: [
            {
              type: "HtmlOpenTag",
              start: 7,
              end: 15,
              value: "<TagOne>",
              children: [
                {
                  type: "HtmlTagStart",
                  start: 7,
                  end: 14,
                  value: "<TagOne",
                  children: [
                    {
                      type: "HtmlName",
                      name: "TagOne",
                      start: 8,
                      end: 14,
                      value: "TagOne",
                    },
                  ],
                  tagName: "TagOne",
                },
                {
                  type: "HtmlTagEnd",
                  start: 14,
                  end: 15,
                  value: ">",
                  autoclosing: false,
                },
              ],
              tagName: "TagOne",
              autoclosing: false,
            },
            {
              type: "HtmlTag",
              start: 22,
              end: 41,
              value: "<TagTwo> wonderful ",
              children: [
                {
                  type: "HtmlOpenTag",
                  start: 22,
                  end: 30,
                  value: "<TagTwo>",
                  children: [
                    {
                      type: "HtmlTagStart",
                      start: 22,
                      end: 29,
                      value: "<TagTwo",
                      children: [
                        {
                          type: "HtmlName",
                          name: "TagTwo",
                          start: 23,
                          end: 29,
                          value: "TagTwo",
                        },
                      ],
                      tagName: "TagTwo",
                    },
                    {
                      type: "HtmlTagEnd",
                      start: 29,
                      end: 30,
                      value: ">",
                      autoclosing: false,
                    },
                  ],
                  tagName: "TagTwo",
                  autoclosing: false,
                },
              ],
            },
            {
              type: "HtmlCloseTag",
              start: 41,
              end: 50,
              value: "</TagOne>",
              children: [
                {
                  type: "HtmlName",
                  name: "TagOne",
                  start: 43,
                  end: 49,
                  value: "TagOne",
                },
              ],
              tagName: "TagOne",
            },
          ],
        },
        { type: "HtmlSpecialSymbol", value: "<", start: 57, end: 58 },
        { type: "HtmlSpecialSymbol", value: ">", start: 65, end: 66 },
      ],
    },
  },
];
