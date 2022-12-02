import { default as expect } from "expect.js";
import parseHtmlEntity from "../src/parseHtmlEntity.js";

describe("parseHtmlEntity", () => {
  it(`should parse entities with numeric values`, async () => {
    const result = parseHtmlEntity("&#008;");
    expect(result).to.eql({
      type: "HtmlEntity",
      entityStart: 1,
      entityEnd: 5,
      entity: "#008",
      start: 0,
      end: 6,
    });
  });

  it(`should parse literal entities`, async () => {
    const result = parseHtmlEntity("&nbsp;");
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
