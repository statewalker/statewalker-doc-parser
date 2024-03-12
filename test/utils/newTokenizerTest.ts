import type { TToken, TTokenizerMethod } from "../../src/base/index.ts";
import { TokenizerContext, newBlockReader } from "../../src/base/index.ts";

export function newTokenizerTest(
  tokenize: TTokenizerMethod,
  runPerformanceCycles = 0
) {
  return ({ input }: { input: string }) => {
    const readToken = newBlockReader("Block", tokenize);
    let run: () => TToken | undefined = () => {
      const ctx = new TokenizerContext(input);
      return readToken(ctx);
    };
    if (runPerformanceCycles > 0) {
      run = addPerformanceReport(input, runPerformanceCycles, run);
    }
    const result = run();
    return result;
  };
}

export function addPerformanceReport(
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
