import { json } from "@/utils/fileSystem";
import fs from "fs/promises";
import { serialize } from "next-mdx-remote/serialize";
import {
  transformToWebcontainerFiles,
  transformToWebcontainerFilesWithFocus,
} from "@/utils/webcontainer";
import { remarkCodeHike } from "@code-hike/mdx";
import theme from "shiki/themes/github-light.json";

export const getTutorialByChapterAndSection = async (c: string, s: string) => {
  const dir = process.cwd();
  const { name, focus, highlight } = await json(
    `${dir}/tutorials/${c}/${s}/meta.json`
  );
  const { files, focusedFiles } = await transformToWebcontainerFilesWithFocus(
    `${dir}/tutorials/${c}/${s}/src/`,
    focus
  );

  const testFiles = await transformToWebcontainerFiles(
    `${dir}/tutorials/${c}/${s}/tests/`
  );
  const test = (
    await fs.readdir(`${dir}/tutorials/${c}/${s}/tests`)
  ).toString();

  const tutorialFileContent = await fs.readFile(
    `${dir}/tutorials/${c}/${s}/tutorial.mdx`,
    "utf-8"
  );

  const tutorial = await serialize(tutorialFileContent, {
    mdxOptions: {
      remarkPlugins: [
        [remarkCodeHike, { autoImport: false, theme, showCopyButton: true }],
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
