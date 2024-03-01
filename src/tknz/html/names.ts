import { type TToken, type TokenizerContext } from "../base/index.ts";

export interface THtmlNameToken extends TToken {
  type: "HtmlName";
  name: string;
}

export function readHtmlName(
  ctx: TokenizerContext
): THtmlNameToken | undefined {
  // ([A-Za-z_\{\}$][-A-Za-z0-9_:\.\{\}$]*?)
  const start = ctx.i;
  let escaped = false;
  let name = "";
  const re = /^\p{L}/u;
  for (; ctx.i < ctx.length; ctx.i++) {
    const char = ctx.getChar();
    const i = ctx.i;
    if (escaped) {
      name += char;
    } else if (char === "\\") {
      escaped = true;
      continue;
    } else if (
      (char >= "A" && char <= "A") ||
      (char >= "a" && char <= "z") ||
      (i > start &&
        ((char >= "0" && char <= "9") ||
          char === "-" ||
          char === "." ||
          (char === ":" &&
            i < ctx.length - 1 &&
            !/^[\s="'`]/.test(ctx.getChar(+1) || "")))) ||
      char === "_" ||
      char === "$" ||
      // char === "{" ||
      // char === "}" ||
      // (char === "$" && ctx.getChar(+1) !== "{") ||
      re.test(char)
    ) {
      name += char;
    } else {
      break;
    }
  }

  const i = ctx.i;
  if (i === start) return;
  return {
    type: "HtmlName",
    name,
    start,
    end: i,
    value: ctx.substring(start, i),
  };
}
