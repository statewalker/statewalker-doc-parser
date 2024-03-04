import { type TTestData } from "../data.types.ts";

export const testData: TTestData[] = [
  {
    input: "<a",
    description: "should read simple opening tags",
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
  },

  {
    input: "\n\n  <a \n\n b='B' \n\n c='C'\n\n> \n\n",
    description:
      "should isolate inner token content from external fences (EOLs)",
    expected: {
      type: "Block",
      start: 0,
      end: 30,
      value: "\n\n  <a \n\n b='B' \n\n c='C'\n\n> \n\n",
      children: [
        { type: "Eol", value: "\n\n", start: 0, end: 2 },
        {
          type: "HtmlOpenTag",
          start: 4,
          end: 27,
          value: "<a \n\n b='B' \n\n c='C'\n\n>",
          children: [
            {
              type: "HtmlTagStart",
              start: 4,
              end: 6,
              value: "<a",
              children: [
                { type: "HtmlName", name: "a", start: 5, end: 6, value: "a" },
              ],
              tagName: "a",
            },
            {
              type: "HtmlAttribute",
              start: 10,
              end: 15,
              value: "b='B'",
              children: [
                { type: "HtmlName", name: "b", start: 10, end: 11, value: "b" },
                {
                  type: "HtmlValue",
                  start: 12,
                  end: 15,
                  value: "'B'",
                  quoted: true,
                  valueStart: 13,
                  valueEnd: 14,
                },
              ],
            },
            {
              type: "HtmlAttribute",
              start: 19,
              end: 24,
              value: "c='C'",
              children: [
                { type: "HtmlName", name: "c", start: 19, end: 20, value: "c" },
                {
                  type: "HtmlValue",
                  start: 21,
                  end: 24,
                  value: "'C'",
                  quoted: true,
                  valueStart: 22,
                  valueEnd: 23,
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
          tagName: "a",
          autoclosing: false,
        },
        { type: "Eol", value: "\n\n", start: 28, end: 30 },
      ],
    },
  },

  {
    input: "<a b='c'>",
    description: "should read simple tags with attributes",
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
          value: "<a b='c'>",
          children: [
            {
              type: "HtmlTagStart",
              start: 0,
              end: 2,
              value: "<a",
              children: [
                { type: "HtmlName", name: "a", start: 1, end: 2, value: "a" },
              ],
              tagName: "a",
            },
            {
              type: "HtmlAttribute",
              start: 3,
              end: 8,
              value: "b='c'",
              children: [
                { type: "HtmlName", name: "b", start: 3, end: 4, value: "b" },
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
            {
              type: "HtmlTagEnd",
              start: 8,
              end: 9,
              value: ">",
              autoclosing: false,
            },
          ],
          tagName: "a",
          autoclosing: false,
        },
      ],
    },
  },

  {
    input: "before <a attr",
    description: "should read non-closed tags with attributes",
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
          value: "<a attr",
          children: [
            {
              type: "HtmlTagStart",
              start: 7,
              end: 9,
              value: "<a",
              children: [
                {
                  type: "HtmlName",
                  name: "a",
                  start: 8,
                  end: 9,
                  value: "a",
                },
              ],
              tagName: "a",
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
          tagName: "a",
          autoclosing: false,
        },
      ],
    },
  },

  {
    input: "before <a attr1=val1 attr2=val2 ",
    description: "should read non-closed tags with multiple attributes",
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
          value: "<a attr1=val1 attr2=val2 ",
          children: [
            {
              type: "HtmlTagStart",
              start: 7,
              end: 9,
              value: "<a",
              children: [
                { type: "HtmlName", name: "a", start: 8, end: 9, value: "a" },
              ],
              tagName: "a",
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
          tagName: "a",
          autoclosing: false,
        },
      ],
    },
  },

  {
    input: "before <a attr1=val1 attr2='a b c' attr3='\" quoted \"' > after",
    description: "should read tags with multiple attributes internal quotes",
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
          value: "<a attr1=val1 attr2='a b c' attr3='\" quoted \"' >",
          children: [
            {
              type: "HtmlTagStart",
              start: 7,
              end: 9,
              value: "<a",
              children: [
                { type: "HtmlName", name: "a", start: 8, end: 9, value: "a" },
              ],
              tagName: "a",
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
            {
              type: "HtmlTagEnd",
              start: 54,
              end: 55,
              value: ">",
              autoclosing: false,
            },
          ],
          tagName: "a",
          autoclosing: false,
        },
      ],
    },
  },

  {
    input:
      "before <a attr='a <b c=`x` d=\"y\"></b>' attr3='\" quoted \"' > after",
    description:
      "should read tags with multiple attributes containing angle brackets",
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
          value: "<a attr='a <b c=`x` d=\"y\"></b>' attr3='\" quoted \"' >",
          children: [
            {
              type: "HtmlTagStart",
              start: 7,
              end: 9,
              value: "<a",
              children: [
                { type: "HtmlName", name: "a", start: 8, end: 9, value: "a" },
              ],
              tagName: "a",
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
            {
              type: "HtmlTagEnd",
              start: 58,
              end: 59,
              value: ">",
              autoclosing: false,
            },
          ],
          tagName: "a",
          autoclosing: false,
        },
      ],
    },
  },

  {
    input:
      "before <a attr='a <b c=`x` d=\"${code block}\"></b>' attr3='\" quoted \"' > after",
    description:
      "should read tags containing attributes with angle brackets and code",
    expected: {
      type: "Block",
      start: 0,
      end: 77,
      value:
        "before <a attr='a <b c=`x` d=\"${code block}\"></b>' attr3='\" quoted \"' > after",
      children: [
        {
          type: "HtmlOpenTag",
          start: 7,
          end: 71,
          value:
            "<a attr='a <b c=`x` d=\"${code block}\"></b>' attr3='\" quoted \"' >",
          children: [
            {
              type: "HtmlTagStart",
              start: 7,
              end: 9,
              value: "<a",
              children: [
                { type: "HtmlName", name: "a", start: 8, end: 9, value: "a" },
              ],
              tagName: "a",
            },
            {
              type: "HtmlAttribute",
              start: 10,
              end: 50,
              value: "attr='a <b c=`x` d=\"${code block}\"></b>'",
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
                  end: 50,
                  value: "'a <b c=`x` d=\"${code block}\"></b>'",
                  children: [
                    {
                      type: "Code",
                      codeStart: 32,
                      codeEnd: 42,
                      start: 30,
                      end: 43,
                      value: "${code block}",
                    },
                  ],
                  quoted: true,
                  valueStart: 16,
                  valueEnd: 49,
                },
              ],
            },
            {
              type: "HtmlAttribute",
              start: 51,
              end: 69,
              value: "attr3='\" quoted \"'",
              children: [
                {
                  type: "HtmlName",
                  name: "attr3",
                  start: 51,
                  end: 56,
                  value: "attr3",
                },
                {
                  type: "HtmlValue",
                  start: 57,
                  end: 69,
                  value: "'\" quoted \"'",
                  quoted: true,
                  valueStart: 58,
                  valueEnd: 68,
                },
              ],
            },
            {
              type: "HtmlTagEnd",
              start: 70,
              end: 71,
              value: ">",
              autoclosing: false,
            },
          ],
          tagName: "a",
          autoclosing: false,
        },
      ],
    },
  },

  {
    input:
      "before <a attr='a <b c=`x` d=\"${code block\"></b>' attr3='\" quoted \"' > after",
    description:
      "should read tags containing attributes with angle brackets and non-closed code blocks",
    expected: {
      type: "Block",
      start: 0,
      end: 76,
      value:
        "before <a attr='a <b c=`x` d=\"${code block\"></b>' attr3='\" quoted \"' > after",
      children: [
        {
          type: "HtmlOpenTag",
          start: 7,
          end: 70,
          value:
            "<a attr='a <b c=`x` d=\"${code block\"></b>' attr3='\" quoted \"' >",
          children: [
            {
              type: "HtmlTagStart",
              start: 7,
              end: 9,
              value: "<a",
              children: [
                { type: "HtmlName", name: "a", start: 8, end: 9, value: "a" },
              ],
              tagName: "a",
            },
            {
              type: "HtmlAttribute",
              start: 10,
              end: 49,
              value: "attr='a <b c=`x` d=\"${code block\"></b>'",
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
                  end: 49,
                  value: "'a <b c=`x` d=\"${code block\"></b>'",
                  children: [
                    {
                      type: "Code",
                      codeStart: 32,
                      codeEnd: 43,
                      start: 30,
                      end: 43,
                      value: '${code block"',
                    },
                  ],
                  quoted: true,
                  valueStart: 16,
                  valueEnd: 48,
                },
              ],
            },
            {
              type: "HtmlAttribute",
              start: 50,
              end: 68,
              value: "attr3='\" quoted \"'",
              children: [
                {
                  type: "HtmlName",
                  name: "attr3",
                  start: 50,
                  end: 55,
                  value: "attr3",
                },
                {
                  type: "HtmlValue",
                  start: 56,
                  end: 68,
                  value: "'\" quoted \"'",
                  quoted: true,
                  valueStart: 57,
                  valueEnd: 67,
                },
              ],
            },
            {
              type: "HtmlTagEnd",
              start: 69,
              end: 70,
              value: ">",
              autoclosing: false,
            },
          ],
          tagName: "a",
          autoclosing: false,
        },
      ],
    },
  },

  {
    input: "<tag ${ code block } x=${y} n='a${c}b' />",
    description: "should read tags with code blocks",
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
          value: "<tag ${ code block } x=${y} n='a${c}b' />",
          children: [
            {
              type: "HtmlTagStart",
              start: 0,
              end: 4,
              value: "<tag",
              children: [
                {
                  type: "HtmlName",
                  name: "tag",
                  start: 1,
                  end: 4,
                  value: "tag",
                },
              ],
              tagName: "tag",
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
                { type: "HtmlName", name: "x", start: 21, end: 22, value: "x" },
                {
                  type: "HtmlValue",
                  quoted: false,
                  start: 23,
                  end: 27,
                  valueStart: 23,
                  valueEnd: 27,
                  value: "${y}",
                  children: [
                    {
                      type: "Code",
                      codeStart: 25,
                      codeEnd: 26,
                      start: 23,
                      end: 27,
                      value: "${y}",
                    },
                  ],
                },
              ],
            },
            {
              type: "HtmlAttribute",
              start: 28,
              end: 38,
              value: "n='a${c}b'",
              children: [
                { type: "HtmlName", name: "n", start: 28, end: 29, value: "n" },
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
            {
              type: "HtmlTagEnd",
              start: 39,
              end: 41,
              value: "/>",
              autoclosing: true,
            },
          ],
          tagName: "tag",
          autoclosing: true,
        },
      ],
    },
  },

  {
    description: "should read tags with broken code blocks in the opening tag",
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
          value: "<tag ${ code block  />",
          children: [
            {
              type: "HtmlTagStart",
              start: 0,
              end: 4,
              value: "<tag",
              children: [
                {
                  type: "HtmlName",
                  name: "tag",
                  start: 1,
                  end: 4,
                  value: "tag",
                },
              ],
              tagName: "tag",
            },
            {
              type: "Code",
              codeStart: 7,
              codeEnd: 20,
              start: 5,
              end: 20,
              value: "${ code block  ",
            },
            {
              type: "HtmlTagEnd",
              start: 20,
              end: 22,
              value: "/>",
              autoclosing: true,
            },
          ],
          tagName: "tag",
          autoclosing: true,
        },
      ],
    },
  },

  {
    description: "should tolerate broken block code in tag attributes",
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
          value: "<tag attr='x${ code block' attr2=val2 />",
          children: [
            {
              type: "HtmlTagStart",
              start: 0,
              end: 4,
              value: "<tag",
              children: [
                {
                  type: "HtmlName",
                  name: "tag",
                  start: 1,
                  end: 4,
                  value: "tag",
                },
              ],
              tagName: "tag",
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
            {
              type: "HtmlTagEnd",
              start: 38,
              end: 40,
              value: "/>",
              autoclosing: true,
            },
          ],
          tagName: "tag",
          autoclosing: true,
        },
      ],
    },
  },

  // ------------------------------------------------------------

  {
    input: "</a>",
    description: "should read simple closing tag",
    expected: {
      type: "Block",
      start: 0,
      end: 4,
      value: "</a>",
      children: [
        {
          type: "HtmlCloseTag",
          start: 0,
          end: 4,
          value: "</a>",
          children: [
            {
              type: "HtmlName",
              name: "a",
              start: 2,
              end: 3,
              value: "a",
            },
          ],
          tagName: "a",
        },
      ],
    },
  },

  {
    input: "</a    \n\n  \n\n  \n>",
    description: "should read closing tags with spaces and EOLs",
    expected: {
      type: "Block",
      start: 0,
      end: 17,
      value: "</a    \n\n  \n\n  \n>",
      children: [
        {
          type: "HtmlCloseTag",
          start: 0,
          end: 17,
          value: "</a    \n\n  \n\n  \n>",
          children: [
            {
              type: "HtmlName",
              name: "a",
              start: 2,
              end: 3,
              value: "a",
            },
          ],
          tagName: "a",
        },
      ],
    },
  },

  // ------------------------------------------------------------

  {
    input: "before <a href=http://www.google.com>Google</a> after",
    description: "should read opening and closing tags",
    expected: {
      type: "Block",
      start: 0,
      end: 53,
      value: "before <a href=http://www.google.com>Google</a> after",
      children: [
        {
          type: "HtmlOpenTag",
          start: 7,
          end: 37,
          value: "<a href=http://www.google.com>",
          children: [
            {
              type: "HtmlTagStart",
              start: 7,
              end: 9,
              value: "<a",
              children: [
                { type: "HtmlName", name: "a", start: 8, end: 9, value: "a" },
              ],
              tagName: "a",
            },
            {
              type: "HtmlAttribute",
              start: 10,
              end: 36,
              value: "href=http://www.google.com",
              children: [
                {
                  type: "HtmlName",
                  name: "href",
                  start: 10,
                  end: 14,
                  value: "href",
                },
                {
                  type: "HtmlValue",
                  value: "http://www.google.com",
                  start: 15,
                  end: 36,
                  quoted: false,
                  valueStart: 15,
                  valueEnd: 36,
                },
              ],
            },
            {
              type: "HtmlTagEnd",
              start: 36,
              end: 37,
              value: ">",
              autoclosing: false,
            },
          ],
          tagName: "a",
          autoclosing: false,
        },
        {
          type: "HtmlCloseTag",
          start: 43,
          end: 47,
          value: "</a>",
          children: [
            { type: "HtmlName", name: "a", start: 45, end: 46, value: "a" },
          ],
          tagName: "a",
        },
      ],
    },
  },

  {
    input:
      "<div>before <em><a href=http://www.google.com>Google</a> after</em></div>",
    description: "should read opening and closing tags",
    expected: {
      type: "Block",
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
                { type: "HtmlName", name: "a", start: 17, end: 18, value: "a" },
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
            { type: "HtmlName", name: "a", start: 54, end: 55, value: "a" },
          ],
          tagName: "a",
        },
        {
          type: "HtmlCloseTag",
          start: 62,
          end: 67,
          value: "</em>",
          children: [
            { type: "HtmlName", name: "em", start: 64, end: 66, value: "em" },
          ],
          tagName: "em",
        },
        {
          type: "HtmlCloseTag",
          start: 67,
          end: 73,
          value: "</div>",
          children: [
            { type: "HtmlName", name: "div", start: 69, end: 72, value: "div" },
          ],
          tagName: "div",
        },
      ],
    },
  },
];
