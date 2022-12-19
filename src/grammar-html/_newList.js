import _newState from "./_newState.js";
import _getInlineTransitions from "./_getInlineTransitions.js";
import _getBlockTransitions from "./_getBlockTransitions.js";

export default function _newList(key, token) {
  return _newState({
    key,
    token,
    selfClosing: true,
    transitions: [
      ["", "li", "HtmlLi"],
      ["*", "li", "HtmlLi"],
    ],
    states: [
      _newState({
        key: "HtmlLi",
        token: "li",
        selfClosing: true,
        closingTokens: [token, `${token}:close`],
        transitions: [
          ..._getInlineTransitions(),
          ..._getBlockTransitions()
        ],
      }),
    ],
  });
}
