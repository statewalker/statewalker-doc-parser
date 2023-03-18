import { default as expect } from "expect.js";
import readMdBlocksSeparators from "../../src/tokenizer-md/readMdBlocksSeparators.js";

describe("readMdBlocksSeparators", () => {
  function test(str, control) {
    const result = testPartial(str, control);
    result && expect(result.end).to.eql(str.length);
  }
  function testPartial(str, control) {
    const result = readMdBlocksSeparators(str);
    try {
      expect(result).to.eql(control);
      return result;
    } catch (error) {
      console.log(JSON.stringify(result, null, 2));
      throw error;
    }
  }
  it(`should skip non complete separators`, async () => {
    test("", undefined);
    test("**", undefined);
    test("** ", undefined);
    test("*** x", undefined);
  });

  it(`should read markdown blocks`, async () => {
    test("*** ", {
      "type": "MdBlockSeparator",
      "separator": "***",
      "separatorChar": "*",
      "separatorStart": 0,
      "separatorEnd": 3,
      "start": 0,
      "end": 4,
    });
    test("***         ", {
      "type": "MdBlockSeparator",
      "separator": "***",
      "separatorChar": "*",
      "separatorStart": 0,
      "separatorEnd": 3,
      "start": 0,
      "end": 12,
    });
    test("***         \n", {
      "type": "MdBlockSeparator",
      "separator": "***",
      "separatorChar": "*",
      "separatorStart": 0,
      "separatorEnd": 3,
      "start": 0,
      "end": 13,
    });
    test("***", {
      "type": "MdBlockSeparator",
      "separator": "***",
      "separatorChar": "*",
      "separatorStart": 0,
      "separatorEnd": 3,
      "start": 0,
      "end": 3,
    });
    test("*******", {
      "type": "MdBlockSeparator",
      "separator": "*******",
      "separatorChar": "*",
      "separatorStart": 0,
      "separatorEnd": 7,
      "start": 0,
      "end": 7,
    });
  });

  it(`should read markdown blocks with associated properties`, async () => {
    testPartial(
      `***  
      a : This is the 
      first property
      on multiple lines
      b: This is the second 
      multi-line
      property

      Next block
    `,
      {
        "type": "MdBlockSeparator",
        "separator": "***",
        "separatorChar": "*",
        "separatorStart": 0,
        "separatorEnd": 3,
        "start": 0,
        "end": 136,
        "properties": {
          "type": "MdBlockProperties",
          "properties": [
            {
              "type": "MdBlockProperty",
              "name": "a",
              "nameStart": 12,
              "nameEnd": 13,
              "start": 6,
              "end": 74,
              "value": [
                "This",
                " ",
                "is",
                " ",
                "the",
                " \n      ",
                "first",
                " ",
                "property",
                "\n      ",
                "on",
                " ",
                "multiple",
                " ",
                "lines",
                "\n",
              ],
              "valueStart": 16,
              "valueEnd": 74,
            },
            {
              "type": "MdBlockProperty",
              "name": "b",
              "nameStart": 80,
              "nameEnd": 81,
              "start": 74,
              "end": 136,
              "value": [
                "This",
                " ",
                "is",
                " ",
                "the",
                " ",
                "second",
                " \n      ",
                "multi-line",
                "\n      ",
                "property",
                "\n\n",
              ],
              "valueStart": 83,
              "valueEnd": 136,
            },
          ],
          "start": 6,
          "end": 136,
        },
      },
    );

    testPartial(
      `***  
      a : b

    Line`,
      {
        "type": "MdBlockSeparator",
        "separator": "***",
        "separatorChar": "*",
        "separatorStart": 0,
        "separatorEnd": 3,
        "start": 0,
        "end": 19,
        "properties": {
          "type": "MdBlockProperties",
          "properties": [
            {
              "type": "MdBlockProperty",
              "name": "a",
              "nameStart": 12,
              "nameEnd": 13,
              "start": 6,
              "end": 19,
              "value": [
                "b",
                "\n\n",
              ],
              "valueStart": 16,
              "valueEnd": 19,
            },
          ],
          "start": 6,
          "end": 19,
        },
      },
    );
    test("***  \nhello : World!", {
      "type": "MdBlockSeparator",
      "separator": "***",
      "separatorChar": "*",
      "separatorStart": 0,
      "separatorEnd": 3,
      "start": 0,
      "end": 20,
      "properties": {
        "type": "MdBlockProperties",
        "properties": [
          {
            "type": "MdBlockProperty",
            "name": "hello",
            "nameStart": 6,
            "nameEnd": 11,
            "start": 6,
            "end": 20,
            "value": [
              "World!",
            ],
            "valueStart": 14,
            "valueEnd": 20,
          },
        ],
        "start": 6,
        "end": 20,
      },
    });
    test("***  \nhello : \n world : ", {
      "type": "MdBlockSeparator",
      "separator": "***",
      "separatorChar": "*",
      "separatorStart": 0,
      "separatorEnd": 3,
      "start": 0,
      "end": 24,
      "properties": {
        "type": "MdBlockProperties",
        "properties": [
          {
            "type": "MdBlockProperty",
            "name": "hello",
            "nameStart": 6,
            "nameEnd": 11,
            "start": 6,
            "end": 15,
            "value": [
              "\n",
            ],
            "valueStart": 14,
            "valueEnd": 15,
          },
          {
            "type": "MdBlockProperty",
            "name": "world",
            "nameStart": 16,
            "nameEnd": 21,
            "start": 15,
            "end": 24,
            "value": [],
            "valueStart": 24,
            "valueEnd": 24,
          },
        ],
        "start": 6,
        "end": 24,
      },
    });
    test(
      `***  
        hello : 
        world :`,
      {
        "type": "MdBlockSeparator",
        "separator": "***",
        "separatorChar": "*",
        "separatorStart": 0,
        "separatorEnd": 3,
        "start": 0,
        "end": 38,
        "properties": {
          "type": "MdBlockProperties",
          "properties": [
            {
              "type": "MdBlockProperty",
              "name": "hello",
              "nameStart": 14,
              "nameEnd": 19,
              "start": 6,
              "end": 23,
              "value": [
                "\n",
              ],
              "valueStart": 22,
              "valueEnd": 23,
            },
            {
              "type": "MdBlockProperty",
              "name": "world",
              "nameStart": 31,
              "nameEnd": 36,
              "start": 23,
              "end": 38,
              "value": [],
              "valueStart": 38,
              "valueEnd": 38,
            },
          ],
          "start": 6,
          "end": 38,
        },
      },
    );
    test(
      `***  
        hello : A
        world : B`,
      {
        "type": "MdBlockSeparator",
        "separator": "***",
        "separatorChar": "*",
        "separatorStart": 0,
        "separatorEnd": 3,
        "start": 0,
        "end": 41,
        "properties": {
          "type": "MdBlockProperties",
          "properties": [
            {
              "type": "MdBlockProperty",
              "name": "hello",
              "nameStart": 14,
              "nameEnd": 19,
              "start": 6,
              "end": 24,
              "value": [
                "A",
                "\n",
              ],
              "valueStart": 22,
              "valueEnd": 24,
            },
            {
              "type": "MdBlockProperty",
              "name": "world",
              "nameStart": 32,
              "nameEnd": 37,
              "start": 24,
              "end": 41,
              "value": [
                "B",
              ],
              "valueStart": 40,
              "valueEnd": 41,
            },
          ],
          "start": 6,
          "end": 41,
        },
      },
    );
    test(
      `***  
        hello : A
        wonderful :
        world : B`,
      {
        "type": "MdBlockSeparator",
        "separator": "***",
        "separatorChar": "*",
        "separatorStart": 0,
        "separatorEnd": 3,
        "start": 0,
        "end": 61,
        "properties": {
          "type": "MdBlockProperties",
          "properties": [
            {
              "type": "MdBlockProperty",
              "name": "hello",
              "nameStart": 14,
              "nameEnd": 19,
              "start": 6,
              "end": 24,
              "value": [
                "A",
                "\n",
              ],
              "valueStart": 22,
              "valueEnd": 24,
            },
            {
              "type": "MdBlockProperty",
              "name": "wonderful",
              "nameStart": 32,
              "nameEnd": 41,
              "start": 24,
              "end": 44,
              "value": [
                "\n",
              ],
              "valueStart": 43,
              "valueEnd": 44,
            },
            {
              "type": "MdBlockProperty",
              "name": "world",
              "nameStart": 52,
              "nameEnd": 57,
              "start": 44,
              "end": 61,
              "value": [
                "B",
              ],
              "valueStart": 60,
              "valueEnd": 61,
            },
          ],
          "start": 6,
          "end": 61,
        },
      },
    );
    test(
      `***  
       foo:bar: Baz
       hello: World!
       name: 'John Smith' 
       education: 
       age:  42
      `,
      {
        "type": "MdBlockSeparator",
        "separator": "***",
        "separatorChar": "*",
        "separatorStart": 0,
        "separatorEnd": 3,
        "start": 0,
        "end": 115,
        "properties": {
          "type": "MdBlockProperties",
          "properties": [
            {
              "type": "MdBlockProperty",
              "name": "foo:bar",
              "nameStart": 13,
              "nameEnd": 20,
              "start": 6,
              "end": 26,
              "value": [
                "Baz",
                "\n",
              ],
              "valueStart": 22,
              "valueEnd": 26,
            },
            {
              "type": "MdBlockProperty",
              "name": "hello",
              "nameStart": 33,
              "nameEnd": 38,
              "start": 26,
              "end": 47,
              "value": [
                "World!",
                "\n",
              ],
              "valueStart": 40,
              "valueEnd": 47,
            },
            {
              "type": "MdBlockProperty",
              "name": "name",
              "nameStart": 54,
              "nameEnd": 58,
              "start": 47,
              "end": 74,
              "value": [
                "John Smith",
                " \n",
              ],
              "valueStart": 60,
              "valueEnd": 74,
            },
            {
              "type": "MdBlockProperty",
              "name": "education",
              "nameStart": 81,
              "nameEnd": 90,
              "start": 74,
              "end": 93,
              "value": [
                "\n",
              ],
              "valueStart": 92,
              "valueEnd": 93,
            },
            {
              "type": "MdBlockProperty",
              "name": "age",
              "nameStart": 100,
              "nameEnd": 103,
              "start": 93,
              "end": 115,
              "value": [
                "42",
                "\n      ",
              ],
              "valueStart": 106,
              "valueEnd": 115,
            },
          ],
          "start": 6,
          "end": 115,
        },
      },
    );

    testPartial(
      `***  
       foo:bar: Baz
       hello: World!
       name: 'John Smith' 
       education: 
       age:  42

      This line is not a property anymore!
      `,
      {
        "type": "MdBlockSeparator",
        "separator": "***",
        "separatorChar": "*",
        "separatorStart": 0,
        "separatorEnd": 3,
        "start": 0,
        "end": 110,
        "properties": {
          "type": "MdBlockProperties",
          "properties": [
            {
              "type": "MdBlockProperty",
              "name": "foo:bar",
              "nameStart": 13,
              "nameEnd": 20,
              "start": 6,
              "end": 26,
              "value": [
                "Baz",
                "\n",
              ],
              "valueStart": 22,
              "valueEnd": 26,
            },
            {
              "type": "MdBlockProperty",
              "name": "hello",
              "nameStart": 33,
              "nameEnd": 38,
              "start": 26,
              "end": 47,
              "value": [
                "World!",
                "\n",
              ],
              "valueStart": 40,
              "valueEnd": 47,
            },
            {
              "type": "MdBlockProperty",
              "name": "name",
              "nameStart": 54,
              "nameEnd": 58,
              "start": 47,
              "end": 74,
              "value": [
                "John Smith",
                " \n",
              ],
              "valueStart": 60,
              "valueEnd": 74,
            },
            {
              "type": "MdBlockProperty",
              "name": "education",
              "nameStart": 81,
              "nameEnd": 90,
              "start": 74,
              "end": 93,
              "value": [
                "\n",
              ],
              "valueStart": 92,
              "valueEnd": 93,
            },
            {
              "type": "MdBlockProperty",
              "name": "age",
              "nameStart": 100,
              "nameEnd": 103,
              "start": 93,
              "end": 110,
              "value": [
                "42",
                "\n\n",
              ],
              "valueStart": 106,
              "valueEnd": 110,
            },
          ],
          "start": 6,
          "end": 110,
        },
      },
    );
  });
});
