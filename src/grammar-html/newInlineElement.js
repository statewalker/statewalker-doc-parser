import _newState from "./_newState.js";

export default function newInlineElement() {
  return _newState({
    key: "InlineElement",
    tokens: ["span", "em", "i", "strong", "b", "img"],
    // content: "Text",
    transitions: [
      ["", "text", "Text"],
      ["*", "text", "Text"],
    ],
  });
}
