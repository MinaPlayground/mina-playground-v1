import { FileSystemType } from "@/types";

export const getFileSystemValueByType = (type: FileSystemType) =>
  type === "directory"
    ? { directory: {} }
    : {
        file: {
          contents: "",
        },
      };

export const getCombinedPathName = (
  key: string,
  path: string | undefined,
  splitCharacter = "/"
) => (path ? `${path}${splitCharacter}${key}` : key);

export const pathToWebContainerPath = (path: string) =>
  path.replace(/\//g, ".directory.");

export const normalizePath = (path: string) => path.replace(/\*/g, ".");
