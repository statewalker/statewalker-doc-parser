import { describe, expect, it } from "../deps.ts";
import { writeJson } from "./fs-utils.ts";
import type { TTestParams } from "./runTests.ts";
import { runTests } from "./runTests.ts";

export function newTestRunner(
  transform: (params: TTestParams) => Record<string, any> | undefined
) {
  return async (rootDir: string) => {
    const message = rootDir.replace(/^.([^/])\/?$/, "$1");
    describe(message, async () => {
      await runTests(rootDir, (params) => {
        const { controlPath, description, control } = params;
        it(description, async () => {
          const result = await transform(params);
          try {
            expect(result).toEqual(control);
          } catch (error) {
            const resultPath = controlPath.replace(/\.control\./, ".result.");
            result && await writeJson(resultPath, result);
            // console.error(error);
            throw error;
          }
        });
      });
    });
  };
}
