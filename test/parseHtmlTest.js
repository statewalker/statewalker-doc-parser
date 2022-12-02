import { default as expect } from "expect.js";
import { iterateHtmlTokens } from "../src/iterateHtmlTokens";
import { TreeBuilder } from "./TreeBuilder.js";

describe("parseHtmlTokens", () => {
  function* processHtml(str, listeners = {
    beginTag(type, attrs, positions = {}) {},
    endTag() {},
    onText(text) {},
  }) {
    for (let token of iterateHtmlTokens(str)) {
      // TODO: add code blocks
      // TODO: add HTML entities
      const positions = [token.start, token.end];
      if (token.type === "HtmlTag") {
        Object.assign(positions, { name: [token.name.start, token.name.end] });
        const type = token.name.name;
        const closing = token.closing;
        const opening = token.opening;
        if (opening) {
          let attrs = token.attributes.reduce((index, t) => {
            const list = t.value ? t.value.value : [];
            index[t.name.name] = list.length > 1 ? list : list[0];
            return index;
          }, {});
          positions.attributes = token.attributes.map((t) => [t.start, t.end]);
          listeners.beginTag(type, attrs, positions);
        }
        if (closing) {
          listeners.endTag(positions);
        }
      } else if (token.type === "Text") {
        listeners.onText(token.text, positions);
      }
      yield token;
    }
  }

  function test(str, control) {
    const tree = TreeBuilder.parse((text, listeners) => {
      for (let t of processHtml(text, listeners)) {
        //
      }
    }, str);
    try {
      expect(tree).to.eql(control);
    } catch (error) {
      console.log(JSON.stringify(tree, null, 2));
      throw error;
    }
  }

  it(`should parse text strings`, async () => {
    test("", {});
    test("abc", "abc");
  });

  it('should be able parse empty tags', () => {
    test(`<div>`, {
      "type": "div"
    });
    test(`<div></div>`, {
      "type": "div"
    });
    test(`<div />`, {
      "type": "div"
    });
    test(`<div     />`, {
      "type": "div"
    });
  })

  it("should be able to parse broken attributes", () => {
    test(`<sections format= />`, {
      "type": "sections",
      "attrs": { "format": undefined },
    });
    test(`<sections format=" />`, {
      "type": "sections",
      "attrs": { "format": " />" },
    });
    test(`<p>before\n\n<sections format=" />\n\nafter</p>`, {
      "type": "p",
      "children": [
        "before\n\n",
        {
          "type": "sections",
          "attrs": {
            "format": " />\n\nafter</p>",
          },
        },
      ],
    });
  });

  it('should parse attributes with colon', () => {
    test(`<h1 foo:bar=baz>Abc`, {
      "type": "h1",
      "attrs": { 'foo:bar': 'baz' },
      "children": ["Abc"]
    });
    test(`<h1 a:b=c>Abc</h1>`, {
      "type": "h1",
      "attrs": { 'a:b': 'c' },
      "children": ["Abc"]
    });
  })

  it('should parse attributes with dots', () => {
    test(`<h1 foo.bar=baz>Abc`, {
      "type": "h1",
      "attrs": { 'foo.bar': 'baz' },
      "children": ["Abc"]
    });
    test(`<h1 a.b=c>Abc</h1>`, {
      "type": "h1",
      "attrs": { 'a.b': 'c' },
      "children": ["Abc"]
    });
  })

  it('should parse tags with colon', () => {
    test(`<foo:h1 bar:baz=boo>Abc`, {
      "type": "foo:h1",
      "attrs": { 'bar:baz': 'boo' },
      "children": ["Abc"]
    });
    test(`<html:h1 a:b=c>Abc</h1>`, {
      "type": "html:h1",
      "attrs": { 'a:b': 'c' },
      "children": ["Abc"]
    });
  })

  it('should parse tag names with colon', () => {
    test(`<x:h1>Abc`, {
      "type": "x:h1",
      "children": ["Abc"]
    });
    test(`<x:h1 a:b=c>Abc</x:h1>`, {
      "type": "x:h1",
      "attrs": { 'a:b': 'c' },
      "children": ["Abc"]
    });
  })

  it('should be able to parse a single tag', () => {
    test(`<h1>Abc`, {
      "type": "h1",
      "children": ["Abc"]
    });
    test(`<h1>Abc</h1>`, {
      "type": "h1",
      "children": ["Abc"]
    });
  })

  it('should be able to parse a single tag with attributes', () => {
    test(`<h1 foo="Foo" bar=Bar baz   =   'Baz' >Abc`, {
      "type": "h1",
      "attrs": {
        foo: 'Foo',
        bar: 'Bar',
        baz: 'Baz'
      },
      "children": ["Abc"]
    });
  })

  it('should be able parse strings with non-HTML tags', () => {
    test(`<div>
      <h1>Hello</h1>
      <p>World</p>
      <Card c="d">
        <CardTitle>My Card</CardTitle>
        <CardBody>
          <p>Tata</p>
        </CardBody>
      </Card>
    </div>`,
      {
        "type": "div",
        "children": [
          "\n      ",
          {
            "type": "h1",
            "children": ["Hello"]
          },
          "\n      ",
          {
            "type": "p",
            "children": ["World"]
          },
          "\n      ",
          {
            "type": "Card",
            "attrs": { "c": "d" },
            "children": [
              "\n        ",
              {
                "type": "CardTitle",
                "children": ["My Card"]
              },
              "\n        ",
              {
                "type": "CardBody",
                "children": [
                  "\n          ",
                  {
                    "type": "p",
                    "children": ["Tata"]
                  },
                  "\n        "
                ]
              },
              "\n      "
            ]
          },
          "\n    "
        ]
      }
    );
  });

  it('should parse basic xml files', () => {
    test(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:hello xmlns:a="http://foo.bar.baz" xmlns:p="http://bar.baz.com"><p:abc><p:cde>Hello</p:cde></p:abc></p:hello>`, {
      type: 'p:hello',
      attrs:
      {
        'xmlns:a': 'http://foo.bar.baz',
        'xmlns:p': 'http://bar.baz.com'
      },
      children: [{
        type: 'p:abc',
        children: [{
          "type": "p:cde",
          "children": ["Hello"],
        }]
      }]
    });
  })


  it("should be able to parse complex tags", () => {
    test(`<p>foobar</p><p>after`, {
      "children": [
        {
          "type": "p",
          "children": [
            "foobar",
          ],
        },
        {
          "type": "p",
          "children": [
            "after",
          ],
        },
      ],
    });
    test(`<h1 foo:bar=baz>Abc`, {
      "type": "h1",
      "attrs": { "foo:bar": "baz" },
      "children": ["Abc"],
    });
    test(`<h1 a:b=c>Abc</h1>`, {
      "type": "h1",
      "attrs": { "a:b": "c" },
      "children": ["Abc"],
    });
    test(`<div> before <div> inside </div> after </div> text.`, {
      children: [
        {
          "type": "div",
          "children": [
            " before ",
            {
              "type": "div",
              "children": [
                " inside ",
              ],
            },
            " after ",
          ],
        },
        " text.",
      ],
    });
    test(
      `<div>
      <h1>Hello</h1>
      <p>World</p>
      <Card c="d">
        <CardTitle>My Card</CardTitle>
        <CardBody>
          <p>Tata</p>
        </CardBody>
      </Card>
    </div>`,
      {
        "type": "div",
        "children": [
          "\n      ",
          {
            "type": "h1",
            "children": ["Hello"],
          },
          "\n      ",
          {
            "type": "p",
            "children": ["World"],
          },
          "\n      ",
          {
            "type": "Card",
            "attrs": { "c": "d" },
            "children": [
              "\n        ",
              {
                "type": "CardTitle",
                "children": ["My Card"],
              },
              "\n        ",
              {
                "type": "CardBody",
                "children": [
                  "\n          ",
                  {
                    "type": "p",
                    "children": ["Tata"],
                  },
                  "\n        ",
                ],
              },
              "\n      ",
            ],
          },
          "\n    ",
        ],
      },
    );
  });
});
