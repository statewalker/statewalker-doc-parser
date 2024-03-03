import { type TTestData } from "../data.types.ts";

export const testData: TTestData[] = [
  {
    description: "should read document sections",
    input: `# `,
    expected: {
      type: "Block",
      start: 0,
      end: 2,
      value: "# ",
      children: [
        {
          type: "MdSection",
          start: 0,
          end: 2,
          startToken: {
            type: "MdHeader",
            start: 0,
            end: 2,
            startToken: {
              type: "MdHeaderStart",
              start: 0,
              end: 2,
              value: "# ",
              level: 1,
            },
            value: "# ",
          },
          value: "# ",
        },
      ],
    },
  },
  {
    description: "should build sections hierarchy",
    input: `# a\n## b\n### c\n#### d\n##### e\n###### f\n`,
    expected: {
      type: "Block",
      start: 0,
      end: 39,
      value: "# a\n## b\n### c\n#### d\n##### e\n###### f\n",
      children: [
        {
          type: "MdSection",
          start: 0,
          end: 39,
          startToken: {
            type: "MdHeader",
            start: 0,
            end: 3,
            startToken: {
              type: "MdHeaderStart",
              start: 0,
              end: 2,
              value: "# ",
              level: 1,
            },
            value: "# a",
            endToken: { type: "MdHeaderEnd", start: 3, end: 3, value: "" },
          },
          value: "# a\n## b\n### c\n#### d\n##### e\n###### f\n",
          children: [
            {
              type: "MdSection",
              start: 3,
              end: 39,
              startToken: {
                type: "MdHeader",
                start: 3,
                end: 8,
                startToken: {
                  type: "MdHeaderStart",
                  start: 3,
                  end: 7,
                  value: "\n## ",
                  level: 2,
                },
                value: "\n## b",
                endToken: { type: "MdHeaderEnd", start: 8, end: 8, value: "" },
              },
              value: "\n## b\n### c\n#### d\n##### e\n###### f\n",
              children: [
                {
                  type: "MdSection",
                  start: 8,
                  end: 39,
                  startToken: {
                    type: "MdHeader",
                    start: 8,
                    end: 14,
                    startToken: {
                      type: "MdHeaderStart",
                      start: 8,
                      end: 13,
                      value: "\n### ",
                      level: 3,
                    },
                    value: "\n### c",
                    endToken: {
                      type: "MdHeaderEnd",
                      start: 14,
                      end: 14,
                      value: "",
                    },
                  },
                  value: "\n### c\n#### d\n##### e\n###### f\n",
                  children: [
                    {
                      type: "MdSection",
                      start: 14,
                      end: 39,
                      startToken: {
                        type: "MdHeader",
                        start: 14,
                        end: 21,
                        startToken: {
                          type: "MdHeaderStart",
                          start: 14,
                          end: 20,
                          value: "\n#### ",
                          level: 4,
                        },
                        value: "\n#### d",
                        endToken: {
                          type: "MdHeaderEnd",
                          start: 21,
                          end: 21,
                          value: "",
                        },
                      },
                      value: "\n#### d\n##### e\n###### f\n",
                      children: [
                        {
                          type: "MdSection",
                          start: 21,
                          end: 39,
                          startToken: {
                            type: "MdHeader",
                            start: 21,
                            end: 29,
                            startToken: {
                              type: "MdHeaderStart",
                              start: 21,
                              end: 28,
                              value: "\n##### ",
                              level: 5,
                            },
                            value: "\n##### e",
                            endToken: {
                              type: "MdHeaderEnd",
                              start: 29,
                              end: 29,
                              value: "",
                            },
                          },
                          value: "\n##### e\n###### f\n",
                          children: [
                            {
                              type: "MdSection",
                              start: 29,
                              end: 39,
                              startToken: {
                                type: "MdHeader",
                                start: 29,
                                end: 38,
                                startToken: {
                                  type: "MdHeaderStart",
                                  start: 29,
                                  end: 37,
                                  value: "\n###### ",
                                  level: 6,
                                },
                                value: "\n###### f",
                                endToken: {
                                  type: "MdHeaderEnd",
                                  start: 38,
                                  end: 38,
                                  value: "",
                                },
                              },
                              value: "\n###### f\n",
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    description: "should read document sections",
    input: `
# First Header
First paragraph
# Second Header
Second paragraph
## Subsection
Inner paragraph
# Third Header
Third paragraph
`,
    expected: {
      type: "Block",
      start: 0,
      end: 126,
      value:
        "\n# First Header\nFirst paragraph\n# Second Header\nSecond paragraph\n## Subsection\nInner paragraph\n# Third Header\nThird paragraph\n",
      children: [
        {
          type: "MdSection",
          start: 0,
          end: 31,
          startToken: {
            type: "MdHeader",
            start: 0,
            end: 15,
            startToken: {
              type: "MdHeaderStart",
              start: 0,
              end: 3,
              value: "\n# ",
              level: 1,
            },
            value: "\n# First Header",
            endToken: { type: "MdHeaderEnd", start: 15, end: 15, value: "" },
          },
          value: "\n# First Header\nFirst paragraph",
          endToken: { type: "MdSectionEnd", start: 31, end: 31, value: "" },
        },
        {
          type: "MdSection",
          start: 31,
          end: 94,
          startToken: {
            type: "MdHeader",
            start: 31,
            end: 47,
            startToken: {
              type: "MdHeaderStart",
              start: 31,
              end: 34,
              value: "\n# ",
              level: 1,
            },
            value: "\n# Second Header",
            endToken: { type: "MdHeaderEnd", start: 47, end: 47, value: "" },
          },
          value:
            "\n# Second Header\nSecond paragraph\n## Subsection\nInner paragraph",
          endToken: { type: "MdSectionEnd", start: 94, end: 94, value: "" },
          children: [
            {
              type: "MdSection",
              start: 64,
              end: 94,
              startToken: {
                type: "MdHeader",
                start: 64,
                end: 78,
                startToken: {
                  type: "MdHeaderStart",
                  start: 64,
                  end: 68,
                  value: "\n## ",
                  level: 2,
                },
                value: "\n## Subsection",
                endToken: {
                  type: "MdHeaderEnd",
                  start: 78,
                  end: 78,
                  value: "",
                },
              },
              value: "\n## Subsection\nInner paragraph",
              endToken: { type: "MdSectionEnd", start: 94, end: 94, value: "" },
            },
          ],
        },
        {
          type: "MdSection",
          start: 94,
          end: 126,
          startToken: {
            type: "MdHeader",
            start: 94,
            end: 109,
            startToken: {
              type: "MdHeaderStart",
              start: 94,
              end: 97,
              value: "\n# ",
              level: 1,
            },
            value: "\n# Third Header",
            endToken: { type: "MdHeaderEnd", start: 109, end: 109, value: "" },
          },
          value: "\n# Third Header\nThird paragraph\n",
        },
      ],
    },
  },
  {
    description: "should structure documents with empty spaces before headers",
    // Example is taken from here: https://github.com/remarkjs/remark/blob/main/packages/remark/readme.md
    input: `
    # Pluto
    
    Pluto is a dwarf planet in the Kuiper belt.
    
    ## Contents
    
    ## History
    
    ### Discovery
    
    In the 1840s, Urbain Le Verrier used Newtonian mechanics to predict the position of…
    
    ### Name and symbol
    
    The name Pluto is for the Roman god of the underworld, from a Greek epithet for Hades…
    
    ### Planet X disproved
    
    Once Pluto was found, its faintness and lack of a viewable disc cast doubt…
    
    ## Orbit
    
    Pluto's orbital period is about 248 years…
    
    `,
    expected: {
      type: "Block",
      start: 0,
      end: 545,
      value:
        "\n    # Pluto\n    \n    Pluto is a dwarf planet in the Kuiper belt.\n    \n    ## Contents\n    \n    ## History\n    \n    ### Discovery\n    \n    In the 1840s, Urbain Le Verrier used Newtonian mechanics to predict the position of…\n    \n    ### Name and symbol\n    \n    The name Pluto is for the Roman god of the underworld, from a Greek epithet for Hades…\n    \n    ### Planet X disproved\n    \n    Once Pluto was found, its faintness and lack of a viewable disc cast doubt…\n    \n    ## Orbit\n    \n    Pluto's orbital period is about 248 years…\n    \n    ",
      children: [
        {
          type: "MdSection",
          start: 0,
          end: 545,
          startToken: {
            type: "MdHeader",
            start: 0,
            end: 12,
            startToken: {
              type: "MdHeaderStart",
              start: 0,
              end: 7,
              value: "\n    # ",
              level: 1,
            },
            value: "\n    # Pluto",
            endToken: { type: "MdHeaderEnd", start: 12, end: 12, value: "" },
          },
          value:
            "\n    # Pluto\n    \n    Pluto is a dwarf planet in the Kuiper belt.\n    \n    ## Contents\n    \n    ## History\n    \n    ### Discovery\n    \n    In the 1840s, Urbain Le Verrier used Newtonian mechanics to predict the position of…\n    \n    ### Name and symbol\n    \n    The name Pluto is for the Roman god of the underworld, from a Greek epithet for Hades…\n    \n    ### Planet X disproved\n    \n    Once Pluto was found, its faintness and lack of a viewable disc cast doubt…\n    \n    ## Orbit\n    \n    Pluto's orbital period is about 248 years…\n    \n    ",
          children: [
            {
              type: "MdSection",
              start: 65,
              end: 86,
              startToken: {
                type: "MdHeader",
                start: 65,
                end: 86,
                startToken: {
                  type: "MdHeaderStart",
                  start: 65,
                  end: 78,
                  value: "\n    \n    ## ",
                  level: 2,
                },
                value: "\n    \n    ## Contents",
                endToken: {
                  type: "MdHeaderEnd",
                  start: 86,
                  end: 86,
                  value: "",
                },
              },
              value: "\n    \n    ## Contents",
              endToken: { type: "MdSectionEnd", start: 86, end: 86, value: "" },
            },
            {
              type: "MdSection",
              start: 86,
              end: 465,
              startToken: {
                type: "MdHeader",
                start: 86,
                end: 106,
                startToken: {
                  type: "MdHeaderStart",
                  start: 86,
                  end: 99,
                  value: "\n    \n    ## ",
                  level: 2,
                },
                value: "\n    \n    ## History",
                endToken: {
                  type: "MdHeaderEnd",
                  start: 106,
                  end: 106,
                  value: "",
                },
              },
              value:
                "\n    \n    ## History\n    \n    ### Discovery\n    \n    In the 1840s, Urbain Le Verrier used Newtonian mechanics to predict the position of…\n    \n    ### Name and symbol\n    \n    The name Pluto is for the Roman god of the underworld, from a Greek epithet for Hades…\n    \n    ### Planet X disproved\n    \n    Once Pluto was found, its faintness and lack of a viewable disc cast doubt…",
              endToken: {
                type: "MdSectionEnd",
                start: 465,
                end: 465,
                value: "",
              },
              children: [
                {
                  type: "MdSection",
                  start: 106,
                  end: 223,
                  startToken: {
                    type: "MdHeader",
                    start: 106,
                    end: 129,
                    startToken: {
                      type: "MdHeaderStart",
                      start: 106,
                      end: 120,
                      value: "\n    \n    ### ",
                      level: 3,
                    },
                    value: "\n    \n    ### Discovery",
                    endToken: {
                      type: "MdHeaderEnd",
                      start: 129,
                      end: 129,
                      value: "",
                    },
                  },
                  value:
                    "\n    \n    ### Discovery\n    \n    In the 1840s, Urbain Le Verrier used Newtonian mechanics to predict the position of…",
                  endToken: {
                    type: "MdSectionEnd",
                    start: 223,
                    end: 223,
                    value: "",
                  },
                },
                {
                  type: "MdSection",
                  start: 223,
                  end: 348,
                  startToken: {
                    type: "MdHeader",
                    start: 223,
                    end: 252,
                    startToken: {
                      type: "MdHeaderStart",
                      start: 223,
                      end: 237,
                      value: "\n    \n    ### ",
                      level: 3,
                    },
                    value: "\n    \n    ### Name and symbol",
                    endToken: {
                      type: "MdHeaderEnd",
                      start: 252,
                      end: 252,
                      value: "",
                    },
                  },
                  value:
                    "\n    \n    ### Name and symbol\n    \n    The name Pluto is for the Roman god of the underworld, from a Greek epithet for Hades…",
                  endToken: {
                    type: "MdSectionEnd",
                    start: 348,
                    end: 348,
                    value: "",
                  },
                },
                {
                  type: "MdSection",
                  start: 348,
                  end: 465,
                  startToken: {
                    type: "MdHeader",
                    start: 348,
                    end: 380,
                    startToken: {
                      type: "MdHeaderStart",
                      start: 348,
                      end: 362,
                      value: "\n    \n    ### ",
                      level: 3,
                    },
                    value: "\n    \n    ### Planet X disproved",
                    endToken: {
                      type: "MdHeaderEnd",
                      start: 380,
                      end: 380,
                      value: "",
                    },
                  },
                  value:
                    "\n    \n    ### Planet X disproved\n    \n    Once Pluto was found, its faintness and lack of a viewable disc cast doubt…",
                  endToken: {
                    type: "MdSectionEnd",
                    start: 465,
                    end: 465,
                    value: "",
                  },
                },
              ],
            },
            {
              type: "MdSection",
              start: 465,
              end: 545,
              startToken: {
                type: "MdHeader",
                start: 465,
                end: 483,
                startToken: {
                  type: "MdHeaderStart",
                  start: 465,
                  end: 478,
                  value: "\n    \n    ## ",
                  level: 2,
                },
                value: "\n    \n    ## Orbit",
                endToken: {
                  type: "MdHeaderEnd",
                  start: 483,
                  end: 483,
                  value: "",
                },
              },
              value:
                "\n    \n    ## Orbit\n    \n    Pluto's orbital period is about 248 years…\n    \n    ",
            },
          ],
        },
      ],
    },
  },
];
