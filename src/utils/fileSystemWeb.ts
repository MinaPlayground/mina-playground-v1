import { FileSystemType } from "@/types";

export const getFileSystemValueByType = (type: FileSystemType) =>
  type === "directory"
    ? { directory: {} }
    : {
        file: {
          contents: "",
        },
      };
