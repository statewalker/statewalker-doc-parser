import { TTestData } from "../data.types.ts";

export const testData: TTestData[] = [
  {
    input: "<a",
    description: `should read simple tags`,
    expected: {
      type: "Block",
      start: 0,
      end: 2,
      value: "<a",
      children: [
        {
          type: "HtmlOpenTag",
          start: 0,
          end: 2,
          autoclosing: false,
          children: [
            {
              type: "HtmlTagName",
              name: "a",
              start: 1,
              end: 2,
              value: "a",
            },
          ],
        },
      ],
    },
  },

  {
    input: "<a b='c'>",
    description: `should read simple tags with attributes`,
    expected: {
      type: "Block",
      start: 0,
      end: 9,
      value: "<a b='c'>",
      children: [
        {
          type: "HtmlOpenTag",
          start: 0,
          end: 9,
          autoclosing: false,
          children: [
            {
              type: "HtmlTagName",
              name: "a",
              start: 1,
              end: 2,
              value: "a",
            },
            {
              type: "HtmlAttribute",
              start: 3,
              end: 8,
              value: "b='c'",
              children: [
                {
                  type: "HtmlName",
                  name: "b",
                  start: 3,
                  end: 4,
                  value: "b",
                },
                {
                  type: "HtmlValue",
                  start: 5,
                  end: 8,
                  value: "'c'",
                  quoted: true,
                  valueStart: 6,
                  valueEnd: 7,
                },
              ],
            },
          ],
        },
      ],
    },
  },

  {
    input: "<tag ${ code block } x=${y} n='a${c}b' />",
    description: `should read tags with code blocks`,
    expected: {
      type: "Block",
      start: 0,
      end: 41,
      value: "<tag ${ code block } x=${y} n='a${c}b' />",
      children: [
        {
          type: "HtmlOpenTag",
          start: 0,
          end: 41,
          autoclosing: false,
          children: [
            {
              type: "HtmlTagName",
              name: "tag",
              start: 1,
              end: 4,
              value: "tag",
            },
            {
              type: "Code",
              codeStart: 7,
              codeEnd: 19,
              start: 5,
              end: 20,
              value: "${ code block }",
            },
            {
              type: "HtmlAttribute",
              start: 21,
              end: 27,
              value: "x=${y}",
              children: [
                {
                  type: "HtmlName",
                  name: "x",
                  start: 21,
                  end: 22,
                  value: "x",
                },
                {
                  type: "HtmlValue",
                  codeStart: 25,
                  codeEnd: 26,
                  start: 23,
                  end: 27,
                  value: "${y}",
                  quoted: false,
                  valueStart: 23,
                  valueEnd: 27,
                },
              ],
            },
            {
              type: "HtmlAttribute",
              start: 28,
              end: 38,
              value: "n='a${c}b'",
              children: [
                {
                  type: "HtmlName",
                  name: "n",
                  start: 28,
                  end: 29,
                  value: "n",
                },
                {
                  type: "HtmlValue",
                  start: 30,
                  end: 38,
                  value: "'a${c}b'",
                  children: [
                    {
                      type: "Code",
                      codeStart: 34,
                      codeEnd: 35,
                      start: 32,
                      end: 36,
                      value: "${c}",
                    },
                  ],
                  quoted: true,
                  valueStart: 31,
                  valueEnd: 37,
                },
              ],
            },
          ],
        },
      ],
    },
  },

  {
    description: `should read tags with broken code blocks in the opening tag`,
    input: "<tag ${ code block  />",
    expected: {
      type: "Block",
      start: 0,
      end: 22,
      value: "<tag ${ code block  />",
      children: [
        {
          type: "HtmlOpenTag",
          start: 0,
          end: 22,
          autoclosing: false,
          children: [
            {
              type: "HtmlTagName",
              name: "tag",
              start: 1,
              end: 4,
              value: "tag",
            },
            {
              type: "Code",
              codeStart: 7,
              codeEnd: 20,
              start: 5,
              end: 20,
              value: "${ code block  ",
            },
          ],
        },
      ],
    },
  },

  {
    description: `should tolerate broken block code in tag attributes`,
    input: "<tag attr='x${ code block' attr2=val2 />",
    expected: {
      type: "Block",
      start: 0,
      end: 40,
      value: "<tag attr='x${ code block' attr2=val2 />",
      children: [
        {
          type: "HtmlOpenTag",
          start: 0,
          end: 40,
          autoclosing: false,
          children: [
            {
              type: "HtmlTagName",
              name: "tag",
              start: 1,
              end: 4,
              value: "tag",
            },
            {
              type: "HtmlAttribute",
              start: 5,
              end: 26,
              value: "attr='x${ code block'",
              children: [
                {
                  type: "HtmlName",
                  name: "attr",
                  start: 5,
                  end: 9,
                  value: "attr",
                },
                {
                  type: "HtmlValue",
                  start: 10,
                  end: 26,
                  value: "'x${ code block'",
                  children: [
                    {
                      type: "Code",
                      codeStart: 14,
                      codeEnd: 25,
                      start: 12,
                      end: 25,
                      value: "${ code block",
                    },
                  ],
                  quoted: true,
                  valueStart: 11,
                  valueEnd: 25,
                },
              ],
            },
            {
              type: "HtmlAttribute",
              start: 27,
              end: 37,
              value: "attr2=val2",
              children: [
                {
                  type: "HtmlName",
                  name: "attr2",
                  start: 27,
                  end: 32,
                  value: "attr2",
                },
                {
                  type: "HtmlValue",
                  value: "val2",
                  start: 33,
                  end: 37,
                  quoted: false,
                  valueStart: 33,
                  valueEnd: 37,
                },
              ],
            },
          ],
        },
      ],
    },
  },
];
