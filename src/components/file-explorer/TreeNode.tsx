import { FC, useState } from "react";
import Tree from "@/components/file-explorer/Tree";
import { DirectoryNode, FileNode } from "@webcontainer/api";
import { FileSystemType } from "@/types";

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

const TreeNode: FC<TreeNodeProps> = ({
  node,
  onBlur,
  onClick,
  setCurrentDirectory,
  directory,
  currentDirectory,
}) => {
  const [key, value] = node;
  const [showChildren, setShowChildren] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const dir = directory ? `${directory}/${key}` : `${key}`;
  const isDirectory = "directory" in value;
  const isSelected = currentDirectory && dir === currentDirectory;
  const isSelectedStyle = isSelected ? "bg-blue-100" : "";

  const handleClick = () => {
    setCurrentDirectory(dir);
    if (!isDirectory) {
      const code = (value as FileNode).file.contents;
      onClick(code as string, dir);
    }
    setShowChildren(!showChildren);
  };

  // TODO re-do this logic to open the directory when you try to create a new file/folder
  // useEffect(() => {
  //   if (!isSelected) return;
  //   setShowChildren(true);
  // }, [node]);

  return (
    <>
      <div
        onClick={handleClick}
        className={`flex flex-row items-center mb-2 cursor-pointer ${isSelectedStyle}`}
      >
        {isDirectory ? <DirectoryIcon /> : <FileIcon />}
        {key === "" ? (
          <input
            autoFocus
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onBlur={() =>
              onBlur(inputValue, isDirectory ? "directory" : "file")
            }
            className="pl-2 border border-gray-300 rounded-md bg-gray-50"
          />
        ) : (
          <span>{key}</span>
        )}
      </div>
      {isDirectory && (
        <ul className="pl-2">
          {showChildren && (
            <Tree
              data={value.directory}
              onBlur={onBlur}
              onClick={onClick}
              directory={dir}
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
  onBlur(value: string, type: FileSystemType): void;
  onClick(code: string, dir: string): void;
  setCurrentDirectory(directory: string): void;
  directory: string;
  currentDirectory: string;
}

export default TreeNode;
