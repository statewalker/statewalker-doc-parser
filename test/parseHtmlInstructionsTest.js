import { default as expect } from "expect.js";
import parseHtmlInstructions from "../src/parseHtmlInstructions.js";

describe("parseHtmlInstructions", () => {
  it("should skip empty blocks", async () => {
    const result = parseHtmlInstructions("<? slkjdfljqsdf >");
    expect(result).to.eql({
      type: "XmlDeclarations",
      content: [" slkjdfljqsdf "],
      contentStart: 2,
      contentEnd: 16,
      start: 0,
      end: 17,
    });
  });

  it("should parse CDATA blocks", async () => {
    const result = parseHtmlInstructions("<![CDATA[ before <div> abc sldkflsj <!-- sljdfj --> </div> after ]]>");
    expect(result).to.eql({
      "type": "HtmlCDATA",
      "content": [
        " before <div> abc sldkflsj <!-- sljdfj --> </div> after "
      ],
      "contentStart": 9,
      "contentEnd": 65,
      "start": 0,
      "end": 68
    });
  });

  it("should parse HTML comments", async () => {
    const result = parseHtmlInstructions("<!-- before <div> abc sldkflsj <!-- sljdfj </div> after -->");
    expect(result).to.eql({
      "type": "HtmlComment",
      "content": [
        " before <div> abc sldkflsj <!-- sljdfj </div> after "
      ],
      "contentStart": 4,
      "contentEnd": 56,
      "start": 0,
      "end": 59
    });
  });


  it("should parse processing instructions", async () => {
    const result = parseHtmlInstructions("<!DOCTYPE html> XYZ");
    // console.log(JSON.stringify(result, null, 2))
    expect(result).to.eql({
      "type": "HtmlInstructions",
      "content": [
        "DOCTYPE html"
      ],
      "contentStart": 2,
      "contentEnd": 14,
      "start": 0,
      "end": 15
    });
  });
});
