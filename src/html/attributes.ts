import {
  type TToken,
  type TTokenizerMethod,
  type TokenizerContext,
  isSpaceOrEol,
  isolate,
} from "../base/index.ts";
import { readHtmlName } from "./names.ts";
import { newHtmlValueReader } from "./values.ts";

export interface THtmlAttributeToken extends TToken {
  type: "HtmlAttribute";
}
export function newHtmlAttributeReader(
  readToken: TTokenizerMethod = () => undefined
): TTokenizerMethod<THtmlAttributeToken> {
  // const readValue = isolate(newHtmlValueReader(readToken));
  const readValue = newHtmlValueReader(readToken);
  return (ctx: TokenizerContext) =>
    ctx.guard(() => {
      const start = ctx.i;
      const name = readHtmlName(ctx);
      if (!name) return;
      let end = name.end;
      const children: TToken[] = [name];
      ctx.skipWhile(isSpaceOrEol);
      let valueToken: TToken | undefined;
      if (ctx.getChar() === "=") {
        ctx.i++;
        ctx.skipWhile(isSpaceOrEol);
        end = ctx.i;
        valueToken = readValue(ctx);
        if (valueToken) {
          end = valueToken.end;
          children.push(valueToken);
        }
      }
      ctx.i = end;
      return {
        type: "HtmlAttribute",
        start,
        end,
        value: ctx.substring(start, end),
        children,
      };
    });
}
