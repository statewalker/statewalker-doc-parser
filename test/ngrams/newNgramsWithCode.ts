import { newCodeReader } from "../../src/code/code.ts";
import {
  type TTokenizerMethod,
  newCompositeTokenizer,
  newCharsReader,
} from "../../src/base/index.ts";

export function newNgramsWithCode() {
  return newCompositeTokenizer([
    newCodeReader(),
    newCharsReader(
      "Punctuation",
      (char) => !!char.match(/\p{P}/u) || char === "`"
    ),
    newCharsReader("Digits", (char) => !!char.match(/[0-9]/u)),
    newCharsReader("Text", (char) => !!char.match(/\w/u)),
    newCharsReader("Eol", (char) => !!char.match(/[\r\n]/u)),
    newCharsReader(
      "Space",
      (char) => !!char.match(/\s/u) && !char.match(/[\r\n]/u)
    ),
  ]);
}
