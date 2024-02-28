import {
  TToken,
  TTokenLevel,
  TTokenizerMethod,
  TokenizerContext,
} from "./tokenizer.ts";

export interface TCodeToken extends TToken {
  type: "Code";
  codeStart: number;
  codeEnd: number;
  code: (TToken | string)[];
}

export function newCodeReader(parent: TTokenizerMethod): TTokenizerMethod {
  return function readCode(ctx: TokenizerContext): TCodeToken | undefined {
    const res = read(ctx);
    return res;

    function read(ctx: TokenizerContext): TCodeToken | undefined {
      const start = ctx.i;
      let found = false;
      try {
        let depth = 0;
        if (ctx.getChar(+0) !== "$" || ctx.getChar(+1) !== "{") return;
        ctx.i += 2;
        found = true;

        const codeStart = ctx.i;
        let codeEnd = codeStart;

        const code: (TToken | string)[] = [];
        let children: TToken[] | undefined = undefined;
        let escaped = false;
        let quot = null;
        let textStart = codeStart;
        const flushText = (i: number) => {
          if (i > textStart) {
            code.push(ctx.substring(textStart, i));
            textStart = i;
          }
        };
        for (const len = ctx.length; ctx.i < len; ctx.i++, codeEnd++) {
          // FIXME: read the fence token and break the loop if found
          const ch = ctx.getChar();
          if (escaped) {
            escaped = false;
          } else if (ch === "\\") {
            escaped = true;
          } else if (quot) {
            if (ch === quot) {
              quot = "";
            } else if (quot === "`" && ch === "$") {
              // FIXME:
              // - add a new fence with the current level
              // - read a next token using the parent tokenizer
              const previousPos = ctx.i;
              const r = read(ctx);
              if (r) {
                flushText(previousPos);
                code.push(r);
                if (!children) {
                  children = [r];
                } else {
                  children.push(r);
                }
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
              flushText(ctx.i);
              codeEnd = ctx.i;
              ctx.i++;
              textStart = ctx.i;
              break;
            } else {
              depth--;
            }
          }
        }
        flushText(ctx.i);
        const result: TCodeToken = {
          type: "Code",
          level: TTokenLevel.char,
          codeStart,
          codeEnd,
          code,
          start,
          end: ctx.i,
          value: ctx.str.slice(start, ctx.i),
        };
        // if (children) result.children = children;
        return result;
      } finally {
        if (!found) ctx.i = start;
      }
    }
  };
}
