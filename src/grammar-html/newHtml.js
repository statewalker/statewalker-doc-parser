import newHtmlDl from "./newHtmlDl.js";
import newHtmlUl from "./newHtmlUl.js";
import newHtmlOl from "./newHtmlOl.js";
import newHtmlTable from "./newHtmlTable.js";
import newHtmlParagraph from "./newHtmlParagraph.js";
import newHtmlBody from "./newHtmlBody.js";
import newHtmlHead from "./newHtmlHead.js";
import newInlineElement from "./newInlineElement.js";
import _newState from "./_newState.js";

export default function newHtml() {
  return _newState({
    key: "HtmlDocument",
    token: "html",
    transitions: [
      ["", "head", "HtmlHead"],
      ["", "body", "HtmlBody"],
      ["HtmlHead", "*", "HtmlBody"],
      ["HtmlBody", "*", ""],
    ],
    states: [
      newHtmlHead(),
      newHtmlBody(),

      // Lists
      newHtmlUl(),
      newHtmlOl(),
      newHtmlDl(),

      // Table
      newHtmlTable(),

      // Other block-level elements
      newHtmlParagraph(),

      // Inline elements
      newInlineElement(),
    ],
  });
}
