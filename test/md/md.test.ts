import { newCodeReader } from "../../src/index.ts";
import { newMdReader } from "../../src/md/index.ts";

import { newTestRunner } from "../utils/newTestRunner.ts";
import { newTokenizerTest } from "../utils/newTokenizerTest.ts";

Promise.resolve().then(main).catch(console.error);

async function main() {
  const readCode = newCodeReader();
  // const contentTokenizers: TTokenizerMethod[] = [readCode];
  // const readContent = newCompositeTokenizer(contentTokenizers);
  const readers = {
    // * html:
    //   - readOpenTagTokens: readCode,
    //   - readInstructionsTokens: readCode,
    //   - readTagContentTokens: readContent,
    // * md:
    //   - readHeaderTokens: readCode,
    //   - readSectionTokens: readContent,
    // * list:
    //   - readListItemMarker: TTokenizerMethod;
    //   - readListItemContent?: TTokenizerMethod;
    // * codeblock:
    //   - readCodeBlockContent?: TTokenizerMethod;
    // * fencedblock:
    //   - readFencedContent?: TTokenizerMethod;
    //   - readFencedAttributes?: TTokenizerMethod;
    
    //// compareListItemMarkers?: (startMarker: TToken, endMarker: TToken) => number;
    //// listTokenNames?: {
    ////    List: string;
    ////    ListItem: string;
    ////    ListItemStart: string;
    ////    ListItemContent: string;
    ////    ListItemEnd: string;
    ////  };
    //// },


    readContent: readCode,
  };
  const readToken = newMdReader(readers);
  const runTests = newTestRunner(newTokenizerTest(readToken));
  runTests(`${import.meta.dirname}/data/md`);
}
