import { FC } from "react";
import TreeNode from "@/components/file-explorer/TreeNode";
import type { FileSystemTree } from "@webcontainer/api";
import { FileSystemType } from "@/types";

const Tree: FC<TreeProps> = ({
  data,
  onBlur,
  onClick,
  setCurrentDirectory,
  directory = "",
  currentDirectory,
}) => {
  return (
    <ul>
      {Object.entries(data).map((node, index) => (
        <TreeNode
          node={node}
          key={index}
          onBlur={onBlur}
          onClick={onClick}
          directory={directory}
          currentDirectory={currentDirectory}
          setCurrentDirectory={setCurrentDirectory}
        />
      ))}
    </ul>
  );
};

interface TreeProps {
  data: FileSystemTree;
  onBlur(value: string, type: FileSystemType): void;
  onClick(code: string, dir: string): void;
  setCurrentDirectory(directory: string): void;
  directory?: string;
  currentDirectory: string;
}

export default Tree;
