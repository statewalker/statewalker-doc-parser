export function serializeCode(token) {
  const list = (token.code || []).map((v) =>
    typeof v === "string" ? v : serializeCode(v)
  );
  return list.join("");
}

export default function* transformHtmlTokens(tokens) {
  for (let token of tokens) {
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
        yield { token: "open", type, attrs, positions };
      }
      if (closing) {
        yield { token: "close", type, positions };
      }
    } else if (token.type === "Text") {
      yield { token: "text", text: token.text, positions };
    } else if (token.type === "HtmlEntity") {
      Object.assign(positions, {
        entity: [token.entityStart, token.entityEnd],
      });
      yield { token: "text", text: `&${token.entity};`, positions };
    } else if (token.type === "Code") {
      Object.assign(positions, {
        code: [token.codeStart, token.codeEnd],
      });
      const code = serializeCode(code);
      const type = "script";
      yield {
        token: "open", type, attrs: {
          type: "javascript/inner-code", // FIXME:
        }, positions
      };
      yield { token: "text", text: code, positions: positions.code };
      yield { token: "close", type, positions };
    }
  }
}
