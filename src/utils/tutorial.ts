import { json } from "@/utils/fileSystem";
import fs from "fs/promises";
import { serialize } from "next-mdx-remote/serialize";
import {
  transformToWebcontainerFiles,
  transformToWebcontainerFilesWithFocus,
} from "@/utils/webcontainer";

export const getTutorialByChapterAndSection = async (c: string, s: string) => {
  const { name, focus } = await json(`src/tutorials/${c}/${s}/meta.json`);
  const { files, focusedFiles } = await transformToWebcontainerFilesWithFocus(
    `src/tutorials/${c}/${s}/src/`,
    focus
  );

  const testFiles = await transformToWebcontainerFiles(
    `src/tutorials/${c}/${s}/tests/`
  );
  const testFileName = await fs.readdir(`src/tutorials/${c}/${s}/tests`);

  const tutorial = await fs.readFile(
    `src/tutorials/${c}/${s}/tutorial.mdx`,
    "utf-8"
  );
  const mdxSource = await serialize(tutorial);

  return {
    name,
    testFileName,
    mdxSource,
    files,
    focusedFiles,
    testFiles,
  };
};
