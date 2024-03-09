import {
  type TToken,
  type TTokenizerMethod,
  TokenizerContext,
  newBlockReader,
} from "../src/base/index.ts";
import { expect, it } from "./deps.ts";
import { writeTmpFile } from "./writeTmpFile.ts";

export function runBlockTests(
  test: (
    str: string,
    control: Record<string, any>
  ) => Record<string, any> | undefined,
  testData: Record<string, any>[]
) {
  testData.forEach((data) => {
    it(data.description, () => {
      try {
        test(data.input, data.expected);
      } catch (error) {
        const file = writeTmpFile({
          ...data,
          expected: (error as any).result,
        });
        console.log("Write in file:", file);
        throw error;
      }
    });
  });
}

export function newBlockTest(
  tokenize: TTokenizerMethod,
  runPerformanceCycles = 0
) {
  return (str: string, control: Record<string, any>) => {
    const readToken = newBlockReader("Block", tokenize);
    let run: () => TToken | undefined = () => {
      const ctx = new TokenizerContext(str);
      return readToken(ctx);
    };
    if (runPerformanceCycles > 0) {
      run = addPerformanceReport(str, runPerformanceCycles, run);
    }
    const result = run();
    try {
      expect(result !== undefined).toEqual(true);
      const token: TToken = result as TToken;
      expect(token).to.eql(control);
      expect(token.start).toEqual(0);
      expect(token.value).toEqual(str.substring(token.start, token.end));
      return result;
    } catch (error) {
      let str = JSON.stringify(result, null, 2);
      if (str.length > 1000) str = JSON.stringify(result);
      (error as any).result = result;
      throw error;
    }
  };

  function addPerformanceReport(
    str: string,
    count: number,
    fn: () => TToken | undefined
  ) {
    return () => {
      // const p = new Performance();
      let result: TToken | undefined;
      const start = performance.now();
      for (let i = 0; i < count; i++) {
        result = fn();
      }
      const end = performance.now();
      console.log(
        `* ${count} cycles: ${Math.round(end - start)} ms. 1 cycle (avg): ${
          (end - start) / count
        } ms/cycle. [${str}]`
      );
      return result;
    };
  }
}
