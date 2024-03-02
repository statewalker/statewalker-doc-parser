import {
  type TToken,
  type TTokenizerMethod,
  type TokenizerContext,
  newDynamicFencedBlockReader,
  isolate,
  isSpace,
  isSpaceOrEol,
} from "../base/index.ts";
import { readHtmlName } from "./names.ts";
import { newHtmlAttributeReader } from "./attributes.ts";

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

export interface THtmlOpenTagToken extends TToken {
  type: "HtmlOpenTag";
  autoclosing: boolean;
}

export function newHtmlOpenTagReader(
  readToken: TTokenizerMethod = () => undefined
): TTokenizerMethod<THtmlOpenTagToken> {
  const readAttribute = newHtmlAttributeReader(readToken);
  const readOpenTag = newDynamicFencedBlockReader(
    "HtmlOpenTag",
    readHtmlTagStart,
    () =>
      (ctx: TokenizerContext): TToken | undefined => {
        return readToken(ctx) || readAttribute(ctx);
      },
    () => readHtmlTagEnd
  );
  return (ctx: TokenizerContext): THtmlOpenTagToken | undefined => {
    const token = readOpenTag(ctx);
    if (!token) return;
    const nameToken = token.startToken.children?.[0];
    if (!nameToken) return;
    nameToken.type = "HtmlTagName";
    const closingToken = token.endToken;
    const autoclosing = !!closingToken?.autoclosing;
    const children = [nameToken];
    if (token.children) children.push(...token.children);
    return {
      type: "HtmlOpenTag",
      start: token.start,
      end: token.end,
      value: token.value,
      autoclosing,
      children,
    } as THtmlOpenTagToken;
  };
}

export interface THtmlCloseTagToken extends TToken {
  type: "HtmlCloseTag";
}

export function newHtmlCloseTagReader(): TTokenizerMethod<THtmlCloseTagToken> {
  return (ctx: TokenizerContext): THtmlCloseTagToken | undefined => {
    return ctx.guard(() => {
      const start = ctx.i;
      if (ctx.getChar(+0) !== "<" || ctx.getChar(+1) !== "/") return;
      ctx.i += 2;
      const name = readHtmlName(ctx);
      if (!name) return;
      ctx.skipWhile(isSpaceOrEol);
      if (ctx.getChar() !== ">") return;
      ctx.i++;
      const end = ctx.i;
      return {
        type: "HtmlCloseTag",
        start,
        end,
        value: ctx.substring(start, end),
        children: [name],
      };
    });
  };
}
