import { getCharType } from "./chars";

export interface TToken extends Record<string, any> {
  type: string;
  value: string;
  start: number;
  end: number;
  children?: TToken[];
}

/**
 * Tokenizer method signature. Each tokenizer method should return a token or "undefined".
 */
export type TTokenizerMethod<T = TToken> = (
  ctx: TokenizerContext
) => T | undefined;

export class TokenizerFences {
  context: TokenizerContext;

  fences: TTokenizerMethod[] = [];

  constructor(context: TokenizerContext) {
    this.context = context;
  }

  get level(): number {
    return this.fences.length;
  }

  addFence = (f: TTokenizerMethod) => {
    this.fences.push(f);
  };

  getFenceToken = (): TToken | undefined => {
    let result: TToken | undefined;
    const ctx = this.context;
    const start = ctx.i;
    for (let i = this.fences.length - 1; !result && i >= 0; i--) {
      result = this.fences[i](ctx);
      ctx.i = start;
    }
    return result;
  };

  reset = (level: number): void => {
    while (this.fences.length > level) {
      this.fences.pop();
    }
  };
}

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
  }

  private fences = new TokenizerFences(this);

  constructor(str: string, i: number = 0) {
    this.str = str;
    this.i = i;
  }

  // match(pattern: string): boolean {
  //   for (let i = 0; i < pattern.length; i++) {
  //     if (this.str[this._i + i] !== pattern[i]) return false;
  //   }
  //   return true;
  // }

  /**
   * Returns the character at the current position or at the specified shift.
   * @param shift the number of characters to shift from the current position
   * @returns the character at the current position or at the specified shift
   */
  getChar(shift: number = 0): string[1] {
    return this.str[this._i + shift];
  }

  /**
   * Skips all characters of the specified type. The last position
   * will be the first character of the next type.
   * @param charType the character type to skip or a combination of types (ex: CHAR_SPACE | CHAR_EOL)
   * @returns the position of the first character of the next type
   */
  skipWhile(charType: number): number {
    const len = this.str.length;
    let i = 0;
    for (i = this._i; i < len && getCharType(this.str, i) & charType; i++) {
      /* */
    }
    this.i = i;
    return this._i;
  }

  /**
   * Skips all characters until the specified type was found (or until the end of
   * the tokenized string). The last position will be the first character of the
   * requested type.
   * @param charType the character type to find or a combination of types (ex: CHAR_SPACE | CHAR_EOL)
   * @returns the position of the first character of the requested type
   */
  skipUntil(charType: number): number {
    const len = this.str.length;
    let i: number = 0;
    for (i = this._i; i < len && !(getCharType(this.str, i) & charType); i++) {
      /* */
    }
    this.i = i;
    return i;
  }

  /**
   * Returns a substring of the tokenized string.
   * @param from  the start position
   * @param to the end position
   * @returns the substring
   */
  substring(from: number, to: number): string {
    return this.str.substring(from, to);
  }

  /**
   * Guards the execution of a tokenizer method.
   * If the method returns "undefined" then the position of the tokenized string
   * will be reset to the initial position.
   * @param f the tokenizer method to guard
   * @returns the result of the tokenizer method - the resulting token or "undefined"
   */
  guard<T = TToken>(
    f: (fences: TokenizerFences) => T | undefined
  ): T | undefined {
    const start = this.i;
    let result: T | undefined;
    const level = this.fences.level;
    try {
      return (result = f(this.fences));
    } finally {
      this.fences.reset(level);
      if (result === undefined) {
        this.i = start;
      }
    }
  }
}

export function newCompositeTokenizer(
  tokenizers: TTokenizerMethod[]
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
