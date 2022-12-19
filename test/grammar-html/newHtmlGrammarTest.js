import expect from "expect.js";
import { newSyncProcess } from "@statewalker/fsm";
import _addExitTransitions from "../../src/grammar-html/_addExitTransitions.js";
import newHtml from "../../src/grammar-html/newHtml.js";

describe("newHtml - grammar", () => {
  function newProcessTest(config, showHidden = false) {
    config = _addExitTransitions(config);

    let traces = [];
    const fullTraces = [];
    let process;

    const print = (msg) => {
      if (!process.current) return;
      let shift = "";
      if (showHidden || (process.current.key[0] !== "_")) {
        for (let i = 0; i <= process.stack.length; i++) {
          if (
            process.stack[i] && (!showHidden && process.stack[i].key[0] === "_")
          ) continue;
          shift += "  ";
        }
        traces.push(shift + msg);
      }

      shift = "";
      for (let i = 0; i <= process.stack.length; i++) {
        shift += "  ";
      }
      fullTraces.push(shift + msg);
    };

    process = newSyncProcess({
      config,
      before: ({ current: state, event }) => {
        const { key, ...options } = event;
        print(`<${state.key} event='${key}'>`);
      },
      after: ({ current: state }) => {
        print(`</${state.key}>`);
      },
    });

    return (type, control) => {
      process.dispatch({ key: type });
      try {
        expect(traces).to.eql(control);
      } catch (error) {
        console.log(JSON.stringify(fullTraces, null, 2));
        console.log(traces.map((v) => `"${v}",`).join("\n"));
        throw error;
      } finally {
        traces = [];
      }
    };
  }

  it(`should iterate over states and perform required state transitions`, async () => {
    const test = newProcessTest(newHtml());

    test("head", [
      "  <HtmlDocument event='head'>",
      "    <HtmlHead event='head'>",
    ]);
    test("link", [
      "      <HtmlLink event='link'>",
    ]);
    test("script", [
      "      </HtmlLink>",
      "      <HtmlScript event='script'>",
    ]);
    test("style", [
      "      </HtmlScript>",
      "      <HtmlStyle event='style'>",
    ]);

    test("p", [
      "      </HtmlStyle>",
      "    </HtmlHead>",
      "    <HtmlBody event='p'>",
      "      <HtmlParagraph event='p'>",
    ]);

    test("text", [
      "        <InlineElement event='text'>",
      "          <Text event='text'>",
    ]);

    test("table", [
      "          </Text>",
      "        </InlineElement>",
      "      </HtmlParagraph>",
      "      <HtmlTable event='table'>",
    ]);
    test("thead", [
      "        <HtmlTableHead event='thead'>",
    ]);

    test("td", [
      "          <HtmlTableRow event='td'>",
      "            <HtmlTableDCell event='td'>",
    ]);
    test("text", [
      "              <InlineElement event='text'>",
      "                <Text event='text'>",
    ]);

    test("tbody", [
      "                </Text>",
      "              </InlineElement>",
      "            </HtmlTableDCell>",
      "          </HtmlTableRow>",
      "        </HtmlTableHead>",
      "        <HtmlTableBody event='tbody'>",
    ]);
    test("td", [
      "          <HtmlTableRow event='td'>",
      "            <HtmlTableDCell event='td'>",
    ]);
    test("text", [
      "              <InlineElement event='text'>",
      "                <Text event='text'>",
    ]);

    test("tr", [
      "                </Text>",
      "              </InlineElement>",
      "            </HtmlTableDCell>",
      "          </HtmlTableRow>",
      "          <HtmlTableRow event='tr'>",
    ]);

    test("text", [
      "            <HtmlTableDCell event='text'>",
      "              <InlineElement event='text'>",
      "                <Text event='text'>",
    ]);

    test("tbody:close", [
      "                </Text>",
      "              </InlineElement>",
      "            </HtmlTableDCell>",
      "          </HtmlTableRow>",
    ]);
    test("text", [
      "          <HtmlTableRow event='text'>",
      "            <HtmlTableDCell event='text'>",
      "              <InlineElement event='text'>",
      "                <Text event='text'>",
    ]);

    test("table:close", [
      "                </Text>",
      "              </InlineElement>",
      "            </HtmlTableDCell>",
      "          </HtmlTableRow>",
      "        </HtmlTableBody>",
    ]);
    test("table", [
      "      </HtmlTable>",
      "      <HtmlTable event='table'>",
    ]);
    test("text", [
      "        <HtmlTableBody event='text'>",
      "          <HtmlTableRow event='text'>",
      "            <HtmlTableDCell event='text'>",
      "              <InlineElement event='text'>",
      "                <Text event='text'>",
    ]);
    test("text", [
      "                </Text>",
      "                <Text event='text'>",
    ]);
    test("text", [
      "                </Text>",
      "                <Text event='text'>",
    ]);
    test("em", [
      "                </Text>",
      "              </InlineElement>",
      "              <InlineElement event='em'>",
    ]);
    test("text", [
      "                <Text event='text'>",
    ]);

    test("tr", [
      "                </Text>",
      "              </InlineElement>",
      "            </HtmlTableDCell>",
      "          </HtmlTableRow>",
      "          <HtmlTableRow event='tr'>",
    ]);
    test("strong", [
      "            <HtmlTableDCell event='strong'>",
      "              <InlineElement event='strong'>",
    ]);
    test("text", [
      "                <Text event='text'>",
    ]);

    test("th", [
      "                </Text>",
      "              </InlineElement>",
      "            </HtmlTableDCell>",
      "            <HtmlTableHCell event='th'>",
    ]);

    test("text", [
      "              <InlineElement event='text'>",
      "                <Text event='text'>",
    ]);

    test("dt", [
      "                </Text>",
      "              </InlineElement>",
      "              <HtmlDl event='dt'>",
      "                <HtmlDt event='dt'>",
    ]);
    test("text", [
      "                  <InlineElement event='text'>",
      "                    <Text event='text'>",
    ]);

    test("dd", [
      "                    </Text>",
      "                  </InlineElement>",
      "                </HtmlDt>",
      "                <HtmlDd event='dd'>",
    ]);
    test("text", [
      "                  <InlineElement event='text'>",
      "                    <Text event='text'>",
    ]);

    test("dd", [
      "                    </Text>",
      "                  </InlineElement>",
      "                </HtmlDd>",
      "                <HtmlDd event='dd'>",
    ]);
    test("text", [
      "                  <InlineElement event='text'>",
      "                    <Text event='text'>",
    ]);
    test("em", [
      "                    </Text>",
      "                  </InlineElement>",
      "                  <InlineElement event='em'>",
    ]);
    test("text", [
      "                    <Text event='text'>",
    ]);

    test("td", [
      "                    </Text>",
      "                  </InlineElement>",
      "                  <HtmlTable event='td'>",
      "                    <HtmlTableBody event='td'>",
      "                      <HtmlTableRow event='td'>",
      "                        <HtmlTableDCell event='td'>",
    ]);
    test("text", [
      "                          <InlineElement event='text'>",
      "                            <Text event='text'>",
    ]);

    test("table:close", [
      "                            </Text>",
      "                          </InlineElement>",
      "                        </HtmlTableDCell>",
      "                      </HtmlTableRow>",
      "                    </HtmlTableBody>",
    ]);

    test("text", [
      "                  </HtmlTable>",
      "                  <InlineElement event='text'>",
      "                    <Text event='text'>",
    ]);

    test("dl:close", [
      "                    </Text>",
      "                  </InlineElement>",
      "                </HtmlDd>",
    ]);

    test("text", [
      "              </HtmlDl>",
      "              <InlineElement event='text'>",
      "                <Text event='text'>",
    ]);

    test("table:close", [
      "                </Text>",
      "              </InlineElement>",
      "            </HtmlTableHCell>",
      "          </HtmlTableRow>",
      "        </HtmlTableBody>",
    ]);

    test("li", [
      "      </HtmlTable>",
      "      <HtmlUl event='li'>",
      "        <HtmlLi event='li'>",
    ]);
    test("text", [
      "          <InlineElement event='text'>",
      "            <Text event='text'>",
    ]);

    test("dl", [
      "            </Text>",
      "          </InlineElement>",
      "          <HtmlDl event='dl'>",
    ]);
    test("li", [
      "            <HtmlDd event='li'>",
      "              <HtmlUl event='li'>",
      "                <HtmlLi event='li'>",
    ]);

    test("text", [
      "                  <InlineElement event='text'>",
      "                    <Text event='text'>",
    ]);
    test("exit", [
      "                    </Text>",
      "                  </InlineElement>",
      "                </HtmlLi>",
      "              </HtmlUl>",
      "            </HtmlDd>",
      "          </HtmlDl>",
      "        </HtmlLi>",
      "      </HtmlUl>",
      "    </HtmlBody>",
      "  </HtmlDocument>"
    ]);
  });
});
