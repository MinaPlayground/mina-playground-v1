import fs from "fs";
import path from "path";

export const transformToWebcontainerFiles = (
  dir: string,
  files: Record<string, any> = {}
) => {
  const projectDir = fs.readdirSync(dir);
  for (const item of projectDir) {
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);
    if (stats.isDirectory()) {
      files[item] = {
        directory: {},
      };
      transformToWebcontainerFiles(itemPath, files[item].directory);
    } else {
      const fileName = path.basename(item);
      const fileContent = fs.readFileSync(itemPath, { encoding: "utf-8" });
      files[fileName] = {
        file: {
          contents: fileContent,
        },
      };
    }
  }
  return files;
};
