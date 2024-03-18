import type { TokenizerContext } from "../../src/index.ts";
import {
  newCharReader,
  newDynamicFencedBlockReader,
  newFencedBlockReader,
  newMdListReader,
  readMdListItemMarker,
} from "../../src/index.ts";
import { newTestRunner } from "../utils/newTestRunner.ts";
import { newTokenizerTest } from "../utils/newTokenizerTest.ts";

Promise.resolve().then(main).catch(console.error);

async function main() {
  const readListToken = newMdListReader({
    readListItemMarker: readMdListItemMarker,
  });
  const readToken = newFencedBlockReader(
    "InnerList",
    newCharReader("ListStart", (char) => char === "["),
    readListToken,
    newCharReader("ListEnd", (char) => char === "]")
  );
  const runTests = newTestRunner(newTokenizerTest(readToken));
  runTests(`${import.meta.dirname}/data/lists-alt`);
}

// function getMarkerType(token: TToken) {
//   const marker = token.marker;
//   if (marker === "*" || marker === "-") return "ul";
//   return "ol";
// }
