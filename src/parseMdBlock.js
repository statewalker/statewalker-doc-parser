import parseMdBlockProperty from "./parseMdBlockProperty.js";
 
export default function parseMdBlock(str, i) {
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
