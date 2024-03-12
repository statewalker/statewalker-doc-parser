import { loadJson, readJsonFiles } from "./fs-utils.ts";
import { newModuleLoader } from "./newModuleLoader.ts";

export type TTestParams = {
  sourcePath: string;
  controlPath: string;
  description: string;
  input: string;
  control: Record<string, any>;
};
export async function runTests(
  rootDir: string,
  runTest: (params: TTestParams) => void
) {
  const loadModule = newModuleLoader((p) => {
    return !!p.match(/\d+\.source\.js$/);
  });
  for await (const { path, content } of readJsonFiles(rootDir, loadModule)) {
    if (!content || !content.default) continue;
    const controlPath = path.replace(/\.source\.js$/, ".control.json");
    const control = await loadJson(controlPath);
    const { description, input } = content.default as {
      description: string;
      input: string;
    };
    await runTest({
      sourcePath: path,
      controlPath,
      description,
      input,
      control: control || {},
    });
  }
}
