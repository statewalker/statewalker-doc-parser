export default function readHtmlSymbols(str, i = 0) {
  const char = str[i];
  if (char !== '&' && char !== '<' && char !== '>') return ;
  return {
    type : 'HtmlSpecialChar',
    char,
    start : i,
    end : i + 1
  }
}