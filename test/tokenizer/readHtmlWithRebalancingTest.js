import { default as expect } from "expect.js";
import splitToHtmlTokens from "../../src/tokenizer/splitToHtmlTokens.js";
import TreeBuilder from "./handlers/TreeBuilder.js";
import processHtml from "./handlers/processHtml.js";
import transformHtmlTokens from "./handlers/transformHtmlTokens.js";
import rebalanceHtmlTokens from "./handlers/rebalanceHtmlTokens.js";

describe("readHtmlTokens", () => {
  function test(str, control) {
    const builder = new TreeBuilder();
    let it;
    it = splitToHtmlTokens(str);
    it = transformHtmlTokens(it);
    it = rebalanceHtmlTokens(it);
    it = processHtml(it, builder);
    let end = 0;
    for (let token of it) {
      // console.log('*', token);
      [, end] = token.positions;
    }
    const tree = builder.result;
    try {
      expect(tree).to.eql(control);
      expect(end).to.eql(str.length);
    } catch (error) {
      console.log(JSON.stringify(tree, null, 2));
      throw error;
    }
  }

  it(`should rebalance auto-closing tags`, async () => {
    test("<dt>A</dl>B", {
      "children": [
        {
          "type": "dl",
          "children": [
            {
              "type": "dt",
              "children": [
                "A",
              ],
            },
          ],
        },
        {
          "type": "span",
          "children": [
            "B",
          ],
        },
      ],
    });

    test("<ul><li>First<li>Second", {
      type: "ul",
      children: [
        { type: "li", children: ["First"] },
        { type: "li", children: ["Second"] },
      ],
    });

    test("<ul><li>First<li>Second<ol><li>X<li>Y", {
      type: "ul",
      children: [
        { type: "li", children: ["First"] },
        {
          type: "li",
          children: ["Second", {
            type: "ol",
            children: [
              { type: "li", children: ["X"] },
              { type: "li", children: ["Y"] },
            ],
          }],
        },
      ],
    });
  });

  it(`should add missing tags`, async () => {
    test("<li>First<li>Second", {
      type: "ul",
      children: [
        { type: "li", children: ["First"] },
        { type: "li", children: ["Second"] },
      ],
    });

    test("<td>First<td>Second", {
      type: "table",
      children: [
        {
          type: "tbody",
          children: [
            {
              type: "tr",
              children: [
                { type: "td", children: ["First"] },
                { type: "td", children: ["Second"] },
              ],
            },
          ],
        },
      ],
    });

    test("<dt>First<dd>Second", {
      "type": "dl",
      "children": [
        {
          "type": "dt",
          "children": ["First"],
        },
        {
          "type": "dd",
          "children": ["Second"],
        },
      ],
    });
    test("<dl><dt>First</dt><dd>Second</dd></dl>", {
      "type": "dl",
      "children": [
        {
          "type": "dt",
          "children": ["First"],
        },
        {
          "type": "dd",
          "children": ["Second"],
        },
      ],
    });
    test("<dt>First<dd>Second</dl>Paragraph", {
      "children": [
        {
          "type": "dl",
          "children": [
            {
              "type": "dt",
              "children": [
                "First",
              ],
            },
            {
              "type": "dd",
              "children": [
                "Second",
              ],
            },
          ],
        },
        {
          "type": "span",
          "children": [
            "Paragraph",
          ],
        },
      ],
    });

    test("<td>First<td>Second<tr>Third", {
      "type": "table",
      "children": [
        {
          "type": "tbody",
          "children": [
            {
              "type": "tr",
              "children": [
                { "type": "td", "children": ["First"] },
                { "type": "td", "children": ["Second"] },
              ],
            },
            {
              "type": "tr",
              "children": [
                {
                  "type": "td",
                  "children": [{ "type": "span", "children": ["Third"] }],
                },
              ],
            },
          ],
        },
      ],
    });
  });
});
