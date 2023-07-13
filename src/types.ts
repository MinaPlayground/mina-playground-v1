import { ParsedUrlQuery } from "querystring";

export type Directory = { path: string; webcontainerPath: string };
export type KeyValueObj = Record<string, any>;
export type FileSystemType = "directory" | "file";
export type FileSystemOnChangePayload = { path: string; key?: string };

export type FileSystemPayload = {
  path: string;
  fullPath: string;
  key: string;
  value: string;
};

type FileSystemHandlerParam<A, P> = [
  action: A,
  type: FileSystemType,
  payload: P
];

export type FileSystemOnChangeParams =
  | FileSystemHandlerParam<"create", { path: string }>
  | FileSystemHandlerParam<"delete", { path: string; key: string }>;

export type FileSystemOnBlurParams =
  | FileSystemHandlerParam<
      "create",
      {
        path: string;
        fullPath: string;
        key: string;
        value: string;
        directoryPath: string;
      }
    >
  | FileSystemHandlerParam<
      "rename",
      {
        path: string;
        key: string;
        value: string;
        directoryPath: string;
      }
    >;

export type FileSystemOnChangeHandler = (
  ...[action, type, payload]: FileSystemOnChangeParams
) => void;

export type FileSystemOnBlurHandler = (
  ...[action, type, payload]: FileSystemOnBlurParams
) => void;

type UpdateFileTreeItem<B extends KeyValueObj> = {
  id: string;
  body: B;
};

export type UpdateFileTree =
  | UpdateFileTreeItem<{
      location: string;
      code: string | undefined;
    }>
  | UpdateFileTreeItem<{
      location: string;
    }>
  | UpdateFileTreeItem<{ location: string; rename: string }>;

export type FileSystemOnClickHandler = (
  code: string,
  path: { path: string; webcontainerPath: string }
) => void;

type MapFileSystemAction = {
  action(data: KeyValueObj, payload: FileSystemOnChangePayload): void;
};

export type MapFileSystemActions = {
  create: MapFileSystemAction;
  delete: MapFileSystemAction;
};

export type FileSystemAction = keyof MapFileSystemActions;

export interface TutorialParams extends ParsedUrlQuery {
  chapter: string;
  section: string;
}
