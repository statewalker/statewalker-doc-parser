import { default as expect } from "expect.js";
import parseHtmlTag from "../src/parseHtmlTag.js";

describe("parseHtmlTag", () => {
  it(`should parse simple tags`, async () => {
    const result = parseHtmlTag("<a>");
    expect(result).to.eql({
      type: "HtmlTag",
      opening: true,
      closing: false,
      name: "a",
      nameStart: 1,
      nameEnd: 2,
      attributes: [],
      start: 0,
      end: 3,
    });
  });

  it(`should parse auto-closing tags`, async () => {
    const result = parseHtmlTag("<a />");
    expect(result).to.eql({
      type: "HtmlTag",
      opening: true,
      closing: true,
      name: "a",
      nameStart: 1,
      nameEnd: 2,
      attributes: [],
      start: 0,
      end: 5,
    });
  });

  it(`should parse tags with attributes`, async () => {
    const result = parseHtmlTag("<a x=y z='foo bar'/>");
    expect(result).to.eql({
      "type": "HtmlTag",
      "closing": true,
      "opening": true,
      "name": "a",
      "nameStart": 1,
      "nameEnd": 2,
      "attributes": [
        {
          "type": "HtmlAttribute",
          "name": "x",
          "nameStart": 3,
          "nameEnd": 4,
          "start": 3,
          "end": 6,
          "value": ["y"],
          "valueStart": 5,
          "valueEnd": 6,
        },
        {
          "type": "HtmlAttribute",
          "name": "z",
          "nameStart": 7,
          "nameEnd": 8,
          "start": 7,
          "end": 18,
          "value": ["foo bar"],
          "valueStart": 9,
          "valueEnd": 18,
        },
      ],
      "start": 0,
      "end": 20,
    });
  });

  it(`should parse tags with code attributes`, async () => {
    const result = parseHtmlTag(
      "<a x=y z='foo ${ `<toto titi=tata/>` } bar' />",
    );
    expect(result).to.eql({
      "type": "HtmlTag",
      "closing": true,
      "opening": true,
      "name": "a",
      "nameStart": 1,
      "nameEnd": 2,
      "attributes": [
        {
          "type": "HtmlAttribute",
          "name": "x",
          "nameStart": 3,
          "nameEnd": 4,
          "value": ["y"],
          "valueStart": 5,
          "valueEnd": 6,
          "start": 3,
          "end": 6,
        },
        {
          "type": "HtmlAttribute",
          "name": "z",
          "nameStart": 7,
          "nameEnd": 8,
          "start": 7,
          "end": 43,
          "value": [
            "foo ",
            {
              "type": "Code",
              "code": [
                " `<toto titi=tata/>` ",
              ],
              "codeStart": 16,
              "codeEnd": 37,
              "start": 14,
              "end": 38,
            },
            " bar",
          ],
          "valueStart": 9,
          "valueEnd": 43,
        },
      ],
      "start": 0,
      "end": 46,
    });
  });

  it(`should parse tags with code attributes (2)`, async () => {
    const result = parseHtmlTag(
      "<a first ${ `<toto titi=tata/>` } third />",
    );
    expect(result).to.eql({
      "type": "HtmlTag",
      "closing": true,
      "opening": true,
      "name": "a",
      "nameStart": 1,
      "nameEnd": 2,
      "attributes": [
        {
          "type": "HtmlAttribute",
          "name": "first",
          "nameStart": 3,
          "nameEnd": 8,
          "start": 3,
          "end": 9,
        },
        {
          "type": "Code",
          "code": [
            " `<toto titi=tata/>` ",
          ],
          "codeStart": 11,
          "codeEnd": 32,
          "start": 9,
          "end": 33,
        },
        {
          "type": "HtmlAttribute",
          "name": "third",
          "nameStart": 34,
          "nameEnd": 39,
          "start": 34,
          "end": 40,
        },
      ],
      "start": 0,
      "end": 42,
    });
  });

  it(`should parse tags with code attributes`, async () => {
    const result = parseHtmlTag(
      "<a x=y z='foo ${ `<toto titi=tata/>` } bar' />",
    );
    expect(result).to.eql({
      "type": "HtmlTag",
      "closing": true,
      "opening": true,
      "name": "a",
      "nameStart": 1,
      "nameEnd": 2,
      "attributes": [
        {
          "type": "HtmlAttribute",
          "name": "x",
          "nameStart": 3,
          "nameEnd": 4,
          "start": 3,
          "end": 6,
          "value": ["y"],
          "valueStart": 5,
          "valueEnd": 6,
        },
        {
          "type": "HtmlAttribute",
          "name": "z",
          "nameStart": 7,
          "nameEnd": 8,
          "start": 7,
          "end": 43,
          "value": [
            "foo ",
            {
              "type": "Code",
              "code": [
                " `<toto titi=tata/>` ",
              ],
              "codeStart": 16,
              "codeEnd": 37,
              "start": 14,
              "end": 38,
            },
            " bar",
          ],
          "valueStart": 9,
          "valueEnd": 43,
        },
      ],
      "start": 0,
      "end": 46,
    });
  });

  it(`should parse broken tags (2)`, async () => {
    const result = parseHtmlTag("<img src=x onerror=alert(1)BBB ");
    expect(result).to.eql({
      "type": "HtmlTag",
      "closing": false,
      "opening": true,
      "name": "img",
      "nameStart": 1,
      "nameEnd": 4,
      "attributes": [
        {
          "type": "HtmlAttribute",
          "name": "src",
          "nameStart": 5,
          "nameEnd": 8,
          "start": 5,
          "end": 10,
          "value": ["x"],
          "valueStart": 9,
          "valueEnd": 10,
        },
        {
          "type": "HtmlAttribute",
          "name": "onerror",
          "nameStart": 11,
          "nameEnd": 18,
          "start": 11,
          "end": 30,
          "value": ["alert(1)BBB"],
          "valueStart": 19,
          "valueEnd": 30,
        },
      ],
      "start": 0,
      "end": 31,
    });
  });

  return it(`should parse broken tags (3)`, async () => {
    const result = parseHtmlTag("<img src = x onerror =  alert(1)BBB ");
    expect(result).to.eql({
      "type": "HtmlTag",
      "closing": false,
      "opening": true,
      "name": "img",
      "nameStart": 1,
      "nameEnd": 4,
      "attributes": [
        {
          "type": "HtmlAttribute",
          "name": "src",
          "nameStart": 5,
          "nameEnd": 8,
          "start": 5,
          "end": 12,
          "value": [ "x" ],
          "valueStart": 11,
          "valueEnd": 12,
        },
        {
          "type": "HtmlAttribute",
          "name": "onerror",
          "nameStart": 13,
          "nameEnd": 20,
          "start": 13,
          "end": 35,
          "value": [ "alert(1)BBB" ],
          "valueStart": 24,
          "valueEnd": 35,
        },
      ],
      "start": 0,
      "end": 36,
    });
  });
});
