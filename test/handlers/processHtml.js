export default function* processHtml(tokens, listeners = {
  beginTag(type, attrs, positions = {}) {},
  endTag(positions = {}) {},
  onText(text, positions = {}) {},
}) {
  for (let token of tokens) {
    switch (token.token) {
      case "open" : listeners.beginTag(token.type, token.attrs, token.positions); break;
      case "close" : listeners.endTag(token.type, token.positions); break;
      case "text" : listeners.onText(token.text, token.positions); break;
    }
    yield token;
  }
}