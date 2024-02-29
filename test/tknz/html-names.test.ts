import { describe, expect, it, beforeEach } from "../deps.ts";
import { readHtmlName } from "../../src/tknz/html/html-names.ts";
import { TokenizerContext } from "../../src/tknz/tokenizer.ts";

describe("readHtmlName", () => {
  function test(str: string, control?: Record<string, any>) {
    const ctx = new TokenizerContext(str);
    const result = readHtmlName(ctx);
    try {
      expect(result).to.eql(control);
    } catch (error) {
      console.log(JSON.stringify(result, null, 2));
      throw error;
    }
  }
  it(`should read HTML names (attribute and tag names)`, async () => {
    test("a", {
      type: "HtmlName",
      name: "a",
      start: 0,
      end: 1,
      value: "a",
    });
    test("abc", {
      type: "HtmlName",
      name: "abc",
      start: 0,
      end: 3,
      value: "abc",
    });
    test("abc:cde123", {
      type: "HtmlName",
      name: "abc:cde123",
      start: 0,
      end: 10,
      value: "abc:cde123",
    });
    test("$abc:cde123", {
      type: "HtmlName",
      name: "$abc:cde123",
      start: 0,
      end: 11,
      value: "$abc:cde123",
    });
  });
  it(`should return "undefined" value for wrong names`, async () => {
    test(" a", undefined);
    test("#abc", undefined);
    test("-abc:cde123", undefined);
    test("32abc:cde123", undefined);
  });
});
