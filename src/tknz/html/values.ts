import {
  type TToken,
  type TTokenizerMethod,
  type TokenizerContext,
  newCompositeTokenizer,
  newCharsReader,
} from "../base/index.ts";

export interface TAttributeValueToken extends TToken {
  type: "HtmlValue";
  quoted: boolean;
  valueStart: number;
  valueEnd: number;
}

export function newQuotedTextReader(
  readToken?: TTokenizerMethod
): TTokenizerMethod {
  return (ctx: TokenizerContext) => {
    const quote = ctx.getChar();
    if (quote !== "'" && quote !== '"' && quote !== "`") return;
    return ctx.guard((fences) => {
      const start = ctx.i;
      fences.addFence(newCharsReader("QuotedText", (char) => char === quote));
      ctx.i++;

      let escaped = false;
      let children: TToken[] | undefined;
      while (ctx.i < ctx.length) {
        const ch = ctx.getChar();
        if (escaped) {
          escaped = false;
        } else if (ch === quote) {
          ctx.i++;
          break;
        } else if (ch === "\\") {
          escaped = true;
        } else if (
          ch !== "<" &&
          ch !== ">" &&
          ch !== "&" &&
          ch !== "/" &&
          ch !== '"' &&
          ch !== "'" &&
          ch !== "`"
        ) {
          if (fences.isFenceBoundary()) {
            break;
          } else if (readToken) {
            const token = readToken(ctx);
            if (token) {
              if (!children) children = [];
              children.push(token);
              ctx.i = token.end;
              continue;
            }
          }
        }
        ctx.i++;
      }
      const end = ctx.i;
      const result: TToken = {
        type: "QuotedText",
        start,
        end,
        value: ctx.substring(start, end),
      };
      if (children) result.children = children;
      return result;
    });
  };
}

export function newHtmlValueReader(
  readToken?: TTokenizerMethod
): TTokenizerMethod<TAttributeValueToken> {
  const tokenizers: TTokenizerMethod[] = [];
  if (readToken) tokenizers.push(readToken);
  const read = newCompositeTokenizer(tokenizers);
  {
    const readQuotedText = newQuotedTextReader(readToken);
    tokenizers.push(readQuotedText);

    tokenizers.push(
      newCharsReader("String", (char) => {
        return !!char.match(/\S/);
      })
    );
  }
  return (ctx: TokenizerContext) => {
    const token = read(ctx);
    if (!token) return;
    const quoted = token.type === "QuotedText";
    const inc = quoted ? 1 : 0;
    return {
      ...token,
      type: "HtmlValue",
      quoted,
      valueStart: token.start + inc,
      valueEnd: token.end - inc,
    } as TAttributeValueToken;
  };
}
