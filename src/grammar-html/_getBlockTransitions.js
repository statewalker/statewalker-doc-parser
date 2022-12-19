export const blockElements = [
  "address",
"article",
"aside",
"blockquote",
"canvas",
"dd",
"div",
"dl",
"dt",
"fieldset",
"figcaption",
"figure",
"footer",
"form",
"h1",
"h2",
"h3",
"h4",
"h5",
"h6",
"header",
"hr",
"li",
"main",
"nav",
"noscript",
"ol",
"p",
"pre",
"section",
"table",
"tfoot",
"ul",
"video"
]

export default function _getBlockTransitions() {
  return [
    ["*", "*", "HtmlParagraph"],
    ["*", "p", "HtmlParagraph"],
    ["*", "blockquot", "HtmlBlockquot"],

    ["*", "hr", "HtmlHr"],

    ["*", "table", "HtmlTable"],
    ["*", "tbody", "HtmlTable"],
    ["*", "thead", "HtmlTable"],
    ["*", "tfoot", "HtmlTable"],
    ["*", "tr", "HtmlTable"],
    ["*", "th", "HtmlTable"],
    ["*", "td", "HtmlTable"],

    ["*", "ul", "HtmlUl"],
    ["*", "ol", "HtmlOl"],
    ["*", "li", "HtmlUl"],

    ["*", "dl", "HtmlDl"],
    ["*", "dt", "HtmlDl"],
    ["*", "dd", "HtmlDl"],
  ];
}
