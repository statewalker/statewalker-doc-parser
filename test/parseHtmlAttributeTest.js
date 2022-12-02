import { default as expect } from "expect.js";
import parseHtmlAttribute from "../src/parseHtmlAttribute.js";

describe("parseHtmlAttribute", () => {
  function test(str, control) {
    const result = parseHtmlAttribute(str);
    try {
      expect(result).to.eql(control);
    } catch (error) {
      console.log(JSON.stringify(result, null, 2));
      throw error;
    }
  }
  it(`should parse attributes without values`, async () => {
    test("a", {
      type: "HtmlAttribute",
      name: {
        type: "HtmlAttributeName",
        start: 0,
        end: 1,
        name: "a",
      },
      start: 0,
      end: 1,
    });
  });

  it(`should parse attributes with undefined values`, async () => {
    test("a = ", {
      type: "HtmlAttribute",
      name: {
        type: "HtmlAttributeName",
        start: 0,
        end: 1,
        name: "a",
      },
      start: 0,
      end: 4,
    });
  });

  it(`should parse simple attribute values`, async () => {
    test("a=b", {
      type: "HtmlAttribute",
      name: {
        type: "HtmlAttributeName",
        start: 0,
        end: 1,
        name: "a",
      },
      value: {
        type: "HtmlAttributeValue",
        start: 2,
        end: 3,
        value: ["b"],
      },
      start: 0,
      end: 3,
    });
  });

  it(`should parse simple attribute values separated by spaces`, async () => {
    test("a    =     b:cd:ef$gh", {
      type: "HtmlAttribute",
      name: {
        type: "HtmlAttributeName",
        start: 0,
        end: 1,
        name: "a",
      },
      value: {
        type: "HtmlAttributeValue",
        start: 11,
        end: 21,
        value: ["b:cd:ef$gh"],
      },
      start: 0,
      end: 21,
    });
  });

  it(`should parse simple attribute values with code blocks`, async () => {
    test(
      "a    =     'b:${\n foo='Foo' bar=\"Bar\" hello \n}:c'",
      {
        type: "HtmlAttribute",
        name: {
          type: "HtmlAttributeName",
          start: 0,
          end: 1,
          name: "a",
        },
        value: {
          type: "HtmlAttributeValue",
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
          start: 11,
          end: 49,
        },
        start: 0,
        end: 49,
      },
    );
  });

  it(`should parse attribute values containing non-quoted code blocks`, async () => {
    test(
      "a    =     ${\n foo='Foo' bar=\"Bar\" hello \n}",
      {
        type: "HtmlAttribute",
        name: {
          type: "HtmlAttributeName",
          start: 0,
          end: 1,
          name: "a",
        },
        value: {
          type: "HtmlAttributeValue",
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
          start: 11,
          end: 43,
        },
        start: 0,
        end: 43,
      },
    );

    test(
      "a    =     b:${\n foo='Foo' bar=\"Bar\" hello \n}",
      {
        type: "HtmlAttribute",
        name: {
          type: "HtmlAttributeName",
          start: 0,
          end: 1,
          name: "a",
        },
        value: {
          type: "HtmlAttributeValue",
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
          start: 11,
          end: 45,
        },
        start: 0,
        end: 45,
      },
    );

    test(
      "a    =     ${\n foo='Foo' bar=\"Bar\" hello \n}:c",
      {
        type: "HtmlAttribute",
        name: {
          type: "HtmlAttributeName",
          start: 0,
          end: 1,
          name: "a",
        },
        value: {
          type: "HtmlAttributeValue",
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
          start: 11,
          end: 45,
        },
        start: 0,
        end: 45,
      },
    );

    test(
      "a    =     b:${\n foo='Foo' bar=\"Bar\" hello \n}:c",
      {
        type: "HtmlAttribute",
        name: {
          type: "HtmlAttributeName",
          start: 0,
          end: 1,
          name: "a",
        },
        value: {
          type: "HtmlAttributeValue",
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
          start: 11,
          end: 47,
        },
        start: 0,
        end: 47,
      },
    );
  });

  it(`should parse attribute values containing non-quoted code blocks`, async () => {
    test(
      "a = ${x}${y}${z}",
      {
        "type": "HtmlAttribute",
        "name": {
          "type": "HtmlAttributeName",
          "name": "a",
          "start": 0,
          "end": 1,
        },
        "start": 0,
        "end": 16,
        "value": {
          "type": "HtmlAttributeValue",
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
          "start": 4,
          "end": 16,
        },
      },
    );
  });

  it(`should parse attributes key/value pairs on multiple lines`, async () => {
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
        name: {
          type: "HtmlAttributeName",
          start: 0,
          end: 19,
          name: "abc:$my-description",
        },
        value: {
          type: "HtmlAttributeValue",
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
          start: 45,
          end: 170,
        },
        start: 0,
        end: 170,
      },
    );
  });
});
