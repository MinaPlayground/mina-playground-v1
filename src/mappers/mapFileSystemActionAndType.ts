import {
  FileSystemActionOnBlur,
  FileSystemType,
  MapFileSystemActionsAndTypes,
} from "@/types";
import { get } from "lodash";
import { getFileSystemValueByType } from "@/utils/fileSystemWeb";

export const mapFileSystemActionAndType = (
  action: FileSystemActionOnBlur,
  type: FileSystemType
) => {
  const actions: MapFileSystemActionsAndTypes = {
    create: {
      action: (data, { path, value }) => {
        const fileSystemValue = getFileSystemValueByType(type);
        if (!path) {
          data[value] = fileSystemValue;
          delete data[""];
          return;
        }
        const foundItem = get(data, path) as Record<string, any>;
        foundItem[value] = fileSystemValue;
        delete foundItem[""];
      },
    },
    rename: {
      action: (data, { value, path, key }) => {
        const foundItem = get(data, path || key) as Record<string, any>;
        if (!path) {
          data[value] = foundItem;
          delete data[key];
          return;
        }
        foundItem[value] = foundItem[key];
        delete foundItem[key];
      },
    },
  };
  return actions[action];
};
