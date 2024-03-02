import {
  type TToken,
  type TTokenizerMethod,
  type TokenizerContext,
} from "../base/index.ts";

export interface TCodeToken extends TToken {
  type: "Code";
  codeStart: number;
  codeEnd: number;
}

export function newCodeReader(
  readToken: TTokenizerMethod = () => undefined
): TTokenizerMethod {
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

        let children: TToken[] | undefined = undefined;
        let escaped = false;
        let quot = null;
        function updateToken(loadToken: TTokenizerMethod): boolean {
          const token = loadToken(ctx);
          if (!token) return false;
          children = children || [];
          children.push(token);
          ctx.i = codeEnd = token.end;
          return true;
        }
        while (ctx.i < ctx.length) {
          const ch = ctx.getChar();
          if (escaped) {
            escaped = false;
          } else if (ch === "\\") {
            escaped = true;
          } else if (
            // ch === '"' ||
            // ch === "'" ||
            ch === "`"
          ) {
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
              codeEnd = ctx.i;
              ctx.i++;
              break;
            } else {
              depth--;
            }
          } else {
            if (quot === "`" && ch === "$") {
              if (updateToken(read)) {
                continue;
              }
            } else if (fences.isFenceBoundary()) {
              break;
            } else if (updateToken(readToken)) {
              continue;
            }
          }
          ctx.i++;
          codeEnd++;
        }
        const result: TCodeToken = {
          type: "Code",
          codeStart,
          codeEnd,
          start,
          end: ctx.i,
          value: ctx.str.slice(start, ctx.i),
        };
        if (children) result.children = children;
        return result;
      });
    }
  };
}
