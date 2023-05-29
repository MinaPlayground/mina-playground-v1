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

const dirs = [
  "src/tutorials/01-introduction/01-smart-contracts/src/Add.ts",
  "src/tutorials/01-introduction/01-smart-contracts/src/test/Test2.ts",
];

export const transformToWebcontainerFilesWithFocus = async (
  dir: string,
  files: Record<string, any> = {},
  focusedFiles: Record<string, any> = {}
) => {
  const projectDir = await fs.readdir(dir);
  for (const item of projectDir) {
    const itemPath = path.join(dir, item);
    const stats = await fs.stat(itemPath);
    if (stats.isDirectory()) {
      files[item] = {
        directory: {},
      };
      focusedFiles[item] = {
        directory: {},
      };
      await transformToWebcontainerFilesWithFocus(
        itemPath,
        files[item].directory,
        focusedFiles[item].directory
      );
    } else {
      const fileName = path.basename(item);
      const fileContent = await fs.readFile(itemPath, { encoding: "utf-8" });
      if (dirs.includes(itemPath)) {
        focusedFiles[fileName] = {
          file: {
            contents: fileContent,
          },
        };
      } else {
        files[fileName] = {
          file: {
            contents: fileContent,
          },
        };
      }
    }
  }
  return { files, focusedFiles };
};
