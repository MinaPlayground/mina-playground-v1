import { FileSystemTree } from "@webcontainer/api";

export const getCombinedFiles = (
  srcFiles: FileSystemTree,
  files: FileSystemTree,
  focusedFiles: FileSystemTree,
  testFiles: FileSystemTree
) => {
  return {
    ...srcFiles,
    tests: { directory: testFiles },
    src: { directory: { ...files, ...focusedFiles } },
  };
};
