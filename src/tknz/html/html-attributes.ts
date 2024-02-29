import { CHAR_EOL, CHAR_SPACE } from "../chars.ts";
import { readHtmlName } from "./html-names.ts";
import { TToken, TTokenizerMethod, TokenizerContext } from "../tokenizer.ts";
import { newHtmlValueReader } from "./html-values.ts";

export interface THtmlAttributeToken extends TToken {
  type: "HtmlAttribute";
}
export function newHtmlAttributeReader(
  readToken: TTokenizerMethod = () => undefined
): TTokenizerMethod<THtmlAttributeToken> {
  const readValue = newHtmlValueReader(readToken);
  return (ctx: TokenizerContext) =>
    ctx.guard(() => {
      const start = ctx.i;
      const name = readHtmlName(ctx);
      if (!name) return;
      let end = name.end;
      const children: TToken[] = [name];
      ctx.skipWhile(CHAR_SPACE | CHAR_EOL);
      let valueToken: TToken | undefined;
      if (ctx.getChar() === "=") {
        ctx.i++;
        ctx.skipWhile(CHAR_SPACE | CHAR_EOL);
        end = ctx.i;
        valueToken = readValue(ctx);
        if (valueToken) {
          end = valueToken.end;
          children.push(valueToken);
        }
      }
      return {
        type: "HtmlAttribute",
        start,
        end,
        value: ctx.substring(start, end),
        children,
      };
    });
}
