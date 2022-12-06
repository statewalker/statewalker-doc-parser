import { default as expect } from "expect.js";
import readHtmlInstructions from "../../src/tokenizer/readHtmlInstructions.js";

describe("readHtmlInstructions", () => {
  it("should skip empty blocks", async () => {
    const result = readHtmlInstructions("<? slkjdfljqsdf >");
    expect(result).to.eql({
      type: "XmlDeclarations",
      content: [" slkjdfljqsdf "],
      contentStart: 2,
      contentEnd: 16,
      start: 0,
      end: 17,
    });
  });

  it("should read CDATA blocks", async () => {
    const result = readHtmlInstructions("<![CDATA[ before <div> abc sldkflsj <!-- sljdfj --> </div> after ]]>");
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

  it("should read HTML comments", async () => {
    const result = readHtmlInstructions("<!-- before <div> abc sldkflsj <!-- sljdfj </div> after -->");
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


  it("should read processing instructions", async () => {
    const result = readHtmlInstructions("<!DOCTYPE html> XYZ");
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
