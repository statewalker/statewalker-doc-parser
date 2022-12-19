// InlineElement - styled block (~span + styles; example: bold, em)
// HtmlSpecial - inline elements changing semantic of the content (ex: a, sub, sup, ...)
// HtmlFormElement - form elements can not have othe elements
// 

// InlineLineBreak - end of the line (empty tag)
// InlineElement - image (empty tag)


export const inlineElementsStates = {
  "a" : "HtmlSpecial",
  "abbr" : "HtmlSpecial",
  "acronym" : "HtmlSpecial",
  "b" : "InlineElement",
  "bdo" : "InlineElement",
  "big" : "InlineElement",
  "br" : "InlineLineBreak",
  "button" : "HtmlFormElement",
  "cite" : "HtmlSpecial",
  "code" : "HtmlSpecial",
  "dfn" : "HtmlSpecial",
  "em" : "InlineElement",
  "i" : "InlineElement",
  "img" : "HtmlImage",
  "input" : "HtmlFormElement",
  "kbd" : "HtmlSpecial",
  "label" : "HtmlFormElement",
  "map" : "HtmlSpecial",
  "object" : "HtmlSpecial",
  "output" : "HtmlSpecial",
  "q" : "HtmlQuot",
  "samp" : "HtmlSpecial",
  "script" : "HtmlScript",
  "select" : "HtmlFormElement",
  "small" : "InlineElement",
  "span" : "InlineElement",
  "strong" : "InlineElement",
  "sub" : "HtmlSpecial",
  "sup" : "HtmlSpecial",
  "textarea" : "HtmlFormElement",
  "time" : "HtmlSpecial",
  "tt" : "InlineElement",
  "var" : "HtmlSpecial",
}

export const inlineElements = [
  "a",
  "abbr",
  "acronym",
  "b",
  "bdo",
  "big",
  "br",
  "button",
  "cite",
  "code",
  "dfn",
  "em",
  "i",
  "img",
  "input",
  "kbd",
  "label",
  "map",
  "object",
  "output",
  "q",
  "samp",
  "script",
  "select",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "textarea",
  "time",
  "tt",
  "var",
];

export const inlineTransitions = [
  ["*", "text", "InlineElement"],
  ...inlineElements.map((name) => ["*", name, "InlineElement"]),
];

export default function _getInlineTransitions() {
  return inlineTransitions;
}
