import { newCodeReader } from "../code-readers.ts";
import { newQuotedTextReader } from "./text-readers.ts";
import {
  TToken,
  TTokenizerMethod,
  TokenizerContext,
  newCompositeTokenizer,
} from "../tokenizer.ts";
import { newCharsReader } from "../chars-readers.ts";

export interface TAttributeValueToken extends TToken {
  type: "HtmlValue";
  quoted: boolean;
  valueStart: number;
  valueEnd: number;
}

export function newHtmlValueReader(
  readToken?: TTokenizerMethod
): TTokenizerMethod<TAttributeValueToken> {
  const tokenizers: TTokenizerMethod[] = [];
  if (readToken) tokenizers.push(readToken);
  
  const read = newCompositeTokenizer(tokenizers);
  {
    const readCode = newCodeReader(readToken);
    tokenizers.push(readCode);

    const readQuotedText = newQuotedTextReader(() => readCode);
    tokenizers.push(readQuotedText);

    tokenizers.push(
      newCharsReader("String", (char) => {
        return !!char.match(/\S/);
      })
    );
  }
  return (ctx: TokenizerContext) => {
    const token = read(ctx);
    if (!token) return;
    const quoted = token.type === "QuotedText";
    const inc = quoted ? 1 : 0;
    return {
      ...token,
      type: "HtmlValue",
      quoted,
      valueStart: token.start + inc,
      valueEnd: token.end - inc,
    } as TAttributeValueToken;
  };
}
