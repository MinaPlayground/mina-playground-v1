import { FC } from "react";
import TreeNode from "@/components/file-explorer/TreeNode";
import type { FileSystemTree } from "@webcontainer/api";

const Tree: FC<TreeProps> = ({ data }) => {
  return (
    <ul>
      {Object.entries(data).map((node, index) => (
        <TreeNode node={node} key={index} />
      ))}
    </ul>
  );
};

interface TreeProps {
  data: FileSystemTree;
}

export default Tree;
