import splitToHtmlTokens from "./splitToHtmlTokens.js";

export default function readHtmlTokens(str, i = 0) {
  const token = {
    type: "Html",
    content: [],
    start: i,
    end: i,
  };
  for (let t of splitToHtmlTokens(str, i)) {
    token.content.push(t);
    token.end = t.end;
  }
  return token;
}
