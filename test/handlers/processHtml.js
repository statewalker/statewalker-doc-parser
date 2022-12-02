export default function* processHtml(tokens, listeners = {
  beginTag(type, attrs, positions = {}) {},
  endTag(positions = {}) {},
  onText(text, positions = {}) {},
}) {
  for (let token of tokens) {
    // TODO: add code blocks
    // TODO: add HTML entities
    const positions = [token.start, token.end];
    if (token.type === "HtmlTag") {
      Object.assign(positions, { name: [token.nameStart, token.nameEnd] });
      const type = token.name;
      const closing = token.closing;
      const opening = token.opening;
      if (opening) {
        let attrs = token.attributes.reduce((index, t) => {
          const list = t.value || [];
          index[t.name] = list.length > 1 ? list : list[0];
          return index;
        }, {});
        positions.attributes = token.attributes.map((t) => [t.start, t.end]);
        listeners.beginTag(type, attrs, positions);
      }
      if (closing) {
        listeners.endTag(positions);
      }
    } else if (token.type === "Text") {
      listeners.onText(token.text, positions);
    } else if (token.type === "HtmlEntity") {
      Object.assign(positions, {
        entity: [token.entityStart, token.entityEnd],
      });
      token.onText(`&${token.entity};`, positions);
    } else if (token.type === "Code") {
      Object.assign(positions, {
        code: [token.codeStart, token.codeEnd],
      });
      const code = serializeCode(code);
      listeners.beginTag("script", {
        type: "code",
      }, positions);
      listeners.onText(code, positions.code);
      listeners.endTag(positions);
    }
    yield token;
  }
}

function serializeCode(token) {
  const list = (token.code || []).map((v) =>
    typeof v === "string" ? v : serializeCode(v)
  );
  return list.join("");
}
