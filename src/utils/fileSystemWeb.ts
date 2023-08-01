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
  path: string,
  splitCharacter: string
) => (path ? `${path}${splitCharacter}${key}` : key);
