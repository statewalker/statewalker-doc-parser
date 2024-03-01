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

/**
 * Tokenizer fences are used as local "end-of-stream"
 * markers for tokenizer methods. Each tokenizer method could add
 * a new fence to the context. If the context reaches a fence then
 * the tokenizer method should handle it as an "end-of-stream" marker.
 *
 * Access to the fences should be done only through the guard method of
 * the TokenizerContext class.
 */
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

  isFenceBoundary = (): boolean => {
    let result: TToken | undefined;
    const ctx = this.context;
    const start = ctx.i;
    if (start >= ctx.length) return true;
    for (let i = this.fences.length - 1; !result && i >= 0; i--) {
      result = this.fences[i](ctx);
      ctx.i = start;
    }
    return result !== undefined;
  };

  reset = (level: number): void => {
    while (this.fences.length > level) {
      this.fences.pop();
    }
  };
}

/**
 * Tokenizer context is used to keep the state of the tokenization process.
 * It provides methods to access the tokenized string and to control
 * the current position in string.
 * Tokenizers should not access the tokenized string directly but through
 * the methods of this class.
 * Each tokenizer method could add a fence to the context. If the context
 * reaches a fence then the tokenizer method should handle it as a local
 * "end-of-stream" marker.
 */
export class TokenizerContext {
  // The tokenized string.
  str: string;

  // The length of the tokenized string.
  get length(): number {
    return this.str.length;
  }

  // Current character position.
  private _i: number = 0;
  get i(): number {
    return this._i;
  }
  set i(value: number) {
    this._i = Math.max(0, Math.min(value, this.str.length));
  }

  // Fences should not be used outside the guard method.
  private fences = new TokenizerFences(this);

  constructor(str: string, i: number = 0) {
    this.str = str;
    this.i = i;
  }

  /**
   * Returns the character at the current position or at the specified shift.
   * @param shift the number of characters to shift from the current position
   * @returns the character at the current position or at the specified shift
   */
  getChar(shift: number = 0): string[1] {
    return this.str[this._i + shift];
  }

  /**
   * Skips all characters for which the given check method returns true. The last position
   * will be the first character for which the check method returns false.
   * @param check the method to check the characters
   * @returns the position of the first character for which the check method returns false
   */
  skipWhile(check: (char: string[1]) => boolean): number {
    const len = this.str.length;
    let i = 0;
    for (i = this._i; i < len && check(this.str[i]); i++) {
      /* */
    }
    this.i = i;
    return this._i;
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
   * All fences added to the context will be reset to the level they had before.
   *
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

  // match(pattern: string): boolean {
  //   for (let i = 0; i < pattern.length; i++) {
  //     if (this.str[this._i + i] !== pattern[i]) return false;
  //   }
  //   return true;
  // }
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
