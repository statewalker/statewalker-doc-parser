import _newState from "./_newState.js";
import _getInlineTransitions from "./_getInlineTransitions.js";
import _getBlockTransitions from "./_getBlockTransitions.js";

export default function newHtmlDl() {
  return _newState({
    key: "HtmlDl",
    token: "dl",
    selfClosing: true,
    content: "HtmlDd",
    transitions: [
      ["*", "dt", "HtmlDt"],
      ["*", "dd", "HtmlDd"],
      ["_HtmlDd:before", "*", "HtmlDd"],
    ],
    states: [
      _newState({
        key: "HtmlDt",
        token: "dt",
        selfClosing: true,
        closingTokens: ["dd", "dt:close", "dl", "dl:close"],
        transitions: [
          ..._getInlineTransitions(),
        ]
      }),
      _newState({
        key: "HtmlDd",
        token: "dd",
        selfClosing: true,
        closingTokens: ["dd", "dd:close", "dl", "dl:close"],
        transitions: [
          ..._getInlineTransitions(),
          ..._getBlockTransitions(),
        ]
      }),
    ],
  });
}
