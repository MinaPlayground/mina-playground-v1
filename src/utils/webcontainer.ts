import fs from "fs/promises";
import path from "path";

export const transformToWebcontainerFiles = async (
  dir: string,
  files: Record<string, any> = {}
) => {
  const projectDir = await fs.readdir(dir);
  for (const item of projectDir) {
    const itemPath = path.join(dir, item);
    const stats = await fs.stat(itemPath);
    if (stats.isDirectory()) {
      files[item] = {
        directory: {},
      };
      await transformToWebcontainerFiles(itemPath, files[item].directory);
    } else {
      const fileName = path.basename(item);
      const fileContent = await fs.readFile(itemPath, { encoding: "utf-8" });
      files[fileName] = {
        file: {
          contents: fileContent,
        },
      };
    }
  }
  return files;
};
