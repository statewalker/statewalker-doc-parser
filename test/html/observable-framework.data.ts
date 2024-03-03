import { type TTestData } from "../data.types.ts";

export const testData: TTestData[] = [
  {
    input: "before <div a:b:c='FOO ${foo_bar} BAR'>Hello</div> after",
    description: `should read simple opening/closing tag pair tags`,
    expected: {
      type: "Block",
      start: 0,
      end: 56,
      value: "before <div a:b:c='FOO ${foo_bar} BAR'>Hello</div> after",
      children: [
        {
          type: "HtmlTag",
          start: 7,
          end: 50,
          value: "<div a:b:c='FOO ${foo_bar} BAR'>Hello</div>",
          children: [
            {
              type: "HtmlOpenTag",
              start: 7,
              end: 39,
              value: "<div a:b:c='FOO ${foo_bar} BAR'>",
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
                  end: 38,
                  value: "a:b:c='FOO ${foo_bar} BAR'",
                  children: [
                    {
                      type: "HtmlName",
                      name: "a:b:c",
                      start: 12,
                      end: 17,
                      value: "a:b:c",
                    },
                    {
                      type: "HtmlValue",
                      start: 18,
                      end: 38,
                      value: "'FOO ${foo_bar} BAR'",
                      children: [
                        {
                          type: "Code",
                          codeStart: 25,
                          codeEnd: 32,
                          start: 23,
                          end: 33,
                          value: "${foo_bar}",
                        },
                      ],
                      quoted: true,
                      valueStart: 19,
                      valueEnd: 37,
                    },
                  ],
                },
                {
                  type: "HtmlTagEnd",
                  start: 38,
                  end: 39,
                  value: ">",
                  autoclosing: false,
                },
              ],
              tagName: "div",
              autoclosing: false,
            },
            {
              type: "HtmlCloseTag",
              start: 44,
              end: 50,
              value: "</div>",
              children: [
                {
                  type: "HtmlName",
                  name: "div",
                  start: 46,
                  end: 49,
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
    input: `
  <div style="display: grid; grid-auto-rows: 1fr; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-gap: 1rem;">
    \${Promise.all(muybridge.filenames.map((f) => muybridge.file(f).image({style: "width: 100%;"})))}
  </div>
    `,
    description: "should parse style attribute with code",
    // See https://github.com/observablehq/framework/issues/396
    expected: {
      type: "Block",
      start: 0,
      end: 233,
      value:
        '\n  <div style="display: grid; grid-auto-rows: 1fr; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-gap: 1rem;">\n    ${Promise.all(muybridge.filenames.map((f) => muybridge.file(f).image({style: "width: 100%;"})))}\n  </div>\n    ',
      children: [
        {
          type: "HtmlTag",
          start: 3,
          end: 228,
          value:
            '<div style="display: grid; grid-auto-rows: 1fr; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-gap: 1rem;">\n    ${Promise.all(muybridge.filenames.map((f) => muybridge.file(f).image({style: "width: 100%;"})))}\n  </div>',
          children: [
            {
              type: "HtmlOpenTag",
              start: 3,
              end: 118,
              value:
                '<div style="display: grid; grid-auto-rows: 1fr; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-gap: 1rem;">',
              children: [
                {
                  type: "HtmlTagStart",
                  start: 3,
                  end: 7,
                  value: "<div",
                  children: [
                    {
                      type: "HtmlName",
                      name: "div",
                      start: 4,
                      end: 7,
                      value: "div",
                    },
                  ],
                  tagName: "div",
                },
                {
                  type: "HtmlAttribute",
                  start: 8,
                  end: 117,
                  value:
                    'style="display: grid; grid-auto-rows: 1fr; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-gap: 1rem;"',
                  children: [
                    {
                      type: "HtmlName",
                      name: "style",
                      start: 8,
                      end: 13,
                      value: "style",
                    },
                    {
                      type: "HtmlValue",
                      start: 14,
                      end: 117,
                      value:
                        '"display: grid; grid-auto-rows: 1fr; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-gap: 1rem;"',
                      quoted: true,
                      valueStart: 15,
                      valueEnd: 116,
                    },
                  ],
                },
                {
                  type: "HtmlTagEnd",
                  start: 117,
                  end: 118,
                  value: ">",
                  autoclosing: false,
                },
              ],
              tagName: "div",
              autoclosing: false,
            },
            {
              type: "Code",
              codeStart: 125,
              codeEnd: 218,
              start: 123,
              end: 219,
              value:
                '${Promise.all(muybridge.filenames.map((f) => muybridge.file(f).image({style: "width: 100%;"})))}',
            },
            {
              type: "HtmlCloseTag",
              start: 222,
              end: 228,
              value: "</div>",
              children: [
                {
                  type: "HtmlName",
                  name: "div",
                  start: 224,
                  end: 227,
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
