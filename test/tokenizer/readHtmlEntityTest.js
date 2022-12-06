import { default as expect } from "expect.js";
import readHtmlEntity from "../../src/tokenizer/readHtmlEntity.js";

describe("readHtmlEntity", () => {
  it(`should read entities with numeric values`, async () => {
    const result = readHtmlEntity("&#008;");
    expect(result).to.eql({
      type: "HtmlEntity",
      entityStart: 1,
      entityEnd: 5,
      entity: "#008",
      start: 0,
      end: 6,
    });
  });

  it(`should read literal entities`, async () => {
    const result = readHtmlEntity("&nbsp;");
    expect(result).to.eql({
      type: "HtmlEntity",
      entityStart: 1,
      entityEnd: 5,
      entity: "nbsp",
      start: 0,
      end: 6,
    });
  });
});
