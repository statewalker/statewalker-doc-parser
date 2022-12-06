import { default as expect } from "expect.js";
import parseMdHeaderStart from "../src/parseMdHeaderStart.js";

describe("parseMdHeaderStart", () => {

  function test(str, control) {
    const token = parseMdHeaderStart(str);
    try {
      expect(token).to.eql(control);
    } catch (error) {
      console.log(JSON.stringify(token, null, 2));
      throw error;
    }
  }

  it("should skip non-complete header starts", async () => {
    test("", undefined);
  });

  it("should parse valid header prefixes", async () => {
    test("#", {
      "type": "MdHeaderPrefix",
      "prefix": "#",
      "prefixStart": 0,
      "prefixEnd": 1,
      "start": 0,
      "end": 1
    });
    test("##", {
      "type": "MdHeaderPrefix",
      "prefix": "##",
      "prefixStart": 0,
      "prefixEnd": 2,
      "start": 0,
      "end": 2
    });
    test("# #", {
      "type": "MdHeaderPrefix",
      "prefix": "#",
      "prefixStart": 0,
      "prefixEnd": 1,
      "start": 0,
      "end": 2
    });
    test("## #", {
      "type": "MdHeaderPrefix",
      "prefix": "##",
      "prefixStart": 0,
      "prefixEnd": 2,
      "start": 0,
      "end": 3
    });

    test("###", {
      "type": "MdHeaderPrefix",
      "prefix": "###",
      "prefixStart": 0,
      "prefixEnd": 3,
      "start": 0,
      "end": 3
    });
    test("######", {
      "type": "MdHeaderPrefix",
      "prefix": "######",
      "prefixStart": 0,
      "prefixEnd": 6,
      "start": 0,
      "end": 6
    });
    test("######  ", {
      "type": "MdHeaderPrefix",
      "prefix": "######",
      "prefixStart": 0,
      "prefixEnd": 6,
      "start": 0,
      "end": 8
    });

    test("  ######  ", {
      "type": "MdHeaderPrefix",
      "prefix": "######",
      "prefixStart": 2,
      "prefixEnd": 8,
      "start": 0,
      "end": 10
    });

  });

});
