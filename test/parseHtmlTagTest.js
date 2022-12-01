import { default as expect } from "expect.js";
import parseHtmlTag from "../src/parseHtmlTag.js";

describe("parseHtmlTag", () => {
  it(`should parse simple tags`, async () => {
    const result = parseHtmlTag("<a>");
    expect(result).to.eql({
      type: "HtmlTag",
      opening: true,
      closing: false,
      name: {
        type: "HtmlTagName",
        start: 1,
        end: 2,
        name: "a",
      },
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
      name: {
        type: "HtmlTagName",
        start: 1,
        end: 2,
        name: "a",
      },
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
      "name": {
        "type": "HtmlTagName",
        "name": "a",
        "start": 1,
        "end": 2,
      },
      "attributes": [
        {
          "type": "HtmlAttribute",
          "name": {
            "type": "HtmlAttributeName",
            "name": "x",
            "start": 3,
            "end": 4,
          },
          "start": 3,
          "end": 6,
          "value": {
            "type": "HtmlAttributeValue",
            "value": [
              "y",
            ],
            "start": 5,
            "end": 6,
          },
        },
        {
          "type": "HtmlAttribute",
          "name": {
            "type": "HtmlAttributeName",
            "name": "z",
            "start": 7,
            "end": 8,
          },
          "start": 7,
          "end": 18,
          "value": {
            "type": "HtmlAttributeValue",
            "value": [
              "foo bar",
            ],
            "start": 9,
            "end": 18,
          },
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
      "name": {
        "type": "HtmlTagName",
        "name": "a",
        "start": 1,
        "end": 2,
      },
      "attributes": [
        {
          "type": "HtmlAttribute",
          "name": {
            "type": "HtmlAttributeName",
            "name": "x",
            "start": 3,
            "end": 4,
          },
          "start": 3,
          "end": 6,
          "value": {
            "type": "HtmlAttributeValue",
            "value": [
              "y",
            ],
            "start": 5,
            "end": 6,
          },
        },
        {
          "type": "HtmlAttribute",
          "name": {
            "type": "HtmlAttributeName",
            "name": "z",
            "start": 7,
            "end": 8,
          },
          "start": 7,
          "end": 43,
          "value": {
            "type": "HtmlAttributeValue",
            "value": [
              "foo ",
              {
                "type": "Code",
                "code": [
                  " `<toto titi=tata/>` ",
                ],
                "start": 14,
                "end": 38,
              },
              " bar",
            ],
            "start": 9,
            "end": 43,
          },
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
      "name": {
        "type": "HtmlTagName",
        "name": "a",
        "start": 1,
        "end": 2,
      },
      "attributes": [
        {
          "type": "HtmlAttribute",
          "name": {
            "type": "HtmlAttributeName",
            "name": "first",
            "start": 3,
            "end": 8,
          },
          "start": 3,
          "end": 9,
        },
        {
          "type": "Code",
          "code": [
            " `<toto titi=tata/>` ",
          ],
          "start": 9,
          "end": 33,
        },
        {
          "type": "HtmlAttribute",
          "name": {
            "type": "HtmlAttributeName",
            "name": "third",
            "start": 34,
            "end": 39,
          },
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
      "name": {
        "type": "HtmlTagName",
        "name": "a",
        "start": 1,
        "end": 2,
      },
      "attributes": [
        {
          "type": "HtmlAttribute",
          "name": {
            "type": "HtmlAttributeName",
            "name": "x",
            "start": 3,
            "end": 4,
          },
          "start": 3,
          "end": 6,
          "value": {
            "type": "HtmlAttributeValue",
            "value": [
              "y",
            ],
            "start": 5,
            "end": 6,
          },
        },
        {
          "type": "HtmlAttribute",
          "name": {
            "type": "HtmlAttributeName",
            "name": "z",
            "start": 7,
            "end": 8,
          },
          "start": 7,
          "end": 43,
          "value": {
            "type": "HtmlAttributeValue",
            "value": [
              "foo ",
              {
                "type": "Code",
                "code": [
                  " `<toto titi=tata/>` ",
                ],
                "start": 14,
                "end": 38,
              },
              " bar",
            ],
            "start": 9,
            "end": 43,
          },
        },
      ],
      "start": 0,
      "end": 46,
    });
  });

  it(`should parse broken (non-finished) tags`, async () => {
    const result = parseHtmlTag("<a");
    expect(result).to.eql({
      type: "HtmlTag",
      opening: true,
      closing: false,
      name: {
        type: "HtmlTagName",
        start: 1,
        end: 2,
        name: "a",
      },
      attributes: [],
      start: 0,
      end: 2,
    });
  });


  it(`should parse broken tags (1)`, async () => {
    const result = parseHtmlTag("<img <sometag> src=x onerror=alert(1)BBB");
    expect(result).to.eql({
      type: "HtmlTag",
      closing: false,
      opening: true,
      name: { type: "HtmlTagName", name: "img", start: 1, end: 4 },
      attributes: [],
      start: 0,
      end: 5,
    });
  });

  it(`should parse broken tags (2)`, async () => {
    const result = parseHtmlTag("<img src=x onerror=alert(1)BBB ");
    expect(result).to.eql({
      "type": "HtmlTag",
      "closing": false,
      "opening": true,
      "name": {
        "type": "HtmlTagName",
        "name": "img",
        "start": 1,
        "end": 4
      },
      "attributes": [
        {
          "type": "HtmlAttribute",
          "name": {
            "type": "HtmlAttributeName",
            "name": "src",
            "start": 5,
            "end": 8
          },
          "start": 5,
          "end": 10,
          "value": {
            "type": "HtmlAttributeValue",
            "value": [
              "x"
            ],
            "start": 9,
            "end": 10
          }
        },
        {
          "type": "HtmlAttribute",
          "name": {
            "type": "HtmlAttributeName",
            "name": "onerror",
            "start": 11,
            "end": 18
          },
          "start": 11,
          "end": 30,
          "value": {
            "type": "HtmlAttributeValue",
            "value": [
              "alert(1)BBB"
            ],
            "start": 19,
            "end": 30
          }
        }
      ],
      "start": 0,
      "end": 31
    });
  });

  it(`should parse broken tags (3)`, async () => {
    const result = parseHtmlTag("<img src = x onerror =  alert(1)BBB ");
    expect(result).to.eql({
      "type": "HtmlTag",
      "closing": false,
      "opening": true,
      "name": {
        "type": "HtmlTagName",
        "name": "img",
        "start": 1,
        "end": 4
      },
      "attributes": [
        {
          "type": "HtmlAttribute",
          "name": {
            "type": "HtmlAttributeName",
            "name": "src",
            "start": 5,
            "end": 8
          },
          "start": 5,
          "end": 12,
          "value": {
            "type": "HtmlAttributeValue",
            "value": [
              "x"
            ],
            "start": 11,
            "end": 12
          }
        },
        {
          "type": "HtmlAttribute",
          "name": {
            "type": "HtmlAttributeName",
            "name": "onerror",
            "start": 13,
            "end": 20
          },
          "start": 13,
          "end": 35,
          "value": {
            "type": "HtmlAttributeValue",
            "value": [
              "alert(1)BBB"
            ],
            "start": 24,
            "end": 35
          }
        }
      ],
      "start": 0,
      "end": 36
    });
  });
});
