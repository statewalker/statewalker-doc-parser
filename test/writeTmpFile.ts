import fs from "fs";
import path from "path";

export function writeTmpFile(result: any) {
  const tmpDir = path.resolve("./tmp");
  fs.mkdirSync(tmpDir, { recursive: true });
  const fileName = path.join(tmpDir, new Date().toISOString() + ".json");
  fs.writeFileSync(fileName, JSON.stringify(result, null, 2));
  return fileName;
}
