import { FC, useState } from "react";
import Tree from "@/components/file-explorer/Tree";
import { DirectoryNode, FileNode } from "@webcontainer/api";
import { FileSystemAction, FileSystemType } from "@/types";

const DirectoryIcon = () => (
  <svg
    height={12}
    width={12}
    className={"mr-1"}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
  >
    <path d="M64 480H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H288c-10.1 0-19.6-4.7-25.6-12.8L243.2 57.6C231.1 41.5 212.1 32 192 32H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64z" />
  </svg>
);

const FileIcon = () => (
  <svg
    height={12}
    width={12}
    className="mr-1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 384 512"
  >
    <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    height={12}
    width={12}
    className="mr-1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 320 512"
  >
    <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg
    height={12}
    width={12}
    className="mr-1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
  >
    <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
  </svg>
);

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
  const [inputValue, setInputValue] = useState("");
  const [showChildren, setShowChildren] = useState(
    currentDirectory.path.startsWith(dir)
  );
  const isDirectory = "directory" in value;
  const isSelected = currentDirectory && dir === currentDirectory.path;
  const isSelectedStyle = isSelected ? "bg-blue-100" : "";
  const type = isDirectory ? "directory" : "file";
  const webcontainer = isDirectory
    ? `${key}.directory`
    : `${key}.file.contents`;
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
        className={`group new-file hover:bg-gray-200 flex p-1 flex-row items-center mb-2 cursor-pointer ${isSelectedStyle}`}
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
          {key === "" ? (
            <input
              autoFocus
              onKeyPress={(event) => {
                if (event.key !== "Enter") return;
                onBlur(
                  inputValue.replace(/\./g, "*"),
                  type,
                  directory.webcontainerPath
                );
              }}
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onBlur={() =>
                onBlur(
                  inputValue.replace(/\./g, "*"),
                  type,
                  directory.webcontainerPath
                )
              }
              className="pl-2 border border-gray-300 rounded-md bg-gray-50"
            />
          ) : (
            <span>{key.replace(/\*/g, ".")}</span>
          )}
        </div>
        <div className="hidden group-hover:block">
          {isDirectory && (
            <div className="flex flex-row gap-1">
              <svg
                onClick={(event) => {
                  event.stopPropagation();
                  setShowChildren(true);
                  onChange("create", type, webcontainerPath);
                }}
                height={16}
                width={16}
                className="cursor-pointer hover:fill-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
              </svg>
              <svg
                onClick={(event) => {
                  event.stopPropagation();
                  setShowChildren(true);
                  onChange("create", "file", webcontainerPath);
                }}
                height={16}
                width={16}
                className="cursor-pointer hover:fill-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
              >
                <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384v38.6C310.1 219.5 256 287.4 256 368c0 59.1 29.1 111.3 73.7 143.3c-3.2 .5-6.4 .7-9.7 .7H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zm48 96a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm16 80c0-8.8-7.2-16-16-16s-16 7.2-16 16v48H368c-8.8 0-16 7.2-16 16s7.2 16 16 16h48v48c0 8.8 7.2 16 16 16s16-7.2 16-16V384h48c8.8 0 16-7.2 16-16s-7.2-16-16-16H448V304z" />
              </svg>
              <svg
                onClick={(event) => {
                  event.stopPropagation();
                  setShowChildren(true);
                  onChange("create", "directory", webcontainerPath);
                }}
                height={16}
                width={16}
                className="cursor-pointer hover:fill-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M512 416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96C0 60.7 28.7 32 64 32H192c20.1 0 39.1 9.5 51.2 25.6l19.2 25.6c6 8.1 15.5 12.8 25.6 12.8H448c35.3 0 64 28.7 64 64V416zM232 376c0 13.3 10.7 24 24 24s24-10.7 24-24V312h64c13.3 0 24-10.7 24-24s-10.7-24-24-24H280V200c0-13.3-10.7-24-24-24s-24 10.7-24 24v64H168c-13.3 0-24 10.7-24 24s10.7 24 24 24h64v64z" />
              </svg>
            </div>
          )}
        </div>
      </div>
      {isDirectory && (
        <ul className="pl-2">
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
  onBlur(value: string, type: FileSystemType, path: string): void;
  onChange(action: FileSystemAction, type: FileSystemType, path: string): void;
  onClick(code: string, dir: string): void;
  setCurrentDirectory(directory: {
    path: string;
    webcontainerPath: string;
  }): void;
  directory: { path: string; webcontainerPath: string };
  currentDirectory: { path: string; webcontainerPath: string };
}

export default TreeNode;
