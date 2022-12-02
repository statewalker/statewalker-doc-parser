import iterateHtmlTokens from "./iterateHtmlTokens.js";

export default function parseHtmlTokens(str, i = 0) {
  const token = {
    type: "Html",
    content: [],
    start: i,
    end: i,
  };
  for (let t of iterateHtmlTokens(str, i)) {
    token.content.push(t);
    token.end = t.end;
  }
  return token;
}
