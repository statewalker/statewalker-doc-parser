import readCode from "./readCode.js";
import skipSpaces from "./skipSpaces.js";

export default function readAttributeValue(str, i = 0, stopSymbols = ['/', '<', '>']) {
  const start = i;
  let token = {
    type: "AttributeValue",
    value: [],
    start,
    end: i,
  };
  // let code = readCode(str, i);
  // if (code) {
  //   token.value.push(code);
  //   token.end = code.end;
  // } else {
    let quot = str[i];
    if (quot === '"' || quot === "'") {
      i++;
    } else {
      quot = "";
    }

    let escaped = false;
    let value = "";
    let textStart = i;
    let textEnd = i;
    const flushText = () => {
      if (value) {
        token.value.push(str.substring(textStart, textEnd));
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
