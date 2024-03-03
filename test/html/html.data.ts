import { type TTestData } from "../data.types.ts";

export const testData: TTestData[] = [
  {
    input: "<a",
    description: `should read simple opening tags`,
    expected: {
      type: "Block",
      start: 0,
      end: 2,
      value: "<a",
      children: [
        {
          type: "HtmlTag",
          start: 0,
          end: 2,
          value: "<a",
          children: [
            {
              type: "HtmlOpenTag",
              start: 0,
              end: 2,
              value: "<a",
              children: [
                {
                  type: "HtmlTagStart",
                  start: 0,
                  end: 2,
                  value: "<a",
                  children: [
                    {
                      type: "HtmlName",
                      name: "a",
                      start: 1,
                      end: 2,
                      value: "a",
                    },
                  ],
                  tagName: "a",
                },
              ],
              tagName: "a",
              autoclosing: false,
            },
          ],
        },
      ],
    },
  },
  {
    input: "before <div>Hello</div> after",
    description: `should read simple opening/closing tag pair tags`,
    expected: {
      type: "Block",
      start: 0,
      end: 29,
      value: "before <div>Hello</div> after",
      children: [
        {
          type: "HtmlTag",
          start: 7,
          end: 23,
          value: "<div>Hello</div>",
          children: [
            {
              type: "HtmlOpenTag",
              start: 7,
              end: 12,
              value: "<div>",
              children: [
                {
                  type: "HtmlTagStart",
                  start: 7,
                  end: 11,
                  value: "<div",
                  children: [
                    {
                      type: "HtmlName",
                      name: "div",
                      start: 8,
                      end: 11,
                      value: "div",
                    },
                  ],
                  tagName: "div",
                },
                {
                  type: "HtmlTagEnd",
                  start: 11,
                  end: 12,
                  value: ">",
                  autoclosing: false,
                },
              ],
              tagName: "div",
              autoclosing: false,
            },
            {
              type: "HtmlCloseTag",
              start: 17,
              end: 23,
              value: "</div>",
              children: [
                {
                  type: "HtmlName",
                  name: "div",
                  start: 19,
                  end: 22,
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
    input:
      "<div>before <em><a href=http://www.google.com>Google</a> after</em></div>",
    description: `should read opening and closing tags`,
    expected: {
      type: "Block",
      start: 0,
      end: 73,
      value:
        "<div>before <em><a href=http://www.google.com>Google</a> after</em></div>",
      children: [
        {
          type: "HtmlTag",
          start: 0,
          end: 73,
          value:
            "<div>before <em><a href=http://www.google.com>Google</a> after</em></div>",
          children: [
            {
              type: "HtmlOpenTag",
              start: 0,
              end: 5,
              value: "<div>",
              children: [
                {
                  type: "HtmlTagStart",
                  start: 0,
                  end: 4,
                  value: "<div",
                  children: [
                    {
                      type: "HtmlName",
                      name: "div",
                      start: 1,
                      end: 4,
                      value: "div",
                    },
                  ],
                  tagName: "div",
                },
                {
                  type: "HtmlTagEnd",
                  start: 4,
                  end: 5,
                  value: ">",
                  autoclosing: false,
                },
              ],
              tagName: "div",
              autoclosing: false,
            },
            {
              type: "HtmlTag",
              start: 12,
              end: 67,
              value: "<em><a href=http://www.google.com>Google</a> after</em>",
              children: [
                {
                  type: "HtmlOpenTag",
                  start: 12,
                  end: 16,
                  value: "<em>",
                  children: [
                    {
                      type: "HtmlTagStart",
                      start: 12,
                      end: 15,
                      value: "<em",
                      children: [
                        {
                          type: "HtmlName",
                          name: "em",
                          start: 13,
                          end: 15,
                          value: "em",
                        },
                      ],
                      tagName: "em",
                    },
                    {
                      type: "HtmlTagEnd",
                      start: 15,
                      end: 16,
                      value: ">",
                      autoclosing: false,
                    },
                  ],
                  tagName: "em",
                  autoclosing: false,
                },
                {
                  type: "HtmlTag",
                  start: 16,
                  end: 56,
                  value: "<a href=http://www.google.com>Google</a>",
                  children: [
                    {
                      type: "HtmlOpenTag",
                      start: 16,
                      end: 46,
                      value: "<a href=http://www.google.com>",
                      children: [
                        {
                          type: "HtmlTagStart",
                          start: 16,
                          end: 18,
                          value: "<a",
                          children: [
                            {
                              type: "HtmlName",
                              name: "a",
                              start: 17,
                              end: 18,
                              value: "a",
                            },
                          ],
                          tagName: "a",
                        },
                        {
                          type: "HtmlAttribute",
                          start: 19,
                          end: 45,
                          value: "href=http://www.google.com",
                          children: [
                            {
                              type: "HtmlName",
                              name: "href",
                              start: 19,
                              end: 23,
                              value: "href",
                            },
                            {
                              type: "HtmlValue",
                              value: "http://www.google.com",
                              start: 24,
                              end: 45,
                              quoted: false,
                              valueStart: 24,
                              valueEnd: 45,
                            },
                          ],
                        },
                        {
                          type: "HtmlTagEnd",
                          start: 45,
                          end: 46,
                          value: ">",
                          autoclosing: false,
                        },
                      ],
                      tagName: "a",
                      autoclosing: false,
                    },
                    {
                      type: "HtmlCloseTag",
                      start: 52,
                      end: 56,
                      value: "</a>",
                      children: [
                        {
                          type: "HtmlName",
                          name: "a",
                          start: 54,
                          end: 55,
                          value: "a",
                        },
                      ],
                      tagName: "a",
                    },
                  ],
                },
                {
                  type: "HtmlCloseTag",
                  start: 62,
                  end: 67,
                  value: "</em>",
                  children: [
                    {
                      type: "HtmlName",
                      name: "em",
                      start: 64,
                      end: 66,
                      value: "em",
                    },
                  ],
                  tagName: "em",
                },
              ],
            },
            {
              type: "HtmlCloseTag",
              start: 67,
              end: 73,
              value: "</div>",
              children: [
                {
                  type: "HtmlName",
                  name: "div",
                  start: 69,
                  end: 72,
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
    description: `should properly manage wrong nesting`,
    input: "before <em><strong>text</em></strong> after",
    // In this test, the <em> tag is closed before the <strong> tag
    // So the result is that the <strong> tag is a child of the <em> tag
    // and it is closed with the parent </em>. The closing </strong>
    // is ignored and interpreted as a text with special symbols ("<" and ">").
    expected: {
      type: "Block",
      start: 0,
      end: 43,
      value: "before <em><strong>text</em></strong> after",
      children: [
        {
          type: "HtmlTag",
          start: 7,
          end: 28,
          value: "<em><strong>text</em>",
          children: [
            {
              type: "HtmlOpenTag",
              start: 7,
              end: 11,
              value: "<em>",
              children: [
                {
                  type: "HtmlTagStart",
                  start: 7,
                  end: 10,
                  value: "<em",
                  children: [
                    {
                      type: "HtmlName",
                      name: "em",
                      start: 8,
                      end: 10,
                      value: "em",
                    },
                  ],
                  tagName: "em",
                },
                {
                  type: "HtmlTagEnd",
                  start: 10,
                  end: 11,
                  value: ">",
                  autoclosing: false,
                },
              ],
              tagName: "em",
              autoclosing: false,
            },
            {
              type: "HtmlTag",
              start: 11,
              end: 23,
              value: "<strong>text",
              children: [
                {
                  type: "HtmlOpenTag",
                  start: 11,
                  end: 19,
                  value: "<strong>",
                  children: [
                    {
                      type: "HtmlTagStart",
                      start: 11,
                      end: 18,
                      value: "<strong",
                      children: [
                        {
                          type: "HtmlName",
                          name: "strong",
                          start: 12,
                          end: 18,
                          value: "strong",
                        },
                      ],
                      tagName: "strong",
                    },
                    {
                      type: "HtmlTagEnd",
                      start: 18,
                      end: 19,
                      value: ">",
                      autoclosing: false,
                    },
                  ],
                  tagName: "strong",
                  autoclosing: false,
                },
              ],
            },
            {
              type: "HtmlCloseTag",
              start: 23,
              end: 28,
              value: "</em>",
              children: [
                {
                  type: "HtmlName",
                  name: "em",
                  start: 25,
                  end: 27,
                  value: "em",
                },
              ],
              tagName: "em",
            },
          ],
        },
        { type: "HtmlSpecialSymbol", value: "<", start: 28, end: 29 },
        { type: "HtmlSpecialSymbol", value: ">", start: 36, end: 37 },
      ],
    },
  },

  {
    description: `should handle autoclosing tags`,
    input: "before <img src='./my-dog.jpg' /></img> after",
    // In this test the <img> tag is autoclosed and the closing </img> tag
    // is just ignored and "<" and ">" are interpreted as special symbols.
    expected: {
      type: "Block",
      start: 0,
      end: 45,
      value: "before <img src='./my-dog.jpg' /></img> after",
      children: [
        {
          type: "HtmlTag",
          start: 7,
          end: 33,
          value: "<img src='./my-dog.jpg' />",
          children: [
            {
              type: "HtmlOpenTag",
              start: 7,
              end: 33,
              value: "<img src='./my-dog.jpg' />",
              children: [
                {
                  type: "HtmlTagStart",
                  start: 7,
                  end: 11,
                  value: "<img",
                  children: [
                    {
                      type: "HtmlName",
                      name: "img",
                      start: 8,
                      end: 11,
                      value: "img",
                    },
                  ],
                  tagName: "img",
                },
                {
                  type: "HtmlAttribute",
                  start: 12,
                  end: 30,
                  value: "src='./my-dog.jpg'",
                  children: [
                    {
                      type: "HtmlName",
                      name: "src",
                      start: 12,
                      end: 15,
                      value: "src",
                    },
                    {
                      type: "HtmlValue",
                      start: 16,
                      end: 30,
                      value: "'./my-dog.jpg'",
                      quoted: true,
                      valueStart: 17,
                      valueEnd: 29,
                    },
                  ],
                },
                {
                  type: "HtmlTagEnd",
                  start: 31,
                  end: 33,
                  value: "/>",
                  autoclosing: true,
                },
              ],
              tagName: "img",
              autoclosing: true,
            },
            { type: "HtmlCloseTag", start: 33, end: 33, value: "" },
          ],
        },
        { type: "HtmlSpecialSymbol", value: "<", start: 33, end: 34 },
        { type: "HtmlSpecialSymbol", value: ">", start: 38, end: 39 },
      ],
    },
  },

  {
    description: `should handle HTML comments`,
    input: "before <!-- this is a comment --> after",
    expected: {
      type: "Block",
      start: 0,
      end: 39,
      value: "before <!-- this is a comment --> after",
      children: [
        {
          type: "HtmlComment",
          start: 7,
          end: 33,
          value: "<!-- this is a comment -->",
          children: [
            {
              type: "StartHtmlComment",
              start: 7,
              end: 11,
              value: "<!--",
            },
            {
              type: "EndHtmlComment",
              start: 30,
              end: 33,
              value: "-->",
            },
          ],
        },
      ],
    },
  },

  {
    description: `should allow code in HTML comments`,
    input: "before <!-- A ${this is the code} B --> after",
    expected: {
      type: "Block",
      start: 0,
      end: 45,
      value: "before <!-- A ${this is the code} B --> after",
      children: [
        {
          type: "HtmlComment",
          start: 7,
          end: 39,
          value: "<!-- A ${this is the code} B -->",
          children: [
            {
              type: "StartHtmlComment",
              start: 7,
              end: 11,
              value: "<!--",
            },
            {
              type: "Code",
              codeStart: 16,
              codeEnd: 32,
              start: 14,
              end: 33,
              value: "${this is the code}",
            },
            {
              type: "EndHtmlComment",
              start: 36,
              end: 39,
              value: "-->",
            },
          ],
        },
      ],
    },
  },

  {
    description: `should allow code in tags, attributes, text etc`,
    input: `before 
    <div \${{foo : "Foo", bar: "Bar"}} style=\${{ color:"red"}} title="Message: \${'Hello'}">
      Red text: \${"Hello, world"}!
    </div>
    <!-- A \${this is the code} B --> 
    after
    `,
    expected: {
      type: "Block",
      start: 0,
      end: 197,
      value:
        'before \n    <div ${{foo : "Foo", bar: "Bar"}} style=${{ color:"red"}} title="Message: ${\'Hello\'}">\n      Red text: ${"Hello, world"}!\n    </div>\n    <!-- A ${this is the code} B --> \n    after\n    ',
      children: [
        {
          type: "HtmlTag",
          start: 12,
          end: 144,
          value:
            '<div ${{foo : "Foo", bar: "Bar"}} style=${{ color:"red"}} title="Message: ${\'Hello\'}">\n      Red text: ${"Hello, world"}!\n    </div>',
          children: [
            {
              type: "HtmlOpenTag",
              start: 12,
              end: 98,
              value:
                '<div ${{foo : "Foo", bar: "Bar"}} style=${{ color:"red"}} title="Message: ${\'Hello\'}">',
              children: [
                {
                  type: "HtmlTagStart",
                  start: 12,
                  end: 16,
                  value: "<div",
                  children: [
                    {
                      type: "HtmlName",
                      name: "div",
                      start: 13,
                      end: 16,
                      value: "div",
                    },
                  ],
                  tagName: "div",
                },
                {
                  type: "Code",
                  codeStart: 19,
                  codeEnd: 44,
                  start: 17,
                  end: 45,
                  value: '${{foo : "Foo", bar: "Bar"}}',
                },
                {
                  type: "HtmlAttribute",
                  start: 46,
                  end: 69,
                  value: 'style=${{ color:"red"}}',
                  children: [
                    {
                      type: "HtmlName",
                      name: "style",
                      start: 46,
                      end: 51,
                      value: "style",
                    },
                    {
                      type: "HtmlValue",
                      quoted: false,
                      start: 52,
                      end: 69,
                      valueStart: 52,
                      valueEnd: 69,
                      value: '${{ color:"red"}}',
                      children: [
                        {
                          type: "Code",
                          codeStart: 54,
                          codeEnd: 68,
                          start: 52,
                          end: 69,
                          value: '${{ color:"red"}}',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "HtmlAttribute",
                  start: 70,
                  end: 97,
                  value: "title=\"Message: ${'Hello'}\"",
                  children: [
                    {
                      type: "HtmlName",
                      name: "title",
                      start: 70,
                      end: 75,
                      value: "title",
                    },
                    {
                      type: "HtmlValue",
                      start: 76,
                      end: 97,
                      value: "\"Message: ${'Hello'}\"",
                      children: [
                        {
                          type: "Code",
                          codeStart: 88,
                          codeEnd: 95,
                          start: 86,
                          end: 96,
                          value: "${'Hello'}",
                        },
                      ],
                      quoted: true,
                      valueStart: 77,
                      valueEnd: 96,
                    },
                  ],
                },
                {
                  type: "HtmlTagEnd",
                  start: 97,
                  end: 98,
                  value: ">",
                  autoclosing: false,
                },
              ],
              tagName: "div",
              autoclosing: false,
            },
            {
              type: "Code",
              codeStart: 117,
              codeEnd: 131,
              start: 115,
              end: 132,
              value: '${"Hello, world"}',
            },
            {
              type: "HtmlCloseTag",
              start: 138,
              end: 144,
              value: "</div>",
              children: [
                {
                  type: "HtmlName",
                  name: "div",
                  start: 140,
                  end: 143,
                  value: "div",
                },
              ],
              tagName: "div",
            },
          ],
        },
        {
          type: "HtmlComment",
          start: 149,
          end: 181,
          value: "<!-- A ${this is the code} B -->",
          children: [
            { type: "StartHtmlComment", start: 149, end: 153, value: "<!--" },
            {
              type: "Code",
              codeStart: 158,
              codeEnd: 174,
              start: 156,
              end: 175,
              value: "${this is the code}",
            },
            { type: "EndHtmlComment", start: 178, end: 181, value: "-->" },
          ],
        },
      ],
    },
  },

  {
    description: `should handle non-closed code blocks in tags`,
    input: "before <div> A ${B C </div> after",
    expected: {
      type: "Block",
      start: 0,
      end: 33,
      value: "before <div> A ${B C </div> after",
      children: [
        {
          type: "HtmlTag",
          start: 7,
          end: 27,
          value: "<div> A ${B C </div>",
          children: [
            {
              type: "HtmlOpenTag",
              start: 7,
              end: 12,
              value: "<div>",
              children: [
                {
                  type: "HtmlTagStart",
                  start: 7,
                  end: 11,
                  value: "<div",
                  children: [
                    {
                      type: "HtmlName",
                      name: "div",
                      start: 8,
                      end: 11,
                      value: "div",
                    },
                  ],
                  tagName: "div",
                },
                {
                  type: "HtmlTagEnd",
                  start: 11,
                  end: 12,
                  value: ">",
                  autoclosing: false,
                },
              ],
              tagName: "div",
              autoclosing: false,
            },
            {
              type: "Code",
              codeStart: 17,
              codeEnd: 21,
              start: 15,
              end: 21,
              value: "${B C ",
            },
            {
              type: "HtmlCloseTag",
              start: 21,
              end: 27,
              value: "</div>",
              children: [
                {
                  type: "HtmlName",
                  name: "div",
                  start: 23,
                  end: 26,
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
    description: `should read non-quoted non-closed code blocks in attribute till the end`,
    input: "before <div prop=${B C> content </div> after",
    expected: {
      type: "Block",
      start: 0,
      end: 44,
      value: "before <div prop=${B C> content </div> after",
      children: [
        {
          type: "HtmlTag",
          start: 7,
          end: 44,
          value: "<div prop=${B C> content </div> after",
          children: [
            {
              type: "HtmlOpenTag",
              start: 7,
              end: 44,
              value: "<div prop=${B C> content </div> after",
              children: [
                {
                  type: "HtmlTagStart",
                  start: 7,
                  end: 11,
                  value: "<div",
                  children: [
                    {
                      type: "HtmlName",
                      name: "div",
                      start: 8,
                      end: 11,
                      value: "div",
                    },
                  ],
                  tagName: "div",
                },
                {
                  type: "HtmlAttribute",
                  start: 12,
                  end: 44,
                  value: "prop=${B C> content </div> after",
                  children: [
                    {
                      type: "HtmlName",
                      name: "prop",
                      start: 12,
                      end: 16,
                      value: "prop",
                    },
                    {
                      type: "HtmlValue",
                      quoted: false,
                      start: 17,
                      end: 44,
                      valueStart: 17,
                      valueEnd: 44,
                      value: "${B C> content </div> after",
                      children: [
                        {
                          type: "Code",
                          codeStart: 19,
                          codeEnd: 44,
                          start: 17,
                          end: 44,
                          value: "${B C> content </div> after",
                        },
                      ],
                    },
                  ],
                },
              ],
              tagName: "div",
              autoclosing: false,
            },
          ],
        },
      ],
    },
  },
  {
    description: `should automatically close non-closed code blocks in quoted tag attributes`,
    input: "before <div prop='${B C'> content </div> after",
    expected: {
      type: "Block",
      start: 0,
      end: 46,
      value: "before <div prop='${B C'> content </div> after",
      children: [
        {
          type: "HtmlTag",
          start: 7,
          end: 40,
          value: "<div prop='${B C'> content </div>",
          children: [
            {
              type: "HtmlOpenTag",
              start: 7,
              end: 25,
              value: "<div prop='${B C'>",
              children: [
                {
                  type: "HtmlTagStart",
                  start: 7,
                  end: 11,
                  value: "<div",
                  children: [
                    {
                      type: "HtmlName",
                      name: "div",
                      start: 8,
                      end: 11,
                      value: "div",
                    },
                  ],
                  tagName: "div",
                },
                {
                  type: "HtmlAttribute",
                  start: 12,
                  end: 24,
                  value: "prop='${B C'",
                  children: [
                    {
                      type: "HtmlName",
                      name: "prop",
                      start: 12,
                      end: 16,
                      value: "prop",
                    },
                    {
                      type: "HtmlValue",
                      start: 17,
                      end: 24,
                      value: "'${B C'",
                      children: [
                        {
                          type: "Code",
                          codeStart: 20,
                          codeEnd: 23,
                          start: 18,
                          end: 23,
                          value: "${B C",
                        },
                      ],
                      quoted: true,
                      valueStart: 18,
                      valueEnd: 23,
                    },
                  ],
                },
                {
                  type: "HtmlTagEnd",
                  start: 24,
                  end: 25,
                  value: ">",
                  autoclosing: false,
                },
              ],
              tagName: "div",
              autoclosing: false,
            },
            {
              type: "HtmlCloseTag",
              start: 34,
              end: 40,
              value: "</div>",
              children: [
                {
                  type: "HtmlName",
                  name: "div",
                  start: 36,
                  end: 39,
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
];
