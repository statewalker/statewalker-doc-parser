import { type TTestData } from "../data.types.ts";

export const testData: TTestData[] = [
  {
    description: "should read attributes without values",
    input: "a",
    expected: {
      type: "Block",
      start: 0,
      end: 1,
      value: "a",
      children: [
        {
          type: "HtmlAttribute",
          start: 0,
          end: 1,
          value: "a",
          children: [
            {
              type: "HtmlName",
              name: "a",
              start: 0,
              end: 1,
              value: "a",
            },
          ],
        },
      ],
    },
  },

  {
    description: "should read attributes with undefined values",
    input: "a = ",
    expected: {
      type: "Block",
      start: 0,
      end: 4,
      value: "a = ",
      children: [
        {
          type: "HtmlAttribute",
          start: 0,
          end: 4,
          value: "a = ",
          children: [
            {
              type: "HtmlName",
              name: "a",
              start: 0,
              end: 1,
              value: "a",
            },
          ],
        },
      ],
    },
  },

  {
    description: "should read attributes with undefined values and new lines",
    input: "a = \n\n\n",
    expected: {
      type: "Block",
      start: 0,
      end: 7,
      value: "a = \n\n\n",
      children: [
        {
          type: "HtmlAttribute",
          start: 0,
          end: 7,
          value: "a = \n\n\n",
          children: [
            {
              type: "HtmlName",
              name: "a",
              start: 0,
              end: 1,
              value: "a",
            },
          ],
        },
      ],
    },
  },

  {
    description: "should read attributes with non-quoted values",
    input: "a=A",
    expected: {
      type: "Block",
      start: 0,
      end: 3,
      value: "a=A",
      children: [
        {
          type: "HtmlAttribute",
          start: 0,
          end: 3,
          value: "a=A",
          children: [
            {
              type: "HtmlName",
              name: "a",
              start: 0,
              end: 1,
              value: "a",
            },
            {
              type: "HtmlValue",
              value: "A",
              start: 2,
              end: 3,
              quoted: false,
              valueStart: 2,
              valueEnd: 3,
            },
          ],
        },
      ],
    },
  },

  {
    description: "should read attribute values with special symbols",
    input: "a    =     b:cd:ef$gh",
    expected: {
      type: "Block",
      start: 0,
      end: 21,
      value: "a    =     b:cd:ef$gh",
      children: [
        {
          type: "HtmlAttribute",
          start: 0,
          end: 21,
          value: "a    =     b:cd:ef$gh",
          children: [
            {
              type: "HtmlName",
              name: "a",
              start: 0,
              end: 1,
              value: "a",
            },
            {
              type: "HtmlValue",
              value: "b:cd:ef$gh",
              start: 11,
              end: 21,
              quoted: false,
              valueStart: 11,
              valueEnd: 21,
            },
          ],
        },
      ],
    },
  },

  {
    description:
      "should accept new lines and whitespaces between key/value pairs",
    input: "a = \n  A",
    expected: {
      type: "Block",
      start: 0,
      end: 8,
      value: "a = \n  A",
      children: [
        {
          type: "HtmlAttribute",
          start: 0,
          end: 8,
          value: "a = \n  A",
          children: [
            {
              type: "HtmlName",
              name: "a",
              start: 0,
              end: 1,
              value: "a",
            },
            {
              type: "HtmlValue",
              value: "A",
              start: 7,
              end: 8,
              quoted: false,
              valueStart: 7,
              valueEnd: 8,
            },
          ],
        },
      ],
    },
  },
  {
    input: 'a="b"',
    description: "should read simple quoted attribute",
    expected: {
      type: "Block",
      start: 0,
      end: 5,
      value: 'a="b"',
      children: [
        {
          type: "HtmlAttribute",
          start: 0,
          end: 5,
          value: 'a="b"',
          children: [
            {
              type: "HtmlName",
              name: "a",
              start: 0,
              end: 1,
              value: "a",
            },
            {
              type: "HtmlValue",
              start: 2,
              end: 5,
              value: '"b"',
              quoted: true,
              valueStart: 3,
              valueEnd: 4,
            },
          ],
        },
      ],
    },
  },

  {
    input: ' a=A b="B" c="C1 C2" d ',
    description: "should read attributes in the stream",
    expected: {
      type: "Block",
      start: 0,
      end: 23,
      value: ' a=A b="B" c="C1 C2" d ',
      children: [
        {
          type: "HtmlAttribute",
          start: 1,
          end: 4,
          value: "a=A",
          children: [
            {
              type: "HtmlName",
              name: "a",
              start: 1,
              end: 2,
              value: "a",
            },
            {
              type: "HtmlValue",
              value: "A",
              start: 3,
              end: 4,
              quoted: false,
              valueStart: 3,
              valueEnd: 4,
            },
          ],
        },
        {
          type: "HtmlAttribute",
          start: 5,
          end: 10,
          value: 'b="B"',
          children: [
            {
              type: "HtmlName",
              name: "b",
              start: 5,
              end: 6,
              value: "b",
            },
            {
              type: "HtmlValue",
              start: 7,
              end: 10,
              value: '"B"',
              quoted: true,
              valueStart: 8,
              valueEnd: 9,
            },
          ],
        },
        {
          type: "HtmlAttribute",
          start: 11,
          end: 20,
          value: 'c="C1 C2"',
          children: [
            {
              type: "HtmlName",
              name: "c",
              start: 11,
              end: 12,
              value: "c",
            },
            {
              type: "HtmlValue",
              start: 13,
              end: 20,
              value: '"C1 C2"',
              quoted: true,
              valueStart: 14,
              valueEnd: 19,
            },
          ],
        },
        {
          type: "HtmlAttribute",
          start: 21,
          end: 22,
          value: "d",
          children: [
            {
              type: "HtmlName",
              name: "d",
              start: 21,
              end: 22,
              value: "d",
            },
          ],
        },
      ],
    },
  },

  {
    description: "should isolate quoted values from tokenization",
    // In this example new line symbols before and after the quoted value
    // are tokenized, but not in the attribute value.
    input: ' \n\n\n attr="before \n\n\n after" \n\n\n ',
    expected: {
      type: "Block",
      start: 0,
      end: 33,
      value: ' \n\n\n attr="before \n\n\n after" \n\n\n ',
      children: [
        {
          type: "Eol",
          value: "\n\n\n",
          start: 1,
          end: 4,
        },
        {
          type: "HtmlAttribute",
          start: 5,
          end: 28,
          value: 'attr="before \n\n\n after"',
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
              end: 28,
              value: '"before \n\n\n after"',
              quoted: true,
              valueStart: 11,
              valueEnd: 27,
            },
          ],
        },
        {
          type: "Eol",
          value: "\n\n\n",
          start: 29,
          end: 32,
        },
      ],
    },
  },

  {
    description: "should read attributes key/values separated by new lines",
    input: "x \n\n\n a \n\n\n = \n\n\n b \n\n\n y",
    // It corresponds to this object: { x: undefined, a: "b", y: undefined }
    // and it contains "Eol" tokens between attributes.
    expected: {
      type: "Block",
      start: 0,
      end: 25,
      value: "x \n\n\n a \n\n\n = \n\n\n b \n\n\n y",
      children: [
        {
          type: "HtmlAttribute",
          start: 0,
          end: 1,
          value: "x",
          children: [
            {
              type: "HtmlName",
              name: "x",
              start: 0,
              end: 1,
              value: "x",
            },
          ],
        },
        {
          type: "Eol",
          value: "\n\n\n",
          start: 2,
          end: 5,
        },
        {
          type: "HtmlAttribute",
          start: 6,
          end: 19,
          value: "a \n\n\n = \n\n\n b",
          children: [
            {
              type: "HtmlName",
              name: "a",
              start: 6,
              end: 7,
              value: "a",
            },
            {
              type: "HtmlValue",
              value: "b",
              start: 18,
              end: 19,
              quoted: false,
              valueStart: 18,
              valueEnd: 19,
            },
          ],
        },
        {
          type: "Eol",
          value: "\n\n\n",
          start: 20,
          end: 23,
        },
        {
          type: "HtmlAttribute",
          start: 24,
          end: 25,
          value: "y",
          children: [
            {
              type: "HtmlName",
              name: "y",
              start: 24,
              end: 25,
              value: "y",
            },
          ],
        },
      ],
    },
  },
  {
    description:
      "tokenization should not affect the attribute key/value pair recognition",
    // New lines between the key and value are not interpreted as a separate token.
    // But "\n" symbols before and after the key/value pair are tokenized.
    input: ' \n\n\n attr \n\n\n = \n\n\n "value1 \n\n\n value2" \n\n\n ',
    expected: {
      type: "Block",
      start: 0,
      end: 44,
      value: ' \n\n\n attr \n\n\n = \n\n\n "value1 \n\n\n value2" \n\n\n ',
      children: [
        {
          type: "Eol",
          value: "\n\n\n",
          start: 1,
          end: 4,
        },
        {
          type: "HtmlAttribute",
          start: 5,
          end: 39,
          value: 'attr \n\n\n = \n\n\n "value1 \n\n\n value2"',
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
              start: 20,
              end: 39,
              value: '"value1 \n\n\n value2"',
              quoted: true,
              valueStart: 21,
              valueEnd: 38,
            },
          ],
        },
        {
          type: "Eol",
          value: "\n\n\n",
          start: 40,
          end: 43,
        },
      ],
    },
  },

  {
    description: "should read attribute name and code values",
    input: "x=${y}",
    expected: {
      type: "Block",
      start: 0,
      end: 6,
      value: "x=${y}",
      children: [
        {
          type: "HtmlAttribute",
          start: 0,
          end: 6,
          value: "x=${y}",
          children: [
            {
              type: "HtmlName",
              name: "x",
              start: 0,
              end: 1,
              value: "x",
            },
            {
              type: "HtmlValue",
              quoted: false,
              start: 2,
              end: 6,
              valueStart: 2,
              valueEnd: 6,
              value: "${y}",
              children: [
                {
                  type: "Code",
                  codeStart: 4,
                  codeEnd: 5,
                  start: 2,
                  end: 6,
                  value: "${y}",
                },
              ],
            },
          ],
        },
      ],
    },
  },

  {
    description: "should read attribute values with code",
    input: "a = 'before ${A `${B}` C} after' XX",
    expected: {
      type: "Block",
      start: 0,
      end: 35,
      value: "a = 'before ${A `${B}` C} after' XX",
      children: [
        {
          type: "HtmlAttribute",
          start: 0,
          end: 32,
          value: "a = 'before ${A `${B}` C} after'",
          children: [
            {
              type: "HtmlName",
              name: "a",
              start: 0,
              end: 1,
              value: "a",
            },
            {
              type: "HtmlValue",
              start: 4,
              end: 32,
              value: "'before ${A `${B}` C} after'",
              children: [
                {
                  type: "Code",
                  codeStart: 14,
                  codeEnd: 24,
                  start: 12,
                  end: 25,
                  value: "${A `${B}` C}",
                  children: [
                    {
                      type: "Code",
                      codeStart: 19,
                      codeEnd: 20,
                      start: 17,
                      end: 21,
                      value: "${B}",
                    },
                  ],
                },
              ],
              quoted: true,
              valueStart: 5,
              valueEnd: 31,
            },
          ],
        },
        {
          type: "HtmlAttribute",
          start: 33,
          end: 35,
          value: "XX",
          children: [
            {
              type: "HtmlName",
              name: "XX",
              start: 33,
              end: 35,
              value: "XX",
            },
          ],
        },
      ],
    },
  },

  {
    description: "should read code blocks in the middle of the value string",
    input: 'a    =     \'b:${\n foo="Foo" bar="Bar" hello \n}:c\'',
    expected: {
      type: "Block",
      start: 0,
      end: 49,
      value: 'a    =     \'b:${\n foo="Foo" bar="Bar" hello \n}:c\'',
      children: [
        {
          type: "HtmlAttribute",
          start: 0,
          end: 49,
          value: 'a    =     \'b:${\n foo="Foo" bar="Bar" hello \n}:c\'',
          children: [
            {
              type: "HtmlName",
              name: "a",
              start: 0,
              end: 1,
              value: "a",
            },
            {
              type: "HtmlValue",
              start: 11,
              end: 49,
              value: '\'b:${\n foo="Foo" bar="Bar" hello \n}:c\'',
              children: [
                {
                  type: "Code",
                  codeStart: 16,
                  codeEnd: 45,
                  start: 14,
                  end: 46,
                  value: '${\n foo="Foo" bar="Bar" hello \n}',
                },
              ],
              quoted: true,
              valueStart: 12,
              valueEnd: 48,
            },
          ],
        },
      ],
    },
  },

  {
    description:
      "should read attribute values containing non-quoted code blocks",
    input: "a    =     ${\n foo='Foo' bar=\"Bar\" hello \n}",
    expected: {
      type: "Block",
      start: 0,
      end: 43,
      value: "a    =     ${\n foo='Foo' bar=\"Bar\" hello \n}",
      children: [
        {
          type: "HtmlAttribute",
          start: 0,
          end: 43,
          value: "a    =     ${\n foo='Foo' bar=\"Bar\" hello \n}",
          children: [
            {
              type: "HtmlName",
              name: "a",
              start: 0,
              end: 1,
              value: "a",
            },
            {
              type: "HtmlValue",
              quoted: false,
              start: 11,
              end: 43,
              valueStart: 11,
              valueEnd: 43,
              value: "${\n foo='Foo' bar=\"Bar\" hello \n}",
              children: [
                {
                  type: "Code",
                  codeStart: 13,
                  codeEnd: 42,
                  start: 11,
                  end: 43,
                  value: "${\n foo='Foo' bar=\"Bar\" hello \n}",
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    description: "should read attributes key/value pairs on multiple lines",
    input: `abc:$my-description
       =
        'b:\${
         <MyInternalWidget
           foo=\`\${<Foo bar="Baz">}\`
           bar="Bar" hello>
        }:c
     '`,
    expected: {
      type: "Block",
      start: 0,
      end: 152,
      value:
        'abc:$my-description\n       =\n        \'b:${\n         <MyInternalWidget\n           foo=`${<Foo bar="Baz">}`\n           bar="Bar" hello>\n        }:c\n     \'',
      children: [
        {
          type: "HtmlAttribute",
          start: 0,
          end: 152,
          value:
            'abc:$my-description\n       =\n        \'b:${\n         <MyInternalWidget\n           foo=`${<Foo bar="Baz">}`\n           bar="Bar" hello>\n        }:c\n     \'',
          children: [
            {
              type: "HtmlName",
              name: "abc:$my-description",
              start: 0,
              end: 19,
              value: "abc:$my-description",
            },
            {
              type: "HtmlValue",
              start: 37,
              end: 152,
              value:
                '\'b:${\n         <MyInternalWidget\n           foo=`${<Foo bar="Baz">}`\n           bar="Bar" hello>\n        }:c\n     \'',
              children: [
                {
                  type: "Code",
                  codeStart: 42,
                  codeEnd: 142,
                  start: 40,
                  end: 143,
                  value:
                    '${\n         <MyInternalWidget\n           foo=`${<Foo bar="Baz">}`\n           bar="Bar" hello>\n        }',
                  children: [
                    {
                      type: "Code",
                      codeStart: 88,
                      codeEnd: 103,
                      start: 86,
                      end: 104,
                      value: '${<Foo bar="Baz">}',
                    },
                  ],
                },
              ],
              quoted: true,
              valueStart: 38,
              valueEnd: 151,
            },
          ],
        },
      ],
    },
  },
  {
    description: "should read attribute values containing multiple code blocks",
    input: "a = '${x}${y}${z}'",
    expected: {
      type: "Block",
      start: 0,
      end: 18,
      value: "a = '${x}${y}${z}'",
      children: [
        {
          type: "HtmlAttribute",
          start: 0,
          end: 18,
          value: "a = '${x}${y}${z}'",
          children: [
            {
              type: "HtmlName",
              name: "a",
              start: 0,
              end: 1,
              value: "a",
            },
            {
              type: "HtmlValue",
              start: 4,
              end: 18,
              value: "'${x}${y}${z}'",
              children: [
                {
                  type: "Code",
                  codeStart: 7,
                  codeEnd: 8,
                  start: 5,
                  end: 9,
                  value: "${x}",
                },
                {
                  type: "Code",
                  codeStart: 11,
                  codeEnd: 12,
                  start: 9,
                  end: 13,
                  value: "${y}",
                },
                {
                  type: "Code",
                  codeStart: 15,
                  codeEnd: 16,
                  start: 13,
                  end: 17,
                  value: "${z}",
                },
              ],
              quoted: true,
              valueStart: 5,
              valueEnd: 17,
            },
          ],
        },
      ],
    },
  },
  {
    description: "code block in the middle of the attribute value string",
    input: "a    =     ${\n foo='Foo' bar=\"Bar\" hello \n}:c",
    // It is not intuitive but it is not wrong...
    // To see in the future how this case should be handled.
    expected: {
      type: "Block",
      start: 0,
      end: 45,
      value: "a    =     ${\n foo='Foo' bar=\"Bar\" hello \n}:c",
      children: [
        {
          type: "HtmlAttribute",
          start: 0,
          end: 43,
          value: "a    =     ${\n foo='Foo' bar=\"Bar\" hello \n}",
          children: [
            {
              type: "HtmlName",
              name: "a",
              start: 0,
              end: 1,
              value: "a",
            },
            {
              type: "HtmlValue",
              quoted: false,
              start: 11,
              end: 43,
              valueStart: 11,
              valueEnd: 43,
              value: "${\n foo='Foo' bar=\"Bar\" hello \n}",
              children: [
                {
                  type: "Code",
                  codeStart: 13,
                  codeEnd: 42,
                  start: 11,
                  end: 43,
                  value: "${\n foo='Foo' bar=\"Bar\" hello \n}",
                },
              ],
            },
          ],
        },
        {
          type: "HtmlAttribute",
          start: 44,
          end: 45,
          value: "c",
          children: [
            {
              type: "HtmlName",
              name: "c",
              start: 44,
              end: 45,
              value: "c",
            },
          ],
        },
      ],
    },
  },
];
