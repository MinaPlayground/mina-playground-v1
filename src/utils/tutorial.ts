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
  const test = (await fs.readdir(`src/tutorials/${c}/${s}/tests`)).toString();

  const tutorialFileContent = await fs.readFile(
    `src/tutorials/${c}/${s}/tutorial.mdx`,
    "utf-8"
  );
  const tutorial = await serialize(tutorialFileContent);

  return {
    name,
    test,
    tutorial,
    files,
    focusedFiles,
    testFiles,
  };
};
