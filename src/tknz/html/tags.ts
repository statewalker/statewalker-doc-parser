import {
  type TToken,
  type TTokenizerMethod,
  type TokenizerContext,
  newDynamicFencedBlockReader,
} from "../base/index.ts";
import { readHtmlName } from "./names.ts";
import { newHtmlAttributeReader } from "./attributes.ts";

export interface THtmlTagToken extends TToken {
  type: "HtmlTag";
}

export interface THtmlTagStartToken extends TToken {
  type: "HtmlTagStart";
}
function readHtmlTagStart(
  ctx: TokenizerContext
): THtmlTagStartToken | undefined {
  return ctx.guard(() => {
    const start = ctx.i;
    if (ctx.getChar() !== "<") return;
    ctx.i++;
    const name = readHtmlName(ctx);
    if (!name) return;
    const end = name.end;
    return {
      type: "HtmlTagStart",
      start,
      end,
      value: ctx.substring(start, end),
      children: [name],
    };
  });
}

export interface THtmlTagEndToken extends TToken {
  type: "HtmlTagEnd";
  autoclosing: boolean;
}

function readHtmlTagEnd(ctx: TokenizerContext): THtmlTagEndToken | undefined {
  return ctx.guard(() => {
    const start = ctx.i;
    let autoclosing = false;
    const char = ctx.getChar();
    if (char === "/" && ctx.getChar(+1) === ">") {
      autoclosing = true;
      ctx.i += 2;
    } else if (char === ">") {
      ctx.i++;
    } else {
      return undefined;
    }
    const end = ctx.i;
    return {
      type: "HtmlTagEnd",
      start,
      end,
      value: ctx.substring(start, end),
      autoclosing,
    };
  });
}

export function newHtmlTagReader(
  readToken: TTokenizerMethod = () => undefined
): TTokenizerMethod<THtmlTagToken> {
  const readAttribute = newHtmlAttributeReader(readToken);
  const tagReader = newDynamicFencedBlockReader(
    "HtmlTag",
    readHtmlTagStart,
    () =>
      (ctx: TokenizerContext): TToken | undefined => {
        return readToken(ctx) || readAttribute(ctx);
      },
    () => readHtmlTagEnd
  );
  return tagReader as TTokenizerMethod<THtmlTagToken>;
}
