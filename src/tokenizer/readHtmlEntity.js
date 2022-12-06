export default function readHtmlEntity(str, i = 0) {
  if (str[i] !== '&') return ;
  const start = i;
  i++;
  const entityStart = i;
  if (str[i] === '#') i++;
  for (; i < str.length; i++) {
    const char = str[i];
    if (
      'A' <= char && char <= 'Z' || 
      'a' <= char && char <= 'z' || 
      '0' <= char && char <= '9' || 
      char === '_'
    ) continue;
    break;
  }
  if (str[i] !== ';') return ;
  return {
    type : 'HtmlEntity',
    entity : str.substring(entityStart, i),
    entityStart,
    entityEnd : i,
    start,
    end : i + 1
  }
}