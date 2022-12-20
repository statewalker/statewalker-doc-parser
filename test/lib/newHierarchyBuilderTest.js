import expect from "expect.js";
import newHierarchyBuilder from "./newHierarchyBuilder.js";

describe("newHierarchyBuilderTest", () => {
  it(`should rebuild the tree of nodes`, async () => {
    let trace = [];
    const print = (level, msg) => {
      let prefix = "";
      for (let i = 1; i < level; i++) prefix += "  ";
      trace.push(prefix + msg);
    };
    const update = newHierarchyBuilder(
      (level) => print(level, `<${level}>`),
      (level) => print(level, `</${level}>`),
    );

    let level;

    level = update(0);
    expect(level).to.be(0);
    expect(trace).to.eql([]);

    level = update(0);
    expect(level).to.be(0);
    expect(trace).to.eql([]);

    level = update(1);
    expect(level).to.be(1);
    expect(trace).to.eql(["<1>"]);

    level = update(1);
    expect(level).to.be(1);
    expect(trace).to.eql([
      "<1>",
      "</1>",
      "<1>",
    ]);

    trace = [];
    level = update(1);
    expect(level).to.be(1);
    expect(trace).to.eql([
      "</1>",
      "<1>",
    ]);

    trace = [];
    level = update(0);
    expect(level).to.be(0);
    expect(trace).to.eql([
      "</1>",
    ]);

    trace = [];
    level = update(2);
    expect(level).to.be(2);
    expect(trace).to.eql([
      "<1>",
      "  <2>",
    ]);

    trace = [];
    level = update(4);
    expect(level).to.be(4);
    expect(trace).to.eql([
      "    <3>",
      "      <4>",
    ]);

    trace = [];
    level = update(4);
    expect(level).to.be(4);
    expect(trace).to.eql([
      "      </4>",
      "      <4>",
    ]);

    trace = [];
    level = update(1);
    expect(level).to.be(1);
    expect(trace).to.eql([
      "      </4>",
      "    </3>",
      "  </2>",
      "</1>",
      "<1>",
    ]);

    trace = [];
    level = update(0);
    expect(level).to.be(0);
    expect(trace).to.eql([
      "</1>",
    ]);

    trace = [];
    level = update(0);
    expect(level).to.be(0);
    expect(trace).to.eql([]);

    // level = update(3);
    // console.log(level, trace.join('\n'));
  });

  it(`should rebuild hierarchy with node types`, async () => {
    let trace = [];
    const print = (level, msg) => {
      let prefix = "";
      for (let i = 1; i < level; i++) prefix += "  ";
      trace.push(prefix + msg);
    };
    const update = newHierarchyBuilder(
      (level, type) => print(level, `<${type}>`),
      (level, type) => print(level, `</${type}>`),
    );

    update(1, "ul");
    expect(trace).to.eql([
      "<ul>",
    ]);

    update(1, "ul");
    expect(trace).to.eql([
      "<ul>",
      "</ul>",
      "<ul>",
    ]);

    update(2, "ul");
    expect(trace).to.eql([
      "<ul>",
      "</ul>",
      "<ul>",
      "  <ul>",
    ]);

    update(2, "ul");
    expect(trace).to.eql([
      "<ul>",
      "</ul>",
      "<ul>",
      "  <ul>",
      "  </ul>",
      "  <ul>",
    ]);

    update(2, "ol");
    expect(trace).to.eql([
      "<ul>",
      "</ul>",
      "<ul>",
      "  <ul>",
      "  </ul>",
      "  <ul>",
      "  </ul>",
      "  <ol>",
    ]);

    update(4, "ul");
    expect(trace).to.eql([
      "<ul>",
      "</ul>",
      "<ul>",
      "  <ul>",
      "  </ul>",
      "  <ul>",
      "  </ul>",
      "  <ol>",
      "    <ul>",
      "      <ul>",
    ]);
    
    update(4, "ul");
    expect(trace).to.eql([
      "<ul>",
      "</ul>",
      "<ul>",
      "  <ul>",
      "  </ul>",
      "  <ul>",
      "  </ul>",
      "  <ol>",
      "    <ul>",
      "      <ul>",
      "      </ul>",
      "      <ul>",
    ]);

    update(1, "ul");
    // console.log(trace.map(str => `"${str}",`).join('\n'))
    expect(trace).to.eql([
      "<ul>",
      "</ul>",
      "<ul>",
      "  <ul>",
      "  </ul>",
      "  <ul>",
      "  </ul>",
      "  <ol>",
      "    <ul>",
      "      <ul>",
      "      </ul>",
      "      <ul>",
      "      </ul>",
      "    </ul>",
      "  </ol>",
      "</ul>",
      "<ul>",
    ]);
    update(0, "ul");
    expect(trace).to.eql([
      "<ul>",
      "</ul>",
      "<ul>",
      "  <ul>",
      "  </ul>",
      "  <ul>",
      "  </ul>",
      "  <ol>",
      "    <ul>",
      "      <ul>",
      "      </ul>",
      "      <ul>",
      "      </ul>",
      "    </ul>",
      "  </ol>",
      "</ul>",
      "<ul>",
      "</ul>",
    ]);

  });

  it(`should rebuild hierarchy items`, async () => {
    let trace = [];
    const print = (level, msg) => {
      let prefix = "";
      for (let i = 1; i < level; i++) prefix += "  ";
      trace.push(prefix + msg);
    };
    let prevLevel, prevType;
    const update = newHierarchyBuilder(
      (level, type) => {
        if ((prevLevel !== level) || (prevType !== type)) print(level, `<${type}>`);
        prevLevel = level;
        prevType = null;
        // prevType = type;
        print(level, ` <li>`)
      },
      (level, type) => {
        // if (prevLevel !== level) print(level, `</${type}>`);
        print(level, ` </li>`)
        if ((prevLevel !== level) || (prevType !== type)) print(level, `</${type}>`);
        prevLevel = level;
        prevType = type;
      }
    );

    update(1, "x");
    expect(trace).to.eql([
      "<x>",
      " <li>",
    ]);
    update(0, "");
    expect(trace).to.eql([
      "<x>",
      " <li>",
      " </li>",
      "</x>",
    ]);

    update(2, "x");
    expect(trace).to.eql([
      "<x>",
      " <li>",
      "  <x>",
      "   <li>",
    ]);
    update(0, "");
    expect(trace).to.eql([
      "<x>",
      " <li>",
      "  <x>",
      "   <li>",
      "   </li>",
      "  </x>",
      " </li>",
      "</x>",
    ]);
    return 


    update(3, "x");
    expect(trace).to.eql([
      "<x>",
      " <li>",
      "  <x>",
      "   <li>",
      "    <x>",
      "     <li>",
    ]);
    update(0, "");
    expect(trace).to.eql([
      "<x>",
      " <li>",
      "  <x>",
      "   <li>",
      "    <x>",
      "     <li>",
      "     </li>",
      "    </x>",
      "   </li>",
      "  </x>",
      " </li>",
      "</x>",
    ]);
    return 

    update(1, "x");
    expect(trace).to.eql([
      "<x>",
      " <li>"
    ]);
    
    update(1, "x");
    expect(trace).to.eql([
      "<x>",
      " <li>",
      " </li>",
      " <li>"
    ]);

    update(3, "y");
    expect(trace).to.eql([
      "<x>",
      " <li>",
      " </li>",
      " <li>",
      "  <y>",
      "   <li>",
      "    <y>",
      "     <li>",
    ]);

    update(3, "y");
    expect(trace).to.eql([
      "<x>",
      " <li>",
      " </li>",
      " <li>",
      "  <y>",
      "   <li>",
      "    <y>",
      "     <li>",
      "     </li>",
      "     <li>",
    ]);

    update(2, "a");
    expect(trace).to.eql([
      "<x>",
      " <li>",
      " </li>",
      " <li>",
      "  <y>",
      "   <li>",
      "    <y>",
      "     <li>",
      "     </li>",
      "     <li>",
      "     </li>",
      "    </y>",
      "   </li>",
      "  </y>",
      "  <a>",
      "   <li>",
    ]);

  })

});
