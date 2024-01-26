import { serialize } from "next-mdx-remote/serialize";
import {
    transformFocusedFiles,
    transformToWebcontainerFiles
} from "./webcontainer.mjs";
import { remarkCodeHike } from "@code-hike/mdx";
import {readFileSync} from "fs";
import path from "path";

export const getTutorial = async (c, s) => {
    const dir = process.cwd();
    const tutorialFileContent = readFileSync(
        `${dir}/tutorials/${c}/${s}/tutorial.mdx`,
        "utf-8"
    );
    return await serialize(tutorialFileContent, {
        mdxOptions: {
            remarkPlugins: [
                [remarkCodeHike, { autoImport: false, showCopyButton: true, theme: 'github-dark' }],
            ],
            useDynamicImport: true,
        },
    });
};


export const getTutorialAndFiles = async (c, s, {focus, highlight}) => {
    const dir = process.cwd();
    const {files, filesArray} = transformToWebcontainerFiles(`${dir}/tutorials/${c}/${s}/source/`)
    const {focusedFiles, highlightedCode} = transformFocusedFiles(`${dir}/tutorials/${c}/${s}/source/`, focus, highlight)
    const tutorial = await getTutorial(c, s)

    return {
        tutorial,
        files,
        filesArray,
        highlightedItem: {highlightedName: path.basename(highlight.replace(/\./g, "*")), highlightedCode},
        focusedFiles,
    };
};
export const getFiles = async (c, s, {focus, highlight}) => {
    const dir = process.cwd();
    const {files, filesArray} = transformToWebcontainerFiles(`${dir}/tutorials/${c}/${s}/source/`)
    const {focusedFiles, highlightedCode} = transformFocusedFiles(`${dir}/tutorials/${c}/${s}/source/`, focus, highlight)

    return {
        files,
        filesArray,
        highlightedItem: {highlightedName: path.basename(highlight.replace(/\./g, "*")), highlightedCode},
        focusedFiles,
    };
};

