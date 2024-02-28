import { describe, expect, it, beforeEach } from "../deps.ts";
import { readHtmlName } from "./readHtmlName.ts";
import { newCodeReader } from "./tokenizer-code.ts";
import {
  newNgramsReader,
  readDigits,
  readEols,
  readSpaces,
  readText,
} from "./tokenizer-sequence.ts";
import { TokenizerContext, newCompositeTokenizer } from "./tokenizer.ts";

// function newNgramsWithCode() {
//   const readNgrams = newCompositeTokenizer(
//     readEols,
//     readSpaces,
//     readDigits,
//     readText
//   );
//   const readCode = newCodeReader(readNgrams);
//   return newCompositeTokenizer(readCode, readNgrams);
// }

// function newNgramsWithCode() {
//   const readNgrams = newNgramsReader();
//   const readCode = newCodeReader(readNgrams);
//   return newCompositeTokenizer(readCode, readNgrams);
// }

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
      level: 1,
      type: "HtmlName",
      name: "a",
      start: 0,
      end: 1,
      value: "a",
    });
    test("abc", {
      level: 1,
      type: "HtmlName",
      name: "abc",
      start: 0,
      end: 3,
      value: "abc",
    });
    test("abc:cde123", {
      level: 1,
      type: "HtmlName",
      name: "abc:cde123",
      start: 0,
      end: 10,
      value: "abc:cde123",
    });
    test("$abc:cde123", {
      level: 1,
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
