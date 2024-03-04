import { newDynamicFencedBlockReader } from "../base/blocks.ts";
import { isSpaceOrEol } from "../base/chars.ts";
import {
  type TToken,
  type TTokenizerMethod,
  type TokenizerContext,
} from "../base/tokenizer.ts";
import { newHtmlAttributeReader } from "./attributes.ts";
import { readHtmlName } from "./names.ts";

export interface THtmlTagStartToken extends TToken {
  type: "HtmlTagStart";
  tagName: string;
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
      tagName: name.value,
    };
  });
}

export interface THtmlTagEndToken extends TToken {
  type: "HtmlTagEnd";
  autoclosing: boolean;
}

export function isHtmlTagEndToken(token?: TToken): token is THtmlTagEndToken {
  if (!token) return false;
  return token.type === "HtmlTagEnd";
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
  tagName: string;
}

export function isHtmlOpenTagToken(token?: TToken): token is THtmlOpenTagToken {
  if (!token) return false;
  return token.type === "HtmlOpenTag";
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
  ) as TTokenizerMethod<THtmlOpenTagToken>;

  return (ctx: TokenizerContext) => {
    const token = readOpenTag(ctx);
    if (!token) return;
    // Pull up the "tagName" and "autocolsing" fields from the children
    const children = token.children || [];
    const startToken: TToken = children[0] as TToken;
    token.tagName = startToken.tagName;
    const endToken = children[children.length - 1];
    token.autoclosing = isHtmlTagEndToken(endToken) && endToken.autoclosing;
    return token;
  };
}

export interface THtmlCloseTagToken extends TToken {
  type: "HtmlCloseTag";
  tagName: string;
}
export function isHtmlCloseTagToken(
  token?: TToken
): token is THtmlCloseTagToken {
  if (!token) return false;
  return token.type === "HtmlCloseTag";
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
        tagName: name.value,
      };
    });
  };
}
