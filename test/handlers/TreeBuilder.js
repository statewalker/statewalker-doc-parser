
export const ENTITIES = {
  'amp': '&',
  'apos': '\'',
  'lt': '<',
  'gt': '>',
  'quot': '"',
  // 'nbsp': '\xa0'
};
export const ENTITY_PATTERN = /&([a-zA-Z_]+|#\d+);/ig;

export function decodeHTML(text) {
  // A single replace pass with a static RegExp is faster than a loop
  return text.replace(ENTITY_PATTERN, function (match, entity) {
    let result = ENTITIES[entity.toLowerCase()];
    if (!result) {
      if (entity[0] === '#') {
        result = String.fromCharCode(+entity.substring(1));
      } else {
        result = match;
      }
    }
    return result;
  });
}

export default class TreeBuilder {

  static parse(parser, str) {
    const builder = new TreeBuilder();
    parser(str, builder);
    return builder.result;
  }

  constructor() {
    this._peek = this._tree = { };
    this._stack = [this._peek];
    this._text = '';
  }

  get result() { return this.tree; }

  get tree() {
    this._flushText();
    const root = this._tree.children && this._tree.children.length === 1
      ? this._tree.children[0]
      : this._tree
    return root;
  }

  _flushText() {
    if (!this._text) return;
    // const text = decodeHTML(this._text);
    const text = this._text;
    (this._peek.children = this._peek.children || []).push(text);
    this._text = '';
  }

  beginTag(type, attrs) {
    this._flushText();
    const peek = { type };
    (this._peek.children = this._peek.children || []).push(peek);
    this._peek = peek;
    if (Object.keys(attrs).length) {
      this._peek.attrs = {};
      for (let [key, value] of Object.entries(attrs)) {
        key = this._unescapeAttr(key);
        value = this._unescape(value);
        this._peek.attrs[key] = value;
      }
    }
    this._stack.push(this._peek);
  }

  _unescapeAttr(value) {
    if (!value) return value;
    return this._unescape(value.replace(/%3A/gim, '\\'));
  }

  _unescape(value) {
    if (typeof value !== 'string') return value;
    return value.replace()
      .replace(/\\n/gim, '\n')
      .replace(/\\r/gim, '\r')
      .replace(/\\\\/gim, '\\');
  }

  endTag() {
    this._flushText();
    this._stack.pop();
    this._peek = this._stack[this._stack.length - 1];
  }

  onText(str) {
    this._text += str;
  }

}

export function newTreeBuilder(options) {
  const { parse } = options;
  return (string) => TreeBuilder.parse(parse, string);
}

export function visitTree(tree, handler) {
  visit(tree);
  return handler.result;

  function visit(node) {
    if (typeof node !== 'object') return handler.onText(node);
    const { type, attrs = {}, children } = node;
    handler.beginTag(type, attrs);
    children && children.forEach(visit);
    handler.endTag();
  }
}