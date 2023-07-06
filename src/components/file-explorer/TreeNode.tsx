import { FC, useState } from "react";
import Tree from "@/components/file-explorer/Tree";
import { DirectoryNode, FileNode } from "@webcontainer/api";
import {
  FileSystemAction,
  FileSystemOnChangePayload,
  FileSystemPayload,
  FileSystemType,
} from "@/types";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  DirectoryIcon,
  FileIcon,
} from "@/icons/FileSystemIcons";
import {
  CreateDirectoryActionIcon,
  CreateFileActionIcon,
  DeleteActionIcon,
  RenameActionIcon,
} from "@/icons/FileSystemActionIcons";

const TreeNode: FC<TreeNodeProps> = ({
  node,
  onBlur,
  onChange,
  onClick,
  setCurrentDirectory,
  directory,
  currentDirectory,
}) => {
  const [key, value] = node;
  const dir = directory.path ? `${directory.path}/${key}` : `${key}`;
  const [inputValue, setInputValue] = useState(key.replace(/\*/g, "."));
  const [isEditing, setIsEditing] = useState(false);
  const [showChildren, setShowChildren] = useState(
    currentDirectory.path.startsWith(dir)
  );
  const isDirectory = "directory" in value;
  const isSelected = currentDirectory && dir === currentDirectory.path;
  const isSelectedStyle = isSelected ? "bg-gray-200" : "";
  const type = isDirectory ? "directory" : "file";
  const webcontainer = isDirectory
    ? `${key || inputValue.replace(/\./g, "*")}.directory`
    : `${key || inputValue.replace(/\./g, "*")}.file.contents`;
  const webcontainerPath = directory.webcontainerPath
    ? `${directory.webcontainerPath}.${webcontainer}`
    : webcontainer;
  const handleClick = () => {
    setCurrentDirectory({ path: dir, webcontainerPath });
    if (!isDirectory) {
      const code = (value as FileNode).file.contents;
      onClick(code as string, dir);
    }
    setShowChildren(!showChildren);
  };

  return (
    <>
      <div
        onClick={handleClick}
        className={`group new-file hover:bg-gray-200 flex flex-row items-center mb-1 cursor-pointer ${isSelectedStyle}`}
      >
        <div className="flex flex-1 flex-row items-center">
          {isDirectory ? (
            showChildren ? (
              <ChevronDownIcon />
            ) : (
              <ChevronRightIcon />
            )
          ) : null}
          {isDirectory ? <DirectoryIcon /> : <FileIcon />}
          {/*<Text />*/}
          {key === "" || isEditing ? (
            <input
              autoFocus
              onKeyPress={(event) => {
                if (event.key !== "Enter") return;
                if (key === inputValue) {
                  setIsEditing(false);
                  setShowChildren(false);
                  return;
                }
                onBlur(isEditing ? "rename" : "create", {
                  path: directory.webcontainerPath,
                  fullPath: webcontainerPath,
                  key,
                  value: inputValue.replace(/\./g, "*"),
                });
                setIsEditing(false);
                setShowChildren(false);
              }}
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onBlur={() => {
                if (key === inputValue) {
                  setIsEditing(false);
                  setShowChildren(false);
                  return;
                }
                onBlur(isEditing ? "rename" : "create", {
                  path: directory.webcontainerPath,
                  fullPath: webcontainerPath,
                  key,
                  value: inputValue.replace(/\./g, "*"),
                });
                setIsEditing(false);
                setShowChildren(false);
              }}
              className="pl-2 border border-gray-300 rounded-md bg-gray-50"
            />
          ) : (
            <span className="text-sm">{key.replace(/\*/g, ".")}</span>
          )}
        </div>
        <div className="hidden group-hover:block">
          <div className="flex flex-row gap-1">
            <DeleteActionIcon
              onClick={(event) => {
                event.stopPropagation();
                onChange("delete", "file", {
                  path: directory.webcontainerPath,
                  key,
                });
              }}
            />
            <RenameActionIcon
              onClick={(event) => {
                event.stopPropagation();
                setInputValue(key.replace(/\*/g, "."));
                setIsEditing(true);
              }}
            />
            {isDirectory && (
              <>
                <CreateFileActionIcon
                  onClick={(event) => {
                    event.stopPropagation();
                    setShowChildren(true);
                    onChange("create", "file", { path: webcontainerPath });
                  }}
                />
                <CreateDirectoryActionIcon
                  onClick={(event) => {
                    event.stopPropagation();
                    setShowChildren(true);
                    onChange("create", "directory", { path: webcontainerPath });
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
      {isDirectory && (
        <ul className="pl-4">
          {showChildren && (
            <Tree
              data={value.directory}
              onBlur={onBlur}
              onChange={onChange}
              onClick={onClick}
              directory={{ path: dir, webcontainerPath }}
              currentDirectory={currentDirectory}
              setCurrentDirectory={setCurrentDirectory}
            />
          )}
        </ul>
      )}
    </>
  );
};

interface TreeNodeProps {
  node: [string, DirectoryNode | FileNode];
  onBlur(action: "create" | "rename", payload: FileSystemPayload): void;
  onChange(
    action: FileSystemAction,
    type: FileSystemType,
    payload: FileSystemOnChangePayload
  ): void;
  onClick(code: string, dir: string): void;
  setCurrentDirectory(directory: {
    path: string;
    webcontainerPath: string;
  }): void;
  directory: { path: string; webcontainerPath: string };
  currentDirectory: { path: string; webcontainerPath: string };
}

export default TreeNode;
