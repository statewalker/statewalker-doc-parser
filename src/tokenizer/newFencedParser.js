import newSequenceParser from "./newSequenceParser.js";
import newSkipParser from "./newSkipParser.js";

export default function newFencedParser(type, begin, end) {
  if (typeof begin === "string") begin = newSequenceParser(begin);
  const skipParser = newSkipParser(type, end);
  return function read(str, i = 0) {
    let delimiter = begin(str, i);
    if (!delimiter) return ;

    const token = skipParser(str, delimiter.end);
    if (!token) return ;
    token.start = i
    return token;
  };
}