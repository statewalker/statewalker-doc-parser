import { default as expect } from "expect.js";
import parseHtmlTokens from "../src/parseHtmlTokens.js";

describe("parseHtmlTokens", () => {
  it(`should parse empty strings`, async () => {
    const result = parseHtmlTokens("");
    expect(result).to.eql({
      "type": "Html",
      "content": [],
      "start": 0,
      "end": 0,
    });
  });

  it(`should parse simple text`, async () => {
    const result = parseHtmlTokens("abc");
    expect(result).to.eql({
      "type": "Html",
      "content": [
        {
          "type": "Text",
          "text": "abc",
          "start": 0,
          "end": 3,
        },
      ],
      "start": 0,
      "end": 3,
    });
  });

  it(`should tags between special symbols`, async () => {
    const result = parseHtmlTokens("<<abc>>");
    expect(result).to.eql({
      "type": "Html",
      "content": [
        {
          "type": "HtmlSpecialChar",
          "char": "<",
          "start": 0,
          "end": 1,
        },
        {
          "type": "HtmlTag",
          "closing": false,
          "opening": true,
          "name": {
            "type": "HtmlTagName",
            "name": "abc",
            "start": 2,
            "end": 5,
          },
          "attributes": [],
          "start": 1,
          "end": 6,
        },
        {
          "type": "HtmlSpecialChar",
          "char": ">",
          "start": 6,
          "end": 7,
        },
      ],
      "start": 0,
      "end": 7,
    });
  });

  it(`should parse special symbols`, async () => {
    const result = parseHtmlTokens("< > & abc < > ");
    expect(result).to.eql({
      "type": "Html",
      "content": [
        {
          "type": "HtmlSpecialChar",
          "char": "<",
          "start": 0,
          "end": 1,
        },
        {
          "type": "Text",
          "text": " ",
          "start": 1,
          "end": 2,
        },
        {
          "type": "HtmlSpecialChar",
          "char": ">",
          "start": 2,
          "end": 3,
        },
        {
          "type": "Text",
          "text": " ",
          "start": 3,
          "end": 4,
        },
        {
          "type": "HtmlSpecialChar",
          "char": "&",
          "start": 4,
          "end": 5,
        },
        {
          "type": "Text",
          "text": " abc ",
          "start": 5,
          "end": 10,
        },
        {
          "type": "HtmlSpecialChar",
          "char": "<",
          "start": 10,
          "end": 11,
        },
        {
          "type": "Text",
          "text": " ",
          "start": 11,
          "end": 12,
        },
        {
          "type": "HtmlSpecialChar",
          "char": ">",
          "start": 12,
          "end": 13,
        },
        {
          "type": "Text",
          "text": " ",
          "start": 13,
          "end": 14,
        },
      ],
      "start": 0,
      "end": 14,
    });
  });

  it(`should parse entities with numeric values`, async () => {
    const result = parseHtmlTokens("&#008;");
    expect(result).to.eql({
      "type": "Html",
      "content": [
        {
          "type": "HtmlEntity",
          "entity": "#008",
          "contentStart": 1,
          "contentEnd": 5,
          "start": 0,
          "end": 6,
        },
      ],
      "start": 0,
      "end": 6,
    });
  });

  it(`should parse literal entities`, async () => {
    const result = parseHtmlTokens("&nbsp;");
    expect(result).to.eql({
      "type": "Html",
      "content": [
        {
          "type": "HtmlEntity",
          "entity": "nbsp",
          "contentStart": 1,
          "contentEnd": 5,
          "start": 0,
          "end": 6,
        },
      ],
      "start": 0,
      "end": 6,
    });
  });

  it(`should parse a simple full html documents`, async () => {
    const result = parseHtmlTokens(
      `before
      <script type="template/foobar" >
        <style>.body { color: red }</style>
        <div>
          <h3>Hello, there!</h3>
        </div>
      </script>
      after`,
    );
    // console.log(JSON.stringify(result, null, 2));
    expect(result).to.eql({
      "type": "Html",
      "content": [
        {
          "type": "Text",
          "text": "before\n      ",
          "start": 0,
          "end": 13,
        },
        {
          "type": "HtmlRawTag",
          "open": {
            "type": "HtmlTag",
            "closing": false,
            "opening": true,
            "name": {
              "type": "HtmlTagName",
              "name": "script",
              "start": 14,
              "end": 20,
            },
            "attributes": [
              {
                "type": "HtmlAttribute",
                "name": {
                  "type": "HtmlAttributeName",
                  "name": "type",
                  "start": 21,
                  "end": 25,
                },
                "start": 21,
                "end": 43,
                "value": {
                  "type": "HtmlAttributeValue",
                  "value": [
                    "template/foobar",
                  ],
                  "start": 26,
                  "end": 43,
                },
              },
            ],
            "start": 13,
            "end": 45,
          },
          "close": {
            "type": "HtmlTag",
            "closing": true,
            "opening": false,
            "name": {
              "type": "HtmlTagName",
              "name": "script",
              "start": 160,
              "end": 166,
            },
            "attributes": [],
            "start": 158,
            "end": 167,
          },
          "contentStart": 45,
          "contentEnd": 158,
          "content": [
            "\n        <style>.body { color: red }</style>\n        <div>\n          <h3>Hello, there!</h3>\n        </div>\n      ",
          ],
          "start": 13,
          "end": 167,
        },
        {
          "type": "Text",
          "text": "\n      after",
          "start": 167,
          "end": 179,
        },
      ],
      "start": 0,
      "end": 179,
    });
  });

  it(`should parse a simple full html documents`, async () => {
    const result = parseHtmlTokens(`
    <!DOCTYPE html>
    <html lang="en-US">
    <head>
      <meta charset="UTF-8"/>
      <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
      <link rel="profile" href="http://example.com"/>
      <!-- This site is optimized for viewing! -->
      <title>Page Title</title>
      <style id="my-css">
       .body { color: red }
      </style>
      <meta name="description" content="HTML is awesome" />
    </head>
    <body>
      <h1>Hello, world!</h1>
      Blah-blah!
    </body>
    </html>
    <!-- The End! -->`);
    // return console.log(JSON.stringify(result, null, 2));
    expect(result).to.eql({
      "type": "Html",
      "content": [
        {
          "type": "Text",
          "text": "\n    ",
          "start": 0,
          "end": 5,
        },
        {
          "type": "HtmlInstructions",
          "content": [
            "DOCTYPE html",
          ],
          "contentStart": 7,
          "contentEnd": 19,
          "start": 5,
          "end": 20,
        },
        {
          "type": "Text",
          "text": "\n    ",
          "start": 20,
          "end": 25,
        },
        {
          "type": "HtmlTag",
          "closing": false,
          "opening": true,
          "name": {
            "type": "HtmlTagName",
            "name": "html",
            "start": 26,
            "end": 30,
          },
          "attributes": [
            {
              "type": "HtmlAttribute",
              "name": {
                "type": "HtmlAttributeName",
                "name": "lang",
                "start": 31,
                "end": 35,
              },
              "start": 31,
              "end": 43,
              "value": {
                "type": "HtmlAttributeValue",
                "value": [
                  "en-US",
                ],
                "start": 36,
                "end": 43,
              },
            },
          ],
          "start": 25,
          "end": 44,
        },
        {
          "type": "Text",
          "text": "\n    ",
          "start": 44,
          "end": 49,
        },
        {
          "type": "HtmlTag",
          "closing": false,
          "opening": true,
          "name": {
            "type": "HtmlTagName",
            "name": "head",
            "start": 50,
            "end": 54,
          },
          "attributes": [],
          "start": 49,
          "end": 55,
        },
        {
          "type": "Text",
          "text": "\n      ",
          "start": 55,
          "end": 62,
        },
        {
          "type": "HtmlTag",
          "closing": true,
          "opening": true,
          "name": {
            "type": "HtmlTagName",
            "name": "meta",
            "start": 63,
            "end": 67,
          },
          "attributes": [
            {
              "type": "HtmlAttribute",
              "name": {
                "type": "HtmlAttributeName",
                "name": "charset",
                "start": 68,
                "end": 75,
              },
              "start": 68,
              "end": 83,
              "value": {
                "type": "HtmlAttributeValue",
                "value": [
                  "UTF-8",
                ],
                "start": 76,
                "end": 83,
              },
            },
          ],
          "start": 62,
          "end": 85,
        },
        {
          "type": "Text",
          "text": "\n      ",
          "start": 85,
          "end": 92,
        },
        {
          "type": "HtmlTag",
          "closing": false,
          "opening": true,
          "name": {
            "type": "HtmlTagName",
            "name": "meta",
            "start": 93,
            "end": 97,
          },
          "attributes": [
            {
              "type": "HtmlAttribute",
              "name": {
                "type": "HtmlAttributeName",
                "name": "http-equiv",
                "start": 98,
                "end": 108,
              },
              "start": 98,
              "end": 134,
              "value": {
                "type": "HtmlAttributeValue",
                "value": [
                  "Content-Security-Policy",
                ],
                "start": 109,
                "end": 134,
              },
            },
            {
              "type": "HtmlAttribute",
              "name": {
                "type": "HtmlAttributeName",
                "name": "content",
                "start": 135,
                "end": 142,
              },
              "start": 135,
              "end": 170,
              "value": {
                "type": "HtmlAttributeValue",
                "value": [
                  "upgrade-insecure-requests",
                ],
                "start": 143,
                "end": 170,
              },
            },
          ],
          "start": 92,
          "end": 171,
        },
        {
          "type": "Text",
          "text": "\n      ",
          "start": 171,
          "end": 178,
        },
        {
          "type": "HtmlTag",
          "closing": true,
          "opening": true,
          "name": {
            "type": "HtmlTagName",
            "name": "link",
            "start": 179,
            "end": 183,
          },
          "attributes": [
            {
              "type": "HtmlAttribute",
              "name": {
                "type": "HtmlAttributeName",
                "name": "rel",
                "start": 184,
                "end": 187,
              },
              "start": 184,
              "end": 197,
              "value": {
                "type": "HtmlAttributeValue",
                "value": [
                  "profile",
                ],
                "start": 188,
                "end": 197,
              },
            },
            {
              "type": "HtmlAttribute",
              "name": {
                "type": "HtmlAttributeName",
                "name": "href",
                "start": 198,
                "end": 202,
              },
              "start": 198,
              "end": 223,
              "value": {
                "type": "HtmlAttributeValue",
                "value": [
                  "http://example.com",
                ],
                "start": 203,
                "end": 223,
              },
            },
          ],
          "start": 178,
          "end": 225,
        },
        {
          "type": "Text",
          "text": "\n      ",
          "start": 225,
          "end": 232,
        },
        {
          "type": "HtmlComment",
          "content": [
            " This site is optimized for viewing! ",
          ],
          "contentStart": 236,
          "contentEnd": 273,
          "start": 232,
          "end": 276,
        },
        {
          "type": "Text",
          "text": "\n      ",
          "start": 276,
          "end": 283,
        },
        {
          "type": "HtmlTag",
          "closing": false,
          "opening": true,
          "name": {
            "type": "HtmlTagName",
            "name": "title",
            "start": 284,
            "end": 289,
          },
          "attributes": [],
          "start": 283,
          "end": 290,
        },
        {
          "type": "Text",
          "text": "Page Title",
          "start": 290,
          "end": 300,
        },
        {
          "type": "HtmlTag",
          "closing": true,
          "opening": false,
          "name": {
            "type": "HtmlTagName",
            "name": "title",
            "start": 302,
            "end": 307,
          },
          "attributes": [],
          "start": 300,
          "end": 308,
        },
        {
          "type": "Text",
          "text": "\n      ",
          "start": 308,
          "end": 315,
        },
        {
          "type": "HtmlRawTag",
          "open": {
            "type": "HtmlTag",
            "closing": false,
            "opening": true,
            "name": {
              "type": "HtmlTagName",
              "name": "style",
              "start": 316,
              "end": 321,
            },
            "attributes": [
              {
                "type": "HtmlAttribute",
                "name": {
                  "type": "HtmlAttributeName",
                  "name": "id",
                  "start": 322,
                  "end": 324,
                },
                "start": 322,
                "end": 333,
                "value": {
                  "type": "HtmlAttributeValue",
                  "value": [
                    "my-css",
                  ],
                  "start": 325,
                  "end": 333,
                },
              },
            ],
            "start": 315,
            "end": 334,
          },
          "close": {
            "type": "HtmlTag",
            "closing": true,
            "opening": false,
            "name": {
              "type": "HtmlTagName",
              "name": "style",
              "start": 371,
              "end": 376,
            },
            "attributes": [],
            "start": 369,
            "end": 377,
          },
          "contentStart": 334,
          "contentEnd": 369,
          "content": [
            "\n       .body { color: red }\n      ",
          ],
          "start": 315,
          "end": 377,
        },
        {
          "type": "Text",
          "text": "\n      ",
          "start": 377,
          "end": 384,
        },
        {
          "type": "HtmlTag",
          "closing": true,
          "opening": true,
          "name": {
            "type": "HtmlTagName",
            "name": "meta",
            "start": 385,
            "end": 389,
          },
          "attributes": [
            {
              "type": "HtmlAttribute",
              "name": {
                "type": "HtmlAttributeName",
                "name": "name",
                "start": 390,
                "end": 394,
              },
              "start": 390,
              "end": 408,
              "value": {
                "type": "HtmlAttributeValue",
                "value": [
                  "description",
                ],
                "start": 395,
                "end": 408,
              },
            },
            {
              "type": "HtmlAttribute",
              "name": {
                "type": "HtmlAttributeName",
                "name": "content",
                "start": 409,
                "end": 416,
              },
              "start": 409,
              "end": 434,
              "value": {
                "type": "HtmlAttributeValue",
                "value": [
                  "HTML is awesome",
                ],
                "start": 417,
                "end": 434,
              },
            },
          ],
          "start": 384,
          "end": 437,
        },
        {
          "type": "Text",
          "text": "\n    ",
          "start": 437,
          "end": 442,
        },
        {
          "type": "HtmlTag",
          "closing": true,
          "opening": false,
          "name": {
            "type": "HtmlTagName",
            "name": "head",
            "start": 444,
            "end": 448,
          },
          "attributes": [],
          "start": 442,
          "end": 449,
        },
        {
          "type": "Text",
          "text": "\n    ",
          "start": 449,
          "end": 454,
        },
        {
          "type": "HtmlTag",
          "closing": false,
          "opening": true,
          "name": {
            "type": "HtmlTagName",
            "name": "body",
            "start": 455,
            "end": 459,
          },
          "attributes": [],
          "start": 454,
          "end": 460,
        },
        {
          "type": "Text",
          "text": "\n      ",
          "start": 460,
          "end": 467,
        },
        {
          "type": "HtmlTag",
          "closing": false,
          "opening": true,
          "name": {
            "type": "HtmlTagName",
            "name": "h1",
            "start": 468,
            "end": 470,
          },
          "attributes": [],
          "start": 467,
          "end": 471,
        },
        {
          "type": "Text",
          "text": "Hello, world!",
          "start": 471,
          "end": 484,
        },
        {
          "type": "HtmlTag",
          "closing": true,
          "opening": false,
          "name": {
            "type": "HtmlTagName",
            "name": "h1",
            "start": 486,
            "end": 488,
          },
          "attributes": [],
          "start": 484,
          "end": 489,
        },
        {
          "type": "Text",
          "text": "\n      Blah-blah!\n    ",
          "start": 489,
          "end": 511,
        },
        {
          "type": "HtmlTag",
          "closing": true,
          "opening": false,
          "name": {
            "type": "HtmlTagName",
            "name": "body",
            "start": 513,
            "end": 517,
          },
          "attributes": [],
          "start": 511,
          "end": 518,
        },
        {
          "type": "Text",
          "text": "\n    ",
          "start": 518,
          "end": 523,
        },
        {
          "type": "HtmlTag",
          "closing": true,
          "opening": false,
          "name": {
            "type": "HtmlTagName",
            "name": "html",
            "start": 525,
            "end": 529,
          },
          "attributes": [],
          "start": 523,
          "end": 530,
        },
        {
          "type": "Text",
          "text": "\n    ",
          "start": 530,
          "end": 535,
        },
        {
          "type": "HtmlComment",
          "content": [
            " The End! ",
          ],
          "contentStart": 539,
          "contentEnd": 549,
          "start": 535,
          "end": 552,
        },
      ],
      "start": 0,
      "end": 552,
    });
  });
});
