import fs from "fs/promises";
import path from "path";

export type TFileInfo = {
  path: string;
  stat: {
    isDirectory: () => boolean;
    isFile: () => boolean;
  };
};

export async function* list(
  filePath: string,
  recursive: boolean = true
): AsyncGenerator<TFileInfo> {
  try {
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      const array = await fs.readdir(filePath);
      for (const name of array.sort()) {
        const f = path.join(filePath, name);
        const stat = await fs.stat(f);
        yield { path: f, stat };
        if (recursive && stat.isDirectory()) {
          yield* list(f, true);
        }
      }
    }
  } catch (err) {
    if ((err as any).code !== "ENOENT") throw err;
  }
}

export async function writeText(path: string, content: string) {
  await fs.writeFile(path, content);
}

export async function writeJson(path: string, content: Record<string, any>) {
  await writeText(path, JSON.stringify(content, null, 2));
}

export async function loadJson(
  filePath: string
): Promise<Record<string, any> | undefined> {
  try {
    if (!filePath.match(/\.json$/)) return;
    const str = await fs.readFile(filePath, { encoding: "utf8" });
    return JSON.parse(str);
  } catch (error) {
    return undefined;
  }
}

export async function* readJsonFiles(
  dir: string,
  load: (
    filePath: string
  ) => Promise<Record<string, any> | undefined> = loadJson
): AsyncGenerator<{
  path: string;
  content: Record<string, any>;
}> {
  for await (const fileInfo of list(dir, true)) {
    if (fileInfo.stat.isDirectory()) continue;
    const content = await load(fileInfo.path);
    if (content)
      yield {
        path: fileInfo.path,
        content,
      };
  }
}
