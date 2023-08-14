import {readFileSync} from "fs";

export const json = (
    file
) => {
    const fileContent = readFileSync(file, "utf-8");
    return JSON.parse(fileContent);
};
