import { FC } from "react";
import TreeNode from "@/components/file-explorer/TreeNode";
import type { FileSystemTree } from "@webcontainer/api";

const Tree: FC<TreeProps> = ({
  data,
  onBlur,
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
  onBlur(value: string): void;
  setCurrentDirectory(directory: string): void;
  directory?: string;
  currentDirectory: string;
}

export default Tree;
