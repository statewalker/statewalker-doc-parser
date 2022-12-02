import parseMdBlockProperty from "./parseMdBlockProperty.js";

// import skipSpaces from "./skipSpaces.js";
export default function parseMdBlockProperties(str, i) {
  const start = i;
  let properties;
  while (i < str.length) {
    const property = parseMdBlockProperty(str, i);
    if (!property) break;
    properties = properties || [];
    properties.push(property);
    i = property.end;
  }
  if (!properties) return ;

  return {
    type : "MdBlockProperties",
    properties,
    start,
    end : i
  }
}
