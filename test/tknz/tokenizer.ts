import { EOS, getCharType } from "./chars";

/**
 * Levels:
 * - 0: char - individual symbols
 * - 1: gram - sequence of symbols (normally - "tokens" in parsers)
 * - 2: word - meaningful combination of n-grams (ex: tag names like "svg:text")
 * - 3: block - sequence of words forming an independent block of text.
 *
 * Tokenizers for each level SHOULD use only tokenizers of lower levels.
 * Ex: A tokenizer function recognizing words can use individual characters
 * or n-grams.
 * If a tokenizer from the lower level returns a tokens of the same level or higher
 * than the current tokenizer then it should interpret this token as the "end of flow"
 * token and return the unterminated token or "undefined".
 */
export enum TTokenLevel {
  char = 0,
  gram = 1,
  word = 2,
  block = 3,
  sys = 1000,
}

export interface TToken extends Record<string, any> {
  level: TTokenLevel;
  type: string;
  value: string;
  start: number;
  end: number;
  children?: TToken[];
}

export interface TCharToken extends TToken {
  type: "Char";
  charType: number;
}
function getCharToken(str: string, i: number): TCharToken {
  const charType = getCharType(str, i);
  const value = charType !== EOS ? str[i] : "";
  const start = i;
  const end = i + value.length;
  return {
    type: "Char",
    level: TTokenLevel.char,
    charType,
    value,
    start,
    end,
  };
}

/**
 * Tokenizer method signature. Each tokenizer method should return a token or "undefined".
 */
export type TTokenizerMethod = (ctx: TokenizerContext) => TToken | undefined;

export class TokenizerContext {
  str: string;

  get length(): number {
    return this.str.length;
  }

  private _i: number = 0;
  get i(): number {
    return this._i;
  }
  set i(value: number) {
    this._i = Math.max(0, Math.min(value, this.str.length));
    this._char = getCharToken(this.str, this._i);
  }

  private _char: TCharToken;
  get char(): TCharToken {
    return this._char;
  }

  constructor(str: string, i: number = 0) {
    this.str = str;
    this._char = getCharToken(str, str.length);
    this.i = i;
  }

  match(pattern: string): boolean {
    for (let i = 0; i < pattern.length; i++) {
      if (this.str[this._i + i] !== pattern[i]) return false;
    }
    return true;
  }

  getChar() {
    return this.char.value;
  }

  /**
   * Skips all characters of the specified type. The last position
   * will be the first character of the next type.
   * @param charType the character type to skip or a combination of types (ex: CHAR_SPACE | CHAR_EOL)
   * @returns this - returns the context for chaining
   */
  skipWhile(charType: number): this {
    for (; this.i < this.length && this.char.charType & charType; this.i++) {
      /* */
    }
    return this;
  }

  /**
   * Skips all characters until the specified type was found (or until the end of
   * the tokenized string). The last position will be the first character of the
   * requested type.
   * @param charType the character type to find or a combination of types (ex: CHAR_SPACE | CHAR_EOL)
   * @returns this - returns the context for chaining
   */
  skipUntil(charType: number): this {
    for (; this.i < this.length && !(this.char.charType & charType); this.i++) {
      /* */
    }
    return this;
  }

  resetTo(token: TToken) {
    this.i = token.start;
  }
  resetBefore(token: TToken) {
    this.i = Math.max(token.start - 1, 0);
  }
  substring(from: number, to: number): string {
    return this.str.substring(from, to);
  }
}

export function newCompositeTokenizer(
  ...tokenizers: TTokenizerMethod[]
): TTokenizerMethod {
  return (ctx: TokenizerContext): TToken | undefined => {
    let result: TToken | undefined;
    const start = ctx.i;
    for (let i = 0; i < tokenizers.length; i++) {
      result = tokenizers[i](ctx);
      if (result) {
        break;
      }
      ctx.i = start;
    }
    return result;
  };
}
