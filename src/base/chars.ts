export function isSpace(char: string[1]): boolean {
  const code = char.codePointAt(0) || 0;
  // char.match(Z)
  // Zs (unicode class) || [\t\f\v]
  return (
    (code >= 0x2000 && code <= 0x200a) ||
    code === 0x09 || // '\t'
    code === 0x0b || // '\v'
    code === 0x0c || // '\f'
    code === 0x20 || // ' '
    code === 0xa0 || //
    code === 0x1680 || //
    code === 0x1680 || //
    code === 0x202f || //
    code === 0x205f || //
    code === 0x3000
  ); //
}

export function isEol(char: string[1]): boolean {
  return char === "\r" || char === "\n";
}

export function isSpaceOrEol(char: string[1]): boolean {
  return isSpace(char) || isEol(char);
}
