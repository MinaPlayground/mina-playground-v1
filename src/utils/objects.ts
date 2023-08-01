import { DirectoryNode, FileNode, FileSystemTree } from "@webcontainer/api";

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

export const getFileContentByPath = (
  path: string,
  object: string | FileSystemTree | Uint8Array
) => {
  return path.split("/").reduce((o, i) => {
    if (!i.includes(".")) {
      return ((o as FileSystemTree)[i] as DirectoryNode).directory;
    }
    return ((o as FileSystemTree)[i.replace(/\./g, "*")] as FileNode).file
      .contents;
  }, object) as string;
};
