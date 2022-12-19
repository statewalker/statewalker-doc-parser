import _newState from "./_newState.js";
import _getBlockTransitions from "./_getBlockTransitions.js";

export default function newHtmlBody() {
  return _newState({
    key: "HtmlBody",
    token: "body",
    transitions : [
      ..._getBlockTransitions()
    ]
  });
}
