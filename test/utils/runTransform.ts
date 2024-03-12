import fs from "fs/promises";
import { readJsonFiles, writeJson, writeText } from "./fs-utils.ts";
import { newModuleLoader } from "./newModuleLoader.ts";

export function pad(num: number, size: number) {
  const s = "000000000" + num;
  return s.substring(s.length - size);
}

export async function runTransform(rootDir: string) {
  const checkModulePath = newModuleLoader((p) => {
    return !!p.match(/\.data\.ts$/) && !p.match(/\d+\.data\.ts$/);
  });
  for await (const { path, content } of readJsonFiles(
    rootDir,
    checkModulePath
  )) {
    const { testData = [] } = content;
    let i = 0;
    for (const test of testData) {
      if (!test) continue;
      i++;
      const idx = pad(i * 10, 5);
      const baseDir = path.replace(/\.data\.ts$/, "");

      const { input, description, expected } = test;
      await fs.mkdir(baseDir, { recursive: true });

      const sourcePath = `${baseDir}/${idx}.source.js`;
      const controlPath = `${baseDir}/${idx}.control.json`;
      const formattedSigleLineInput = JSON.stringify(input);
      let formattedInput = formattedSigleLineInput;
      if (formattedSigleLineInput.split(/\\[nr]/).length > 1) {
        formattedInput = formattedSigleLineInput
          .replace(/\\\\/gu, "\\")
          .replace(/[$]\{/gu, "\\${")
          .replace(/`/gu, "\\`")
          .replace(/\\r/gu, "\r")
          .replace(/\\n/gu, "\n");
        formattedInput = `\`${formattedInput.substring(
          1,
          formattedInput.length - 1
        )}\``;
      }
      const formattedSource = `export default {
  description: ${JSON.stringify(description)},
  input: ${formattedInput}
}`;
      await writeText(sourcePath, formattedSource);
      await writeJson(controlPath, expected);
      console.log("* ", test.description);
      console.log(" - ", sourcePath);
      console.log(" - ", controlPath);
    }
  }
}
