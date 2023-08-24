import { ParsedUrlQuery } from "querystring";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { FileSystemTree } from "@webcontainer/api";

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
  | FileSystemHandlerParam<"create", { path: string; value: string }>
  | FileSystemHandlerParam<
      "delete",
      { path: string; key: string; value: string }
    >;

export type FileSystemOnBlurParams =
  | FileSystemHandlerParam<
      "create",
      {
        path: string;
        key: string;
        value: string;
      }
    >
  | FileSystemHandlerParam<
      "rename",
      {
        path: string;
        key: string;
        value: string;
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

export type FileSystemOnClickHandler = (code: string, path: string) => void;

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

export type TutorialResponse =
  | {
      type: "unit" | "playground";
      tutorial: MDXRemoteSerializeResult;
      focusedFiles: FileSystemTree;
      highlightedItem: {
        highlightedName: string;
        highlightedCode: string;
      };
      files: FileSystemTree;
    }
  | {
      type: "theory";
      tutorial: MDXRemoteSerializeResult;
    };
