import { get } from "lodash";
import { FileSystemPayload } from "@/types";
import { FileSystemTree } from "@webcontainer/api";

export const mutateFileTreeOnBlur = (
  fileData: FileSystemTree,
  { path, key, value }: FileSystemPayload
) => {
  const foundItem = get(fileData, path || key) as Record<string, any>;
  if (!path) {
    fileData[value] = foundItem;
    delete fileData[key];
    return;
  }
  foundItem[value] = foundItem[key];
  delete foundItem[key];
};
