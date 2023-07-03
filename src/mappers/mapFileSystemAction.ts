import {
  FileSystemAction,
  FileSystemType,
  MapFileSystemActions,
} from "@/types";
import { getFileSystemValueByType } from "@/utils/fileSystemWeb";
import { get } from "lodash";

export const mapFileSystemAction = (
  action: FileSystemAction,
  type: FileSystemType
) => {
  const fileSystemValue = getFileSystemValueByType(type);
  const actions: MapFileSystemActions = {
    create: {
      action: (fileData, { path }) => {
        const data = get(fileData, path);
        data[""] = fileSystemValue;
      },
    },
    delete: {
      action: (fileData, { path, key }) => {
        if (!path) {
          delete fileData[key as string];
          return;
        }
        const foundItem = get(fileData, path) as Record<string, any>;
        delete foundItem[key as string];
      },
    },
  };
  return actions[action];
};
