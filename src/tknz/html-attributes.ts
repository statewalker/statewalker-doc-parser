import { CHAR_EOL, CHAR_SPACE } from "./chars.ts";
import { readAttributeValue } from "./html-values.ts";
import { readHtmlName } from "./html-names.ts";
import { TToken, TokenizerContext } from "./tokenizer.ts";

export interface THtmlAttributeToken extends TToken {
  type: "HtmlAttribute";
  children: TToken[];
}
export default function readHtmlAttribute(
  ctx: TokenizerContext
): THtmlAttributeToken | undefined {
  const start = ctx.i;
  let name = readHtmlName(ctx) as TToken | undefined;
  if (!name) {
    return;
  }
  let end = start;
  name.type = "HtmlAttributeName";
  const token: THtmlAttributeToken = {
    type: "HtmlAttribute",
    start,
    end,
    value: ctx.substring(start, end),
    children: [name],
  };
  ctx.skipWhile(CHAR_SPACE | CHAR_EOL);
  if (ctx.getChar() === "=") {
    ctx.i++;
    end = ctx.i;
    ctx.skipWhile(CHAR_SPACE | CHAR_EOL);
    const value = readAttributeValue(ctx);
    if (value) {
      token.children.push(value);
      end = value.end;
    }
  }
  token.end = end;
  return token;
}
