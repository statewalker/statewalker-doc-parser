import _newState from "./_newState.js";
import _getInlineTransitions from "./_getInlineTransitions.js";
import _getBlockTransitions from "./_getBlockTransitions.js";

export default function newHtmlTable() {
  return _newState({
    key: "HtmlTable",
    token: "table",
    content: "HtmlTableBody",
    transitions: [
      ["", "thead", "HtmlTableHead"],
      // ["", "tfoot", "HtmlTableFoot"],
      ["_HtmlTable:before", "thead", "HtmlTableHead"],
      ["_HtmlTable:before", "table:close", "HtmlTableBody"],
      ["_HtmlTable:before", "*", "HtmlTableBody"],

      ["HtmlTableHead", "*", "HtmlTableBody"],
      ["HtmlTableBody", "tfoot", "HtmlTableFoot"],
    ],
    states: [
      _newState({
        key: "HtmlTableHead",
        token: "thead",
        content: "_HtmlTableRows",
        closingTokens: ["tbody", "tfoot", "table:close"],
        transitions: [
          ["*", "*", "_HtmlTableRows"],
        ],
      }),
      _newState({
        key: "HtmlTableBody",
        token: "tbody",
        content: "_HtmlTableRows",
        closingTokens: ["table:close", "tfoot"],
        transitions: [
          ["*", "*", "_HtmlTableRows"],
        ],
      }),
      _newState({
        key: "HtmlTableFoot",
        token: "tfoot",
        content: "_HtmlTableRows",
        closingTokens: ["table:close"],
        transitions: [
          ["*", "*", "_HtmlTableRows"],
        ],
      }),
      _newState({
        key: "_HtmlTableRows",
        content: "HtmlTableRow",
        transitions: [
          ["*", "tr", "HtmlTableRow"],
        ],
      }),
      _newState({
        key: "HtmlTableRow",
        token: "tr",
        selfClosing: true,
        content: "HtmlTableDCell",
        closingTokens: [
          "thead",
          "thead:close",
          "tbody",
          "tbody:close",
          "tfoot",
          "tfoot:close",
          "table",
          "table:close",
        ],
        transitions: [
          ["_HtmlTableRow:before", "th", "HtmlTableHCell"],

          ["*", "th", "HtmlTableHCell"],
          ["*", "td", "HtmlTableDCell"],
          ["", "*", "HtmlTableDCell"],
        ],
        states: [
          _newState({
            key: "HtmlTableHCell",
            token: "th",
            content: "_HtmlTableCell",
          }),
          _newState({
            key: "HtmlTableDCell",
            token: "td",
            content: "_HtmlTableCell",
          }),
          _newState({
            key: "_HtmlTableCell",
            tokens: ["th", "td"],
            selfClosing: true,
            content: "_HtmlTableCellContent",
            closingTokens: [
              "tr",
              "tr:close",
              "thead",
              "thead:close",
              "tbody",
              "tbody:close",
              "tfoot",
              "tfoot:close",
              "table",
              "table:close",
            ],
            transitions: [
              ["*", "*", "_HtmlTableCellContent"],
            ],
            states: [
              _newState({
                key: "_HtmlTableCellContent",
                closingTokens: [
                  "td",
                  "td:close",
                  "th",
                  "th:close",
                  "tr",
                  "tr:close",
                  "thead",
                  "thead:close",
                  "tbody",
                  "tbody:close",
                  "tfoot",
                  "tfoot:close",
                  "table",
                  "table:close",
                ],
                transitions: [
                  ..._getInlineTransitions(),
                  ..._getBlockTransitions(),
                ]
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
