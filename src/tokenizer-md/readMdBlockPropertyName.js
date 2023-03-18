import readAttributeName from "../tokenizer/readAttributeName.js";
import skipSpaces from "../tokenizer/skipSpaces.js";

export default function readMdBlockPropertyName(str, i) {
  const start = i;
  i = skipSpaces(str, i, true);
  const name = readAttributeName(str, i);
  if (!name)
    return;
  i = name.end;
  i = skipSpaces(str, i, true);

  if (str[i] !== ":")
    return;
  i++;
  i = skipSpaces(str, i, true);

  return {
    type: "MdBlockPropertyName",
    name: name.name,
    nameStart: name.start,
    nameEnd: name.end,
    start,
    end: i,
  };
}
