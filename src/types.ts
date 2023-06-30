import { ParsedUrlQuery } from "querystring";

export type FileSystemType = "directory" | "file";

export type MapFileSystemAction = {
  file: {
    action(data: object): void;
  };
  directory: {
    action(data: object): void;
  };
};

export type MapFileSystemActions = {
  create: MapFileSystemAction;
  delete: MapFileSystemAction;
  rename: MapFileSystemAction;
};

export type FileSystemAction = keyof MapFileSystemActions;

export interface TutorialParams extends ParsedUrlQuery {
  chapter: string;
  section: string;
}
