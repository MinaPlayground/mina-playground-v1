import path from "path";
import {readdirSync, readFileSync, statSync} from "fs";

export const transformToWebcontainerFiles = (
    dir,
    files = {}
) => {
    const projectDir = readdirSync(dir);
    for (const item of projectDir) {
        const itemPath = path.join(dir, item);
        const stats = statSync(itemPath);
        if (stats.isDirectory()) {
            files[item] = {
                directory: {},
            };
            transformToWebcontainerFiles(itemPath, files[item].directory);
        } else {
            const fileName = path.basename(item);
            const fileContent = readFileSync(itemPath, { encoding: "utf-8" });
            files[fileName.replace(/\./g, "*")] = {
                file: {
                    contents: fileContent,
                },
            };
        }
    }
    return files;
};

export const transformToWebcontainerFilesWithFocus = (
    dir,
    focus,
    files = {},
    focusedFiles = {},
    basePath = dir
) => {
    const projectDir = readdirSync(dir);
    for (const item of projectDir) {
        const itemPath = path.join(dir, item);
        const stats = statSync(itemPath);
        if (stats.isDirectory()) {
            files[item] = {
                directory: {},
            };
            focusedFiles[item] = {
                directory: {},
            };
            transformToWebcontainerFilesWithFocus(
                itemPath,
                focus,
                files[item].directory,
                focusedFiles[item].directory,
                basePath
            );
        } else {
            const fileName = path.basename(item);
            const fileContent = readFileSync(itemPath, { encoding: "utf-8" });
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
