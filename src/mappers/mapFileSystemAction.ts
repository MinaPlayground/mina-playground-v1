import {
  FileSystemAction,
  FileSystemType,
  MapFileSystemActions,
} from "@/types";

export const mapFileSystemAction = (
  action: FileSystemAction,
  type: FileSystemType
) => {
  const actions: MapFileSystemActions = {
    create: {
      file: {
        action: (data) => {
          data[""] = {
            file: {
              contents: "",
            },
          };
        },
      },
      directory: {
        action: (data) => {
          data[""] = {
            directory: {},
          };
        },
      },
    },
    delete: {
      file: { action: (data) => {} },
      directory: { action: (data) => {} },
    },
    rename: {
      file: { action: (data) => {} },
      directory: { action: (data) => {} },
    },
  };
  return actions[action][type];
};
