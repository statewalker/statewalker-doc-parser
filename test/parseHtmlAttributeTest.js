import { default as expect } from "expect.js";
import parseHtmlAttribute from "../src/parseHtmlAttribute.js";

describe("parseHtmlAttribute", () => {
  it(`should parse attributes without values`, async () => {
    const result = parseHtmlAttribute("a");
    expect(result).to.eql({
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
    const result = parseHtmlAttribute("a = ");
    expect(result).to.eql({
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
    const result = parseHtmlAttribute("a=b");
    expect(result).to.eql({
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
    const result = parseHtmlAttribute("a    =     b:cd:ef$gh");
    expect(result).to.eql({
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
    const result = parseHtmlAttribute(
      "a    =     'b:${\n foo='Foo' bar=\"Bar\" hello \n}:c'",
    );
    expect(result).to.eql({
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
            codeStart : 16,
            codeEnd : 45,
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
    });
  });

  it(`should parse attributes key/value pairs on multiple lines`, async () => {
    const result = parseHtmlAttribute(
      `abc:$my-description  
         =  
          'b:\${
           <MyInternalWidget
             foo='\${<Foo bar="Baz">}'
             bar=\"Bar\" hello>
          }:c
       '"
   `,
    );
    expect(result).to.eql({
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
            codeStart : 50,
            codeEnd : 158,
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
    });
  });
});
