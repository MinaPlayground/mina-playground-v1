import { FileSystemType, MapFileSystemTypeToActions } from "@/types";

export const mapFileSystemTypeToAction = (type: FileSystemType) => {
  const actions: MapFileSystemTypeToActions = {
    file: {
      action: (data, value) => {
        data[value] = {
          file: {
            contents: "",
          },
        };
        delete data[""];
      },
    },
    directory: {
      action: (data, value) => {
        data[value] = {
          directory: {},
        };
        delete data[""];
      },
    },
  };
  return actions[type];
};
