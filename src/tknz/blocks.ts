import { newCodeReader } from "./code-blocks.ts";
import { newNgramsReader } from "./ngrams.ts";
import { TTokenizerMethod, newCompositeTokenizer } from "./tokenizer.ts";

export function newNgramsWithCode() {
  const list: TTokenizerMethod[] = [];
  const readNgrams = newNgramsReader(list);
  const readCode = newCodeReader(readNgrams);
  // We add the code reader to the same list of tokenizers
  // as used in the code reader itself. It allows to the code reader
  // to read nested code tokens.
  list.unshift(readCode);
  return newCompositeTokenizer([readCode, readNgrams]);
}
