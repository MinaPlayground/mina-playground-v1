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

export const transformFocusedFiles = (
    dir,
    items,
    highlight
) => {
    let focusedFiles = {}
    let highlightedCode = ''
    for (const item of items) {
        const name = path.basename(item)
        const fileContent = readFileSync(`${dir}/${item}`, {encoding: "utf-8"})
        focusedFiles[name.replace(/\./g, "*")] = {
            file: {
                contents: fileContent
            }
        }
        if (item === highlight) {
            highlightedCode = fileContent
        }
    }
    return {focusedFiles, highlightedCode}
};
