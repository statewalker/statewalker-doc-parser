import _newState from "./_newState.js";
import _getInlineTransitions from "./_getInlineTransitions.js";

export default function newHtmlHeaders() {
  return _newState({
    key: "HtmlHeader",
    tokens: ["h1", "h2", "h3", "h4", "h5", "h6"],
    selfClosing: true,
    transitions: [
      ..._getInlineTransitions(),
    ]
  });
}
