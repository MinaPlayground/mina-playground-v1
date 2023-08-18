import { json } from "./fileSystem.mjs";
import { serialize } from "next-mdx-remote/serialize";
import {
    transformFocusedFiles,
    transformToWebcontainerFiles
} from "./webcontainer.mjs";
import { remarkCodeHike } from "@code-hike/mdx";
import {readFileSync} from "fs";
import path from "path";

export const getTutorialByChapterAndSection = async (c, s) => {
    const dir = process.cwd();
    const { name, focus, highlight } = json(
        `${dir}/tutorials/${c}/${s}/meta.json`
    );

    const files = transformToWebcontainerFiles(`${dir}/tutorials/${c}/${s}/source/`)
    const {focusedFiles, highlightedCode} = transformFocusedFiles(`${dir}/tutorials/${c}/${s}/source/`, focus, highlight)

    const tutorialFileContent = readFileSync(
        `${dir}/tutorials/${c}/${s}/tutorial.mdx`,
        "utf-8"
    );

    const tutorial = await serialize(tutorialFileContent, {
        mdxOptions: {
            remarkPlugins: [
                [remarkCodeHike, { autoImport: false, showCopyButton: true }],
            ],
            useDynamicImport: true,
        },
    });

    return {
        name,
        tutorial,
        files,
        highlightedItem: {highlightedName: path.basename(highlight.replace(/\./g, "*")), highlightedCode},
        focusedFiles,
    };
};
