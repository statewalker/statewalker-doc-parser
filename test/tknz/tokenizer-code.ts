import { TToken, TTokenLevel, TokenizerContext } from "./tokenizer.ts";

export interface TCodeToken extends TToken {
  type: "Code";
  codeStart: number;
  codeEnd: number;
  code: (TToken | string)[];
}
export function readCode(ctx: TokenizerContext): TCodeToken | undefined {
  const res = read(ctx);
  return res;

  function read(ctx: TokenizerContext): TCodeToken | undefined {
    const start = ctx.i;
    let depth = 0;
    if (ctx.str[ctx.i++] !== "$" || ctx.str[ctx.i++] !== "{") return;
    const codeStart = ctx.i;
    let codeEnd = ctx.i;

    const code: (TToken | string)[] = [];
    let escaped = false;
    let quot = null;
    let textStart = ctx.i;
    const flushText = () => {
      if (ctx.i > textStart) {
        code.push(ctx.str.substring(textStart, ctx.i));
        textStart = ctx.i;
      }
    };
    for (const len = ctx.str.length; ctx.i < len; ctx.i++, codeEnd++) {
      const ch = ctx.str[ctx.i];
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (quot) {
        if (ch === quot) {
          quot = "";
        } else if (quot === "`" && ch === "$") {
          flushText();
          const r = read(ctx);
          if (r) {
            code.push(r);
            ctx.i = r.end;
            ctx.i--;
            codeEnd = ctx.i;
            textStart = r.end;
          }
        }
      } else if (ch === '"' || ch === "'" || ch === "`") {
        quot = ch;
      } else if (ch === "{") {
        depth++;
      } else if (ch === "}") {
        if (depth === 0) {
          flushText();
          codeEnd = ctx.i;
          ctx.i++;
          textStart = ctx.i;
          break;
        } else {
          depth--;
        }
      }
    }
    flushText();
    return {
      type: "Code",
      level: TTokenLevel.char,
      codeStart,
      codeEnd,
      code,
      start,
      end: ctx.i,
      value: ctx.str.slice(start, ctx.i),
    };
  }
}
