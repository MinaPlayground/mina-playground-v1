import { json } from "@/utils/fileSystem";
import fs from "fs/promises";
import { serialize } from "next-mdx-remote/serialize";
import {
  transformToWebcontainerFiles,
  transformToWebcontainerFilesWithFocus,
} from "@/utils/webcontainer";
import path from "path";

export const getTutorialByChapterAndSection = async (c: string, s: string) => {
  const { name, focus } = await json(
    `${process.cwd()}/tutorials/${c}/${s}/meta.json`
  );

  const dir = path.join(
    process.cwd(),
    "tutorials",
    "01-introduction",
    "01-smart-contracts",
    "src"
  );
  const { files, focusedFiles } = await transformToWebcontainerFilesWithFocus(
    dir,
    focus
  );

  const testFiles = await transformToWebcontainerFiles(
    `${process.cwd()}/tutorials/${c}/${s}/tests`
  );
  const test = (
    await fs.readdir(`${process.cwd()}/tutorials/${c}/${s}/tests`)
  ).toString();

  const tutorialFileContent = await fs.readFile(
    `${process.cwd()}/tutorials/${c}/${s}/tutorial.mdx`,
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
