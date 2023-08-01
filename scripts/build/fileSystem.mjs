import fs from "fs/promises";

export const json = async (
    file
) => {
    const fileContent = await fs.readFile(file, "utf-8");
    return JSON.parse(fileContent);
};
