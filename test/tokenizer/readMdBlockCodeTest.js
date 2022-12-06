import { default as expect } from "expect.js";
import readMdBlockCode from "../../src/tokenizer/readMdBlockCode.js";

describe("readMdBlockCode", () => {
  it("should skip empty blocks", async () => {
    const result = readMdBlockCode("");
    expect(result).to.be(undefined);
  });

  it('should skip strings not starting from the "```" pattern', async () => {
    const result = readMdBlockCode(" ```abc\n```");
    expect(result).to.be(undefined);
  });

  it('should skip to the end all strings without the "\\n```" pattern', async () => {
    expect(readMdBlockCode("```abc```")).to.eql({
      type: "MdCodeBlock",
      contentStart: 3,
      contentEnd: 9,
      start: 0,
      end: 9,
      content: ["abc```"],
    });
    expect(readMdBlockCode("```abc\n ```")).to.eql({
      type: "MdCodeBlock",
      contentStart: 3,
      contentEnd: 11,
      start: 0,
      end: 11,
      content: ["abc\n ```"],
    });
  });

  it("should read simple code blocks", async () => {
    const result = readMdBlockCode("```abc\n```");
    expect(result).to.eql({
      type: "MdCodeBlock",
      contentStart: 3,
      contentEnd: 6,
      start: 0,
      end: 10,
      content: ["abc"],
    });
  });

  it("should read code blocks containing the '```' sequence in the body", async () => {
    const str = "```abc ``` cde ``` efg \n```after";
    const result = readMdBlockCode(str);
    expect(result).to.eql({
      type: "MdCodeBlock",
      contentStart: 3,
      contentEnd: 23,
      start: 0,
      end: 27,
      content: ["abc ``` cde ``` efg "],
    });
    expect(str.substring(result.end)).to.eql("after");
  });

  it("should properly read escaped end blocks", async () => {
    function testNonFinishedEscapedCode(str, code) {
      const result = readMdBlockCode(str);
      expect(result).to.eql({
        type: "MdCodeBlock",
        contentStart: 3,
        contentEnd: str.length,
        start: 0,
        end: str.length,
        content: [code],
      });
    }
    testNonFinishedEscapedCode("```abc\\\n```", "abc\n```");
    testNonFinishedEscapedCode("```abc\n\\```", "abc\n```");
    testNonFinishedEscapedCode("```abc\n`\\``", "abc\n```");
    testNonFinishedEscapedCode("```abc\n``\\`", "abc\n```");

    function testEscaped(str, code) {
      const result = readMdBlockCode(str);
      expect(result).to.eql({
        type: "MdCodeBlock",
        contentStart: 3,
        contentEnd: str.length - 4,
        start: 0,
        end: str.length,
        content: [code],
      });
    }
    testEscaped("```abc\\\n```\n```", "abc\n```");
    testEscaped("```abc\n\\```\n```", "abc\n```");
    testEscaped("```abc\n`\\``\n```", "abc\n```");
    testEscaped("```abc\n``\\`\n```", "abc\n```");
  });

  it("should read blocks with ${...} patterns", async () => {
    const str = "```abc ${ js template ```code\n``` } cde\n```after";
    const result = readMdBlockCode(str);
    expect(result).to.eql({
      type: "MdCodeBlock",
      content: [
        "abc ",
        {
          type: "Code",
          code: [" js template ```code\n``` "],
          codeStart: 9,
          codeEnd: 34,
          start: 7,
          end: 35,
        },
        "cde",
      ],
      contentStart: 3,
      contentEnd: 39,
      start: 0,
      end: 43,
    });
    expect(str.substring(result.end)).to.eql("after");
  });

  it("should read blocks with ${...} patterns", async () => {
    const str = "```abc ${ js template ```code\n``` }\n```after";
    const result = readMdBlockCode(str);
    expect(result).to.eql({
      type: "MdCodeBlock",
      content: [
        "abc ",
        {
          type: "Code",
          code: [" js template ```code\n``` "],
          codeStart: 9,
          codeEnd: 34,
          start: 7,
          end: 35,
        },
      ],
      contentStart: 3,
      contentEnd: 35,
      start: 0,
      end: 39,
    });
    expect(str.substring(result.end)).to.eql("after");
  });

  it("should read blocks with non-terminated ${...} patterns", async () => {
    const str = "```abc ${ js template ```code\n``` \n```xxx";
    const result = readMdBlockCode(str);
    expect(result).to.eql({
      type: "MdCodeBlock",
      content: [
        "abc ",
        {
          type: "Code",
          code: [" js template ```code\n``` \n```xxx"],
          codeStart : 9,
          codeEnd : 41,
          start: 7,
          end: 41,
        },
      ],
      contentStart: 3,
      contentEnd: 42,
      start: 0,
      end: 42,
    });
  });
});
