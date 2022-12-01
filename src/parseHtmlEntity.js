export default function parseHtmlEntity(str, i = 0) {
  if (str[i] !== '&') return ;
  const start = i;
  i++;
  const contentStart = i;
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
    entity : str.substring(contentStart, i),
    contentStart,
    contentEnd : i,
    start,
    end : i + 1
  }
}