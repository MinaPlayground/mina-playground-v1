import { FC } from "react";
import TreeNode from "@/components/file-explorer/TreeNode";
import type { FileSystemTree } from "@webcontainer/api";

const Tree: FC<TreeProps> = ({ data, onBlur }) => {
  return (
    <ul>
      {Object.entries(data).map((node, index) => (
        <TreeNode node={node} key={index} onBlur={onBlur} />
      ))}
    </ul>
  );
};

interface TreeProps {
  data: FileSystemTree;
  onBlur(): void;
}

export default Tree;
