import { json } from "./fileSystem.mjs";
import { serialize } from "next-mdx-remote/serialize";
import {
    transformToWebcontainerFiles,
    transformToWebcontainerFilesWithFocus,
} from "./webcontainer.mjs";
import { remarkCodeHike } from "@code-hike/mdx";
import {existsSync, readdirSync, readFileSync} from "fs";

export const getTutorialByChapterAndSection = async (c, s) => {
    let testFiles = []
    let test = ""
    const dir = process.cwd();
    const { name, focus, highlight } = json(
        `${dir}/tutorials/${c}/${s}/meta.json`
    );
    const { files, focusedFiles } = transformToWebcontainerFilesWithFocus(
        `${dir}/tutorials/${c}/${s}/src/`,
        focus
    );

    if (existsSync(`${dir}/tutorials/${c}/${s}/tests/`)) {

        testFiles = transformToWebcontainerFiles(
            `${dir}/tutorials/${c}/${s}/tests/`
        );
        test = readdirSync(`${dir}/tutorials/${c}/${s}/tests`).toString();
    }

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
