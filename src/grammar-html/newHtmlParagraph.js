import _newState from "./_newState.js";
import _getInlineTransitions from "./_getInlineTransitions.js";

export default function newHtmlParagraph() {
  return _newState({
    key: "HtmlParagraph",
    token: "p",
    // content : "Text"
    transitions: [
      ..._getInlineTransitions(),
    ],
  });
}
