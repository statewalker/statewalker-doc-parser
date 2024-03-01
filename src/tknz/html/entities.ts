import { type TToken, type TokenizerContext } from "../base/index.ts";

export interface THtmlEntityToken extends TToken {
  type: "HtmlEntity";
}
export default function readHtmlEntity(
  ctx: TokenizerContext
): THtmlEntityToken | undefined {
  return ctx.guard(() => {
    if (ctx.getChar() !== "&") return;
    const start = ctx.i;
    ctx.i++;
    if (ctx.getChar() === "#") ctx.i++;
    while (ctx.i < ctx.length) {
      const char = ctx.getChar();
      if (
        ("A" <= char && char <= "Z") ||
        ("a" <= char && char <= "z") ||
        ("0" <= char && char <= "9") ||
        char === "_"
      ) {
        ctx.i++;
        continue;
      }
      break;
    }
    if (ctx.getChar() !== ";") return;
    ctx.i++;
    const end = ctx.i;
    return {
      type: "HtmlEntity",
      start,
      end,
      value: ctx.substring(start, end),
    };
  });
}
