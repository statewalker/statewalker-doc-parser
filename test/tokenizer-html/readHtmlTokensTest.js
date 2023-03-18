import { default as expect } from "expect.js";
import readHtmlTokens from "../../src/tokenizer-html/readHtmlTokens.js";

describe("readHtmlTokens", () => {
  it(`should read empty strings`, async () => {
    const result = readHtmlTokens("");
    expect(result).to.eql({
      "type": "Html",
      "content": [],
      "start": 0,
      "end": 0,
    });
  });

  it(`should read simple text`, async () => {
    const result = readHtmlTokens("abc");
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
    const result = readHtmlTokens("<<abc>>");
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
          "name": "abc",
          "nameStart": 2,
          "nameEnd": 5,
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

  it(`should read special symbols`, async () => {
    const result = readHtmlTokens("< > & abc < > ");
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

  it(`should read entities with numeric values`, async () => {
    const result = readHtmlTokens("&#008;");
    expect(result).to.eql({
      "type": "Html",
      "content": [
        {
          "type": "HtmlEntity",
          "entity": "#008",
          "entityStart": 1,
          "entityEnd": 5,
          "start": 0,
          "end": 6,
        },
      ],
      "start": 0,
      "end": 6,
    });
  });

  it(`should read literal entities`, async () => {
    const result = readHtmlTokens("&nbsp;");
    expect(result).to.eql({
      "type": "Html",
      "content": [
        {
          "type": "HtmlEntity",
          "entity": "nbsp",
          "entityStart": 1,
          "entityEnd": 5,
          "start": 0,
          "end": 6,
        },
      ],
      "start": 0,
      "end": 6,
    });
  });

  it(`should read a simple full html documents`, async () => {
    const result = readHtmlTokens(
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
            "name": "script",
            "nameStart": 14,
            "nameEnd": 20,
            "attributes": [
              {
                "type": "HtmlAttribute",
                "name": "type",
                "nameStart": 21,
                "nameEnd": 25,
                "start": 21,
                "end": 43,
                "value": [
                  "template/foobar",
                ],
                "valueStart": 26,
                "valueEnd": 43,
              },
            ],
            "start": 13,
            "end": 45,
          },
          "close": {
            "type": "HtmlTag",
            "closing": true,
            "opening": false,
            "name": "script",
            "nameStart": 160,
            "nameEnd": 166,
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

  it(`should read a simple full html documents`, async () => {
    const result = readHtmlTokens(`
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
          "name": "html",
          "nameStart": 26,
          "nameEnd": 30,
          "attributes": [
            {
              "type": "HtmlAttribute",
              "name": "lang",
              "nameStart": 31,
              "nameEnd": 35,
              "start": 31,
              "end": 43,
              "value": ["en-US"],
              "valueStart": 36,
              "valueEnd": 43,
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
          "name": "head",
          "nameStart": 50,
          "nameEnd": 54,
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
          "name": "meta",
          "nameStart": 63,
          "nameEnd": 67,
          "attributes": [
            {
              "type": "HtmlAttribute",
              "name": "charset",
              "nameStart": 68,
              "nameEnd": 75,
              "start": 68,
              "end": 83,
              "value": ["UTF-8"],
              "valueStart": 76,
              "valueEnd": 83,
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
          "name": "meta",
          "nameStart": 93,
          "nameEnd": 97,
          "attributes": [
            {
              "type": "HtmlAttribute",
              "name": "http-equiv",
              "nameStart": 98,
              "nameEnd": 108,
              "start": 98,
              "end": 134,
              "value": ["Content-Security-Policy"],
              "valueStart": 109,
              "valueEnd": 134,
            },
            {
              "type": "HtmlAttribute",
              "name": "content",
              "nameStart": 135,
              "nameEnd": 142,
              "start": 135,
              "end": 170,
              "value": ["upgrade-insecure-requests"],
              "valueStart": 143,
              "valueEnd": 170,
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
          "name": "link",
          "nameStart": 179,
          "nameEnd": 183,
          "attributes": [
            {
              "type": "HtmlAttribute",
              "name": "rel",
              "nameStart": 184,
              "nameEnd": 187,
              "start": 184,
              "end": 197,
              "value": [
                "profile",
              ],
              "valueStart": 188,
              "valueEnd": 197,
            },
            {
              "type": "HtmlAttribute",
              "name": "href",
              "nameStart": 198,
              "nameEnd": 202,
              "start": 198,
              "end": 223,
              "value": ["http://example.com"],
              "valueStart": 203,
              "valueEnd": 223,
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
          "name": "title",
          "nameStart": 284,
          "nameEnd": 289,
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
          "name": "title",
          "nameStart": 302,
          "nameEnd": 307,
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
            "name": "style",
            "nameStart": 316,
            "nameEnd": 321,
            "attributes": [
              {
                "type": "HtmlAttribute",
                "name": "id",
                "nameStart": 322,
                "nameEnd": 324,
                "start": 322,
                "end": 333,
                "value": ["my-css"],
                "valueStart": 325,
                "valueEnd": 333,
              },
            ],
            "start": 315,
            "end": 334,
          },
          "close": {
            "type": "HtmlTag",
            "closing": true,
            "opening": false,
            "name": "style",
            "nameStart": 371,
            "nameEnd": 376,
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
          "name": "meta",
          "nameStart": 385,
          "nameEnd": 389,
          "attributes": [
            {
              "type": "HtmlAttribute",
              "name": "name",
              "nameStart": 390,
              "nameEnd": 394,
              "start": 390,
              "end": 408,
              "value": ["description"],
              "valueStart": 395,
              "valueEnd": 408,
            },
            {
              "type": "HtmlAttribute",
              "name": "content",
              "nameStart": 409,
              "nameEnd": 416,
              "start": 409,
              "end": 434,
              "value": ["HTML is awesome"],
              "valueStart": 417,
              "valueEnd": 434,
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
          "name": "head",
          "nameStart": 444,
          "nameEnd": 448,
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
          "name": "body",
          "nameStart": 455,
          "nameEnd": 459,
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
          "name": "h1",
          "nameStart": 468,
          "nameEnd": 470,
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
          "name": "h1",
          "nameStart": 486,
          "nameEnd": 488,
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
          "name": "body",
          "nameStart": 513,
          "nameEnd": 517,
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
          "name": "html",
          "nameStart": 525,
          "nameEnd": 529,
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
