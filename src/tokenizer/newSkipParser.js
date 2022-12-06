import newSequenceParser from "./newSequenceParser.js";
import readCode from "./readCode.js";

export default function newSkipParser(type, end) {
  if (typeof end === "string") {
    end = newSequenceParser(end);
  }
  return function (str, i = 0) {
    const start = i;
    let text = "";
    let contentStart = i;
    let contentEnd = i;

    let escaped = false;
    const content = [];
    const flushText = () => {
      if (text) {
        content.push(text);
      }
      text = "";
    };
    const isFinished = () => {
      const delimiter = end(str, i);
      if (!delimiter) {
        return false;
      }
      i = delimiter.end;
      return true;
    };

    for (const len = str.length; i < len; i++) {
      const ch = str[i];
      if (escaped) {
        escaped = false;
        text += ch;
      } else if (ch === "\\") {
        escaped = true;
      } else if (isFinished()) {
        break;
      } else {
        let token = readCode(str, i);
        if (token) {
          flushText();
          i = token.end;
          contentEnd = i; // Required!
          content.push(token);
          if (isFinished()) {
            break;
          }
        } else {
          text += ch;
        }
      }
      contentEnd = i + 1;
    }
    flushText();
    return {
      type,
      content,
      contentStart,
      contentEnd,
      start,
      end: i,
    };
  };
}
