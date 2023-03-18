import readMdBlockProperty from "./readMdBlockProperty.js";
 
export default function readMdBlock(str, i) {
  const start = i;
  let properties;
  while (i < str.length) {
    const property = readMdBlockProperty(str, i);
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
