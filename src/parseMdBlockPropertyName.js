import parseHtmlName from "./parseHtmlName.js";
import skipSpaces from "./skipSpaces.js";

export default function parseMdBlockPropertyName(str, i) {
  const start = i;
  i = skipSpaces(str, i, true);
  const name = parseHtmlName(str, i);
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
