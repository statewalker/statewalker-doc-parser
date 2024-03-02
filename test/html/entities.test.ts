import { describe, it } from "../deps.ts";
import { readHtmlEntity } from "../../src/html/index.ts";
import { newBlockTest } from "./newBlockTest.ts";

describe("readHtmlEntities", () => {
  const test = newBlockTest(readHtmlEntity);

  it(`should read simple HTML entities`, () => {
    test("Hello &amp; World", {
      type: "Block",
      start: 0,
      end: 17,
      value: "Hello &amp; World",
      children: [
        {
          type: "HtmlEntity",
          start: 6,
          end: 11,
          value: "&amp;",
        },
      ],
    });
  });

  it(`should read HTML entities with digits`, () => {
    test("Hello &#150; World", {
      type: "Block",
      start: 0,
      end: 18,
      value: "Hello &#150; World",
      children: [
        {
          type: "HtmlEntity",
          start: 6,
          end: 12,
          value: "&#150;",
        },
      ],
    });
  });
});
