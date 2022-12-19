import _newState from "./_newState.js";

export default function newHtmlHead() {
  return _newState({
    key: "HtmlHead",
    token : "thead",
    content : "_Ignore",
    transitions: [
      ["", "*", "_Ignore"],
      ["*", "space", "_Ignore"],
      ["*", "text", "_Ignore"],

      ["*", "link", "HtmlLink"],
      ["*", "script", "HtmlScript"],
      ["*", "meta", "HtmlMeta"],
      ["*", "style", "HtmlStyle"],
    ],
  });
}
