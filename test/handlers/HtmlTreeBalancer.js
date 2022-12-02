
export default class HtmlTreeBalancer {

  static parse(parser, str) {
    const builder = new HtmlTreeBalancer();
    parser(str, builder);
    return builder.result;
  }

}