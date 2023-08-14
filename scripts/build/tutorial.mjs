import { json } from "./fileSystem.mjs";
import { serialize } from "next-mdx-remote/serialize";
import {
    transformToWebcontainerFiles,
    transformToWebcontainerFilesWithFocus,
} from "./webcontainer.mjs";
import { remarkCodeHike } from "@code-hike/mdx";
import {readdirSync, readFileSync} from "fs";

export const getTutorialByChapterAndSection = async (c, s) => {
    const dir = process.cwd();
    const { name, focus, highlight } = json(
        `${dir}/tutorials/${c}/${s}/meta.json`
    );
    const { files, focusedFiles } = transformToWebcontainerFilesWithFocus(
        `${dir}/tutorials/${c}/${s}/src/`,
        focus
    );

    const testFiles = await transformToWebcontainerFiles(
        `${dir}/tutorials/${c}/${s}/tests/`
    );
    const test = readdirSync(`${dir}/tutorials/${c}/${s}/tests`).toString();

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
        test,
        tutorial,
        files,
        highlight,
        focusedFiles,
        testFiles,
    };
};
