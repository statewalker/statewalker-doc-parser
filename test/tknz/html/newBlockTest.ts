import { expect } from "../../deps.ts";
import {
  type TToken,
  TokenizerContext,
  newBlockReader,
  TTokenizerMethod,
} from "../../../src/tknz/base/index.ts";

export function newBlockTest(tokenize: TTokenizerMethod) {
  return (str: string, control: Record<string, any>) => {
    const ctx = new TokenizerContext(str);
    const readToken = newBlockReader("Block", tokenize);
    const result = readToken(ctx);
    try {
      expect(result !== undefined).toEqual(true);
      const token: TToken = result as TToken;
      expect(token).to.eql(control);
      expect(token.start).toEqual(0);
      expect(token.value).toEqual(str.substring(token.start, token.end));
    } catch (error) {
      console.log(JSON.stringify(result, null, 2));
      throw error;
    }
  };
}
