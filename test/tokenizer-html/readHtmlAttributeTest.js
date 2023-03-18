import { default as expect } from "expect.js";
import readHtmlAttribute from "../../src/tokenizer-html/readHtmlAttribute.js";

describe("readHtmlAttribute", () => {
  function test(str, control) {
    const result = readHtmlAttribute(str);
    try {
      expect(result).to.eql(control);
    } catch (error) {
      console.log(JSON.stringify(result, null, 2));
      throw error;
    }
  }
  it(`should read attributes without values`, async () => {
    test("a", {
      type: "HtmlAttribute",
      name: "a",
      nameStart: 0,
      nameEnd: 1,
      start: 0,
      end: 1,
    });
  });

  it(`should read attributes with undefined values`, async () => {
    test("a = ", {
      type: "HtmlAttribute",
      name: "a",
      nameStart: 0,
      nameEnd: 1,
      start: 0,
      end: 4,
    });
  });

  it(`should read simple attribute values`, async () => {
    test("a=b", {
      type: "HtmlAttribute",
      name: "a",
      nameStart: 0,
      nameEnd: 1,
      value: ["b"],
      valueStart: 2,
      valueEnd: 3,
      start: 0,
      end: 3,
    });
  });

  it(`should read simple attribute values separated by spaces`, async () => {
    test("a    =     b:cd:ef$gh", {
      type: "HtmlAttribute",
      name: "a",
      nameStart: 0,
      nameEnd: 1,
      value: ["b:cd:ef$gh"],
      valueStart: 11,
      valueEnd: 21,
      start: 0,
      end: 21,
    });
  });

  it(`should read simple attribute values with code blocks`, async () => {
    test(
      "a    =     'b:${\n foo='Foo' bar=\"Bar\" hello \n}:c'",
      {
        type: "HtmlAttribute",
        name: "a",
        nameStart: 0,
        nameEnd: 1,
        value: ["b:cd:ef$gh"],
        valueStart: 11,
        valueEnd: 21,
        value: [
          "b:",
          {
            type: "Code",
            code: ["\n foo='Foo' bar=\"Bar\" hello \n"],
            codeStart: 16,
            codeEnd: 45,
            start: 14,
            end: 46,
          },
          ":c",
        ],
        valueStart: 11,
        valueEnd: 49,
        start: 0,
        end: 49,
      },
    );
  });

  it(`should read attribute values containing non-quoted code blocks`, async () => {
    test(
      "a    =     ${\n foo='Foo' bar=\"Bar\" hello \n}",
      {
        type: "HtmlAttribute",
        name: "a",
        nameStart: 0,
        nameEnd: 1,
        value: [
          {
            type: "Code",
            code: ["\n foo='Foo' bar=\"Bar\" hello \n"],
            codeStart: 13,
            codeEnd: 42,
            start: 11,
            end: 43,
          },
        ],
        valueStart: 11,
        valueEnd: 43,
        start: 0,
        end: 43,
      },
    );

    test(
      "a    =     b:${\n foo='Foo' bar=\"Bar\" hello \n}",
      {
        type: "HtmlAttribute",
        name: "a",
        nameStart: 0,
        nameEnd: 1,
        value: [
          "b:",
          {
            type: "Code",
            code: ["\n foo='Foo' bar=\"Bar\" hello \n"],
            codeStart: 15,
            codeEnd: 44,
            start: 13,
            end: 45,
          },
        ],
        valueStart: 11,
        valueEnd: 45,
        start: 0,
        end: 45,
      },
    );

    test(
      "a    =     ${\n foo='Foo' bar=\"Bar\" hello \n}:c",
      {
        type: "HtmlAttribute",
        name: "a",
        nameStart: 0,
        nameEnd: 1,
        value: [
          {
            type: "Code",
            code: ["\n foo='Foo' bar=\"Bar\" hello \n"],
            codeStart: 13,
            codeEnd: 42,
            start: 11,
            end: 43,
          },
          ":c",
        ],
        valueStart: 11,
        valueEnd: 45,
        start: 0,
        end: 45,
      },
    );

    test(
      "a    =     b:${\n foo='Foo' bar=\"Bar\" hello \n}:c",
      {
        type: "HtmlAttribute",
        name: "a",
        nameStart: 0,
        nameEnd: 1,
        value: [
          "b:",
          {
            type: "Code",
            code: ["\n foo='Foo' bar=\"Bar\" hello \n"],
            codeStart: 15,
            codeEnd: 44,
            start: 13,
            end: 45,
          },
          ":c",
        ],
        valueStart: 11,
        valueEnd: 47,
        start: 0,
        end: 47,
      },
    );
  });

  it(`should read attribute values containing non-quoted code blocks`, async () => {
    test(
      "a = ${x}${y}${z}",
      {
        "type": "HtmlAttribute",
        "name": "a",
        "nameStart": 0,
        "nameEnd": 1,
        "start": 0,
        "end": 16,
        "value": [
          {
            "type": "Code",
            "codeStart": 6,
            "codeEnd": 7,
            "code": [
              "x",
            ],
            "start": 4,
            "end": 8,
          },
          {
            "type": "Code",
            "codeStart": 10,
            "codeEnd": 11,
            "code": [
              "y",
            ],
            "start": 8,
            "end": 12,
          },
          {
            "type": "Code",
            "codeStart": 14,
            "codeEnd": 15,
            "code": [
              "z",
            ],
            "start": 12,
            "end": 16,
          },
        ],
        "valueStart": 4,
        "valueEnd": 16,
      },
    );
  });

  return it(`should read attributes key/value pairs on multiple lines`, async () => {
    test(
      `abc:$my-description  
         =  
          'b:\${
           <MyInternalWidget
             foo='\${<Foo bar="Baz">}'
             bar=\"Bar\" hello>
          }:c
       '"
   `,
      {
        type: "HtmlAttribute",
        name: "abc:$my-description",
        nameStart: 0,
        nameEnd: 19,
        value: [
          "b:",
          {
            type: "Code",
            code: [
              '\n           <MyInternalWidget\n             foo=\'${<Foo bar="Baz">}\'\n             bar="Bar" hello>\n          ',
            ],
            codeStart: 50,
            codeEnd: 158,
            start: 48,
            end: 159,
          },
          ":c\n       ",
        ],
        valueStart: 45,
        valueEnd: 170,
        start: 0,
        end: 170,
      },
    );
  });
});
