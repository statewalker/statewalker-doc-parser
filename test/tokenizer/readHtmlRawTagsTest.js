import { default as expect } from "expect.js";
import newHtmlRawTagParser from "../../src/tokenizer/newHtmlRawTagParser.js";

describe("newHtmlRawTagParser", () => {
  const readRawTag = newHtmlRawTagParser("script");

  it(`should read raw tags `, async () => {
    const result = readRawTag("<script>");
    expect(result).to.eql({
      "type": "HtmlRawTag",
      "open": {
        "type": "HtmlTag",
        "closing": false,
        "opening": true,
        "name": "script",
        "nameStart": 1,
        "nameEnd": 7,
        "attributes": [],
        "start": 0,
        "end": 8,
      },
      "close": null,
      "contentStart": 8,
      "contentEnd": 8,
      "content": [],
      "start": 0,
      "end": 8,
    });
  });

  it(`should read raw empty tags with attributes`, async () => {
    const result = readRawTag(
      "<script type='application/javascript' id='324'>",
    );
    expect(result).to.eql({
      "type": "HtmlRawTag",
      "open": {
        "type": "HtmlTag",
        "closing": false,
        "opening": true,
        "name": "script",
        "nameStart": 1,
        "nameEnd": 7,
        "attributes": [
          {
            "type": "HtmlAttribute",
            "name": "type",
            "nameStart": 8,
            "nameEnd": 12,
            "start": 8,
            "end": 37,
            "value": ["application/javascript"],
            "valueStart": 13,
            "valueEnd": 37,
          },
          {
            "type": "HtmlAttribute",
            "name": "id",
            "nameStart": 38,
            "nameEnd": 40,
            "start": 38,
            "end": 46,
            "value": ["324"],
            "valueStart": 41,
            "valueEnd": 46,
          },
        ],
        "start": 0,
        "end": 47,
      },
      "close": null,
      "contentStart": 47,
      "contentEnd": 47,
      "content": [],
      "start": 0,
      "end": 47,
    });
  });

  it(`should read raw tags with content`, async () => {
    const result = readRawTag(
      "<script><foo> </bar> qlsdfljl <!-- Not a comment --> jqsdf!</script>",
    );
    // console.log(JSON.stringify(result, null, 2));
    expect(result).to.eql({
      "type": "HtmlRawTag",
      "open": {
        "type": "HtmlTag",
        "closing": false,
        "opening": true,
        "name": "script",
        "nameStart": 1,
        "nameEnd": 7,
        "attributes": [],
        "start": 0,
        "end": 8,
      },
      "close": {
        "type": "HtmlTag",
        "closing": true,
        "opening": false,
        "name": "script",
        "nameStart": 61,
        "nameEnd": 67,
        "attributes": [],
        "start": 59,
        "end": 68,
      },
      "contentStart": 8,
      "contentEnd": 59,
      "content": [
        "<foo> </bar> qlsdfljl <!-- Not a comment --> jqsdf!",
      ],
      "start": 0,
      "end": 68,
    });
  });
});
