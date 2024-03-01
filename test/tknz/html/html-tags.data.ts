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
    input: "before <a attr",
    description: `should read non-closed tags with attributes`,
    expected: {
      type: "Block",
      start: 0,
      end: 14,
      value: "before <a attr",
      children: [
        {
          type: "HtmlOpenTag",
          start: 7,
          end: 14,
          autoclosing: false,
          children: [
            {
              type: "HtmlTagName",
              name: "a",
              start: 8,
              end: 9,
              value: "a",
            },
            {
              type: "HtmlAttribute",
              start: 10,
              end: 14,
              value: "attr",
              children: [
                {
                  type: "HtmlName",
                  name: "attr",
                  start: 10,
                  end: 14,
                  value: "attr",
                },
              ],
            },
          ],
        },
      ],
    },
  },

  {
    input: "before <a attr1=val1 attr2=val2 ",
    description: `should read non-closed tags with multiple attributes`,
    expected: {
      type: "Block",
      start: 0,
      end: 32,
      value: "before <a attr1=val1 attr2=val2 ",
      children: [
        {
          type: "HtmlOpenTag",
          start: 7,
          end: 32,
          autoclosing: false,
          children: [
            {
              type: "HtmlTagName",
              name: "a",
              start: 8,
              end: 9,
              value: "a",
            },
            {
              type: "HtmlAttribute",
              start: 10,
              end: 20,
              value: "attr1=val1",
              children: [
                {
                  type: "HtmlName",
                  name: "attr1",
                  start: 10,
                  end: 15,
                  value: "attr1",
                },
                {
                  type: "HtmlValue",
                  value: "val1",
                  start: 16,
                  end: 20,
                  quoted: false,
                  valueStart: 16,
                  valueEnd: 20,
                },
              ],
            },
            {
              type: "HtmlAttribute",
              start: 21,
              end: 31,
              value: "attr2=val2",
              children: [
                {
                  type: "HtmlName",
                  name: "attr2",
                  start: 21,
                  end: 26,
                  value: "attr2",
                },
                {
                  type: "HtmlValue",
                  value: "val2",
                  start: 27,
                  end: 31,
                  quoted: false,
                  valueStart: 27,
                  valueEnd: 31,
                },
              ],
            },
          ],
        },
      ],
    },
  },

  {
    input: "before <a attr1=val1 attr2='a b c' attr3='\" quoted \"' > after",
    description: `should read tags with multiple attributes internal quotes`,
    expected: {
      type: "Block",
      start: 0,
      end: 61,
      value: "before <a attr1=val1 attr2='a b c' attr3='\" quoted \"' > after",
      children: [
        {
          type: "HtmlOpenTag",
          start: 7,
          end: 55,
          autoclosing: false,
          children: [
            {
              type: "HtmlTagName",
              name: "a",
              start: 8,
              end: 9,
              value: "a",
            },
            {
              type: "HtmlAttribute",
              start: 10,
              end: 20,
              value: "attr1=val1",
              children: [
                {
                  type: "HtmlName",
                  name: "attr1",
                  start: 10,
                  end: 15,
                  value: "attr1",
                },
                {
                  type: "HtmlValue",
                  value: "val1",
                  start: 16,
                  end: 20,
                  quoted: false,
                  valueStart: 16,
                  valueEnd: 20,
                },
              ],
            },
            {
              type: "HtmlAttribute",
              start: 21,
              end: 34,
              value: "attr2='a b c'",
              children: [
                {
                  type: "HtmlName",
                  name: "attr2",
                  start: 21,
                  end: 26,
                  value: "attr2",
                },
                {
                  type: "HtmlValue",
                  start: 27,
                  end: 34,
                  value: "'a b c'",
                  quoted: true,
                  valueStart: 28,
                  valueEnd: 33,
                },
              ],
            },
            {
              type: "HtmlAttribute",
              start: 35,
              end: 53,
              value: "attr3='\" quoted \"'",
              children: [
                {
                  type: "HtmlName",
                  name: "attr3",
                  start: 35,
                  end: 40,
                  value: "attr3",
                },
                {
                  type: "HtmlValue",
                  start: 41,
                  end: 53,
                  value: "'\" quoted \"'",
                  quoted: true,
                  valueStart: 42,
                  valueEnd: 52,
                },
              ],
            },
          ],
        },
      ],
    },
  },

  {
    input:
      "before <a attr='a <b c=`x` d=\"y\"></b>' attr3='\" quoted \"' > after",
    description: `should read tags with multiple attributes containing angle brackets`,
    expected: {
      type: "Block",
      start: 0,
      end: 65,
      value:
        "before <a attr='a <b c=`x` d=\"y\"></b>' attr3='\" quoted \"' > after",
      children: [
        {
          type: "HtmlOpenTag",
          start: 7,
          end: 59,
          autoclosing: false,
          children: [
            {
              type: "HtmlTagName",
              name: "a",
              start: 8,
              end: 9,
              value: "a",
            },
            {
              type: "HtmlAttribute",
              start: 10,
              end: 38,
              value: "attr='a <b c=`x` d=\"y\"></b>'",
              children: [
                {
                  type: "HtmlName",
                  name: "attr",
                  start: 10,
                  end: 14,
                  value: "attr",
                },
                {
                  type: "HtmlValue",
                  start: 15,
                  end: 38,
                  value: "'a <b c=`x` d=\"y\"></b>'",
                  quoted: true,
                  valueStart: 16,
                  valueEnd: 37,
                },
              ],
            },
            {
              type: "HtmlAttribute",
              start: 39,
              end: 57,
              value: "attr3='\" quoted \"'",
              children: [
                {
                  type: "HtmlName",
                  name: "attr3",
                  start: 39,
                  end: 44,
                  value: "attr3",
                },
                {
                  type: "HtmlValue",
                  start: 45,
                  end: 57,
                  value: "'\" quoted \"'",
                  quoted: true,
                  valueStart: 46,
                  valueEnd: 56,
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
          autoclosing: true,
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
          autoclosing: true,
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
          autoclosing: true,
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
