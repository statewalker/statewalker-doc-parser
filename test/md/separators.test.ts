import type {
  TToken,
  TTokenizerMethod,
  TokenizerContext,
} from "../../src/index.ts";
import {
  isEol,
  isolate,
  newBlockReader,
  newBlocksSequenceReader,
  newCharReader,
  newCodeReader,
} from "../../src/index.ts";
import { newTestRunner } from "../utils/newTestRunner.ts";
import { newTokenizerTest } from "../utils/newTokenizerTest.ts";

Promise.resolve().then(main).catch(console.error);

function newTokensReader(
  type: string,
  readToken: TTokenizerMethod,
  min: number = 1,
  max: number = Infinity
): TTokenizerMethod {
  return (ctx: TokenizerContext): TToken | undefined =>
    ctx.guard(() => {
      const start = ctx.i;
      let tokens: TToken[] | undefined;
      for (let i = 0; i < max && ctx.i < ctx.length; i++) {
        const token = readToken(ctx);
        if (!token) break;
        tokens = tokens || [];
        tokens.push(token);
      }
      if (!tokens || tokens.length < min || tokens.length > max) return;
      const end = ctx.i;
      return {
        type,
        start,
        end,
        value: ctx.substring(start, end),
        children: tokens,
      };
    });
}

function newSeparateBlocksReader(
  readToken: TTokenizerMethod
): TTokenizerMethod {
  const readEol = newCharReader(
    "Eol",
    (char) => char === "\n" || char === "\r"
  );
  const readEmptyLines = newTokensReader("EmptyLines", readEol, 2);
  return newBlocksSequenceReader("TextBlock", readEmptyLines, readToken);
}

async function main() {
  const readContent = isolate(newCodeReader());
  const readToken = newSeparateBlocksReader(readContent);
  const runTests = newTestRunner(newTokenizerTest(readToken));
  runTests(`${import.meta.dirname}/data/separators`);
}
