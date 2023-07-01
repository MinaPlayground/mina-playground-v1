import { ParsedUrlQuery } from "querystring";

export type KeyValueObj = Record<string, any>;
export type FileSystemType = "directory" | "file";

type MapFileSystemAction = {
  file: {
    action(data: KeyValueObj): void;
  };
  directory: {
    action(data: KeyValueObj): void;
  };
};

type MapFileSystemTypeToAction = {
  action(data: KeyValueObj, value: string): void;
};

export type MapFileSystemActions = {
  create: MapFileSystemAction;
  delete: MapFileSystemAction;
  rename: MapFileSystemAction;
};

export type MapFileSystemTypeToActions = {
  file: MapFileSystemTypeToAction;
  directory: MapFileSystemTypeToAction;
};

export type FileSystemAction = keyof MapFileSystemActions;

export interface TutorialParams extends ParsedUrlQuery {
  chapter: string;
  section: string;
}
