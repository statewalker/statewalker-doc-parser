import { TToken, TTokenizerMethod, TokenizerContext } from "./tokenizer.ts";

export interface TCodeToken extends TToken {
  type: "Code";
  codeStart: number;
  codeEnd: number;
  code: (TToken | string)[];
}

export function newCodeReader(readToken: TTokenizerMethod = () => undefined): TTokenizerMethod {
  return function readCode(ctx: TokenizerContext): TCodeToken | undefined {
    return read();

    function read(): TCodeToken | undefined {
      let depth = 0;
      if (ctx.getChar(+0) !== "$" || ctx.getChar(+1) !== "{") return;
      return ctx.guard((fences) => {
        const start = ctx.i;
        ctx.i += 2;

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
        function updateToken(loadToken: TTokenizerMethod): boolean {
          const previousPos = ctx.i;
          const token = loadToken(ctx);
          if (!token) return false;
          flushText(previousPos);
          code.push(token);
          children = children || [];
          children.push(token);
          ctx.i = codeEnd = textStart = token.end;
          return true;
        }
        while (ctx.i < ctx.length) {
          const ch = ctx.getChar();
          if (escaped) {
            escaped = false;
          } else if (ch === "\\") {
            escaped = true;
          } else if (ch === '"' || ch === "'" || ch === "`") {
            if (quot) {
              if (ch === quot) {
                quot = "";
              }
            } else {
              quot = ch;
            }
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
          } else {
            if (quot === "`" && ch === "$") {
              if (updateToken(read)) {
                continue;
              }
            } else {
              if (fences.getFenceToken()) {
                break;
              }
              if (updateToken(readToken)) {
                continue;
              }
            }
          }
          ctx.i++;
          codeEnd++;
        }
        flushText(ctx.i);
        const result: TCodeToken = {
          type: "Code",
          codeStart,
          codeEnd,
          code,
          start,
          end: ctx.i,
          value: ctx.str.slice(start, ctx.i),
        };
        // if (children) result.children = children;
        return result;
      });
    }
  };
}
