import fs from "fs/promises";
import path from "path";

export const transformToWebcontainerFiles = async (
    dir,
    files = {}
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
            files[fileName.replace(/\./g, "*")] = {
                file: {
                    contents: fileContent,
                },
            };
        }
    }
    return files;
};

export const transformToWebcontainerFilesWithFocus = async (
    dir,
    focus,
    files = {},
    focusedFiles = {},
    basePath = dir
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
                focus,
                files[item].directory,
                focusedFiles[item].directory,
                basePath
            );
        } else {
            const fileName = path.basename(item);
            const fileContent = await fs.readFile(itemPath, { encoding: "utf-8" });
            if (focus.includes(itemPath.replace(basePath, ""))) {
                focusedFiles[fileName.replace(/\./g, "*")] = {
                    file: {
                        contents: fileContent,
                    },
                };
            } else {
                files[fileName.replace(/\./g, "*")] = {
                    file: {
                        contents: fileContent,
                    },
                };
            }
        }
    }
    return { files, focusedFiles };
};
