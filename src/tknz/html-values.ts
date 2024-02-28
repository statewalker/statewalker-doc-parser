import { TToken, TokenizerContext } from "./tokenizer.ts";

export interface TAttributeValueToken extends TToken {
  type: "AttributeValue";
}

export function readAttributeValue(
  ctx: TokenizerContext
): TAttributeValueToken | undefined {
  // ([A-Za-z_\{\}$][-A-Za-z0-9_:\.\{\}$]*?)
  const start = ctx.i;
  let end = start;
  let token : TAttributeValueToken = {
    level: 0,
    type: "AttributeValue",
    start,
    end,
    value : "",
    children: []
  };
  // let code = readCode(str, i);
  // if (code) {
  //   token.value.push(code);
  //   token.end = code.end;
  // } else {
    let quot = ctx.getChar();
    if (quot === '"' || quot === "'") {
      ctx.i++;
    } else {
      quot = "";
    }

    let escaped = false;
    let value = "";
    let textStart = start;
    let textEnd = start;
    const flushText = (i : number) => {
      if (value) {
        token.children.push(ctx.substring(textStart, textEnd));
      }
      value = "";
      textStart = textEnd = i;
    };
    for (flushText(); i < str.length; i++, textEnd++) {
      let char = str[i];
      if (escaped) {
        value += char;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quot) {
        i++;
        break;
      } else {
        if (!quot) {
          let endSpacePos = skipSpaces(str, i);
          if (endSpacePos > i) break;
          if (stopSymbols.indexOf(char) >= 0) break;
        }
        const code = readCode(str, i);
        if (code) {
          flushText();
          token.value.push(code);
          textStart = token.end = code.end;
          // These indexes will be increased at the next cycle
          i = textEnd = token.end - 1;
        } else {
          value += char;
        }
      }
    }
    flushText();
    token.end = i;
  // }
  if (token.end === token.start) return;
  // token.text = str.substring(token.start, token.end);
  return token;
}
