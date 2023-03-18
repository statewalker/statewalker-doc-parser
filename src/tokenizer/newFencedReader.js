import newSequenceReader from "./newSequenceReader.js";
import newSkipReader from "./newSkipReader.js";

export default function newFencedReader(type, begin, end) {
  if (typeof begin === "string") begin = newSequenceReader(begin);
  const skipParser = newSkipReader(type, end);
  return function read(str, i = 0) {
    let delimiter = begin(str, i);
    if (!delimiter) return ;

    const token = skipParser(str, delimiter.end);
    if (!token) return ;
    token.start = i
    return token;
  };
}